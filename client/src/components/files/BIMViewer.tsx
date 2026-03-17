import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { Button } from '../ui/button';
import { Layers, Box, Maximize2, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BIMViewerProps {
  url: string;
  className?: string;
}

export function BIMViewer({ url, className }: BIMViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-950

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- Grid / Floor ---
    const grid = new THREE.GridHelper(50, 50, 0x334155, 0x1e293b);
    scene.add(grid);

    // --- IFC Loading ---
    const ifcLoader = new IFCLoader();
    
    // Setting wasm path if needed (web-ifc-three usually handles this or needs it in public)
    // For now we assume standard integration
    
    ifcLoader.load(
      url,
      (ifcModel) => {
        scene.add(ifcModel);
        setIsLoading(false);
        
        // Fit camera to model
        const box = new THREE.Box3().setFromObject(ifcModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Zoom out a bit

        camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
      },
      (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        setProgress(Math.round(percent));
      },
      (err) => {
        console.error('IFC Load Error:', err);
        setError('Failed to load BIM model. Ensure the file is a valid IFC.');
        setIsLoading(false);
      }
    );

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      // Dispose geometry/materials manually if needed for perf
    };
  }, [url]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-white/5 shadow-2xl group", className)}>
      <canvas ref={canvasRef} className="w-full h-full outline-none" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-bold text-sm">Loading Model {progress}%</p>
          <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
            <Box className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">BIM Viewer Error</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8">
            {error}
          </p>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      {!isLoading && !error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
           <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10" title="Isolate Floors">
             <Layers className="w-5 h-5" />
           </Button>
           <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10" title="View Settings">
             <Box className="w-5 h-5" />
           </Button>
           <div className="w-px h-6 bg-white/10 mx-1" />
           <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10" title="Fullscreen">
             <Maximize2 className="w-5 h-5" />
           </Button>
        </div>
      )}
      
      <div className="absolute top-6 left-6 pointer-events-none">
         <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">3D BIM RENDERING ACTIVE</span>
         </div>
      </div>
    </div>
  );
}
