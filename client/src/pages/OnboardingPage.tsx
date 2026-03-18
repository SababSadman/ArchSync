import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  Library, 
  Construction,
  Plus,
  X,
  Upload,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

type Step = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const navigate = useNavigate();
  
  // Confetti effect on mount of Step 5
  useEffect(() => {
    if (step === 5) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [step]);

  const renderProgress = () => (
    <div className="w-full max-w-lg mb-12">
      <div className="flex justify-between items-center mb-4 relative px-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="relative z-10">
            <div className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
              step > s ? "bg-[var(--green)] border-[var(--green)] text-white" :
              step === s ? "border-[var(--accent)] bg-white shadow-[0_0_0_4px_rgba(31,111,235,0.15)]" :
              "bg-white border-[var(--bg-sunken)]"
            )}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : <span className={cn("text-xs font-bold", step === s ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]")}>{s}</span>}
            </div>
          </div>
        ))}
        {/* Connecting Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--bg-sunken)] -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--green)] -translate-y-1/2 transition-all duration-700 ease-in-out" 
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center pt-16 px-8">
      {/* Logo */}
      <div className="flex items-baseline font-serif text-[22px] tracking-tight mb-16">
        <span className="text-[var(--text-primary)]">Arch</span>
        <span className="text-[var(--accent)]">Sync</span>
      </div>

      {renderProgress()}

      <div className="w-full max-w-[560px] bg-white border border-[var(--border-subtle)] rounded-[20px] shadow-sm p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-3xl mb-4 block">👋</span>
              <h2 className="font-serif text-[28px] italic text-[var(--text-primary)] mb-2">Welcome to the Workspace</h2>
              <p className="text-[var(--text-secondary)] font-medium">Let's set up your design identity.</p>
            </div>
            <div className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-1">Full Name</label>
                <input className="w-full h-12 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] transition-all font-medium" defaultValue="Ana Kim" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-1">Studio Name</label>
                <input className="w-full h-12 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] transition-all font-medium" placeholder="e.g. Studio Meridian" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-1">Role</label>
                <select className="w-full h-12 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] transition-all font-medium appearance-none">
                  <option>Principal Architect</option>
                  <option>Lead Designer</option>
                  <option>Project Manager</option>
                  <option>Client Representative</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full h-12 bg-[var(--text-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all mt-4"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-3xl mb-4 block">📁</span>
              <h2 className="font-serif text-[28px] italic text-[var(--text-primary)] mb-2">Your First Project</h2>
              <p className="text-[var(--text-secondary)] font-medium">Start with a template or build from scratch.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: Building2, label: 'Commercial' },
                { icon: Home, label: 'Residential' },
                { icon: Library, label: 'Civic & Culture' },
                { icon: Construction, label: 'Blank Project' }
              ].map((t) => (
                <button 
                  key={t.label}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 border rounded-[14px] transition-all gap-3 hover:bg-[var(--bg-raised)]",
                    t.label === 'Blank Project' ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border-default)] bg-white"
                  )}
                >
                  <t.icon className={cn("w-6 h-6", t.label === 'Blank Project' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]")} />
                  <span className={cn("text-[13px] font-bold", t.label === 'Blank Project' ? "text-[var(--accent)]" : "text-[var(--text-primary)]")}>{t.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] px-1">Project Name</label>
              <input className="w-full h-12 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none focus:border-[var(--accent)] transition-all font-medium" placeholder="e.g. Riverside Tower" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-12 border border-[var(--border-default)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--bg-raised)]">Back</button>
              <button onClick={() => setStep(3)} className="bg-[var(--text-primary)] text-white flex-[2] h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">Create Project <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-3xl mb-4 block">👥</span>
              <h2 className="font-serif text-[28px] italic text-[var(--text-primary)] mb-2">Invite your Team</h2>
              <p className="text-[var(--text-secondary)] font-medium">Architecture is a team sport. Add collaborators.</p>
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <input className="flex-1 h-11 px-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none text-[13px]" placeholder="email@studio.com" />
                  <select className="w-[110px] h-11 px-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-xl outline-none text-[12px] appearance-none">
                    <option>Editor</option>
                    <option>Viewer</option>
                    <option>Admin</option>
                  </select>
                </div>
              ))}
              <button className="flex items-center gap-2 text-[var(--accent)] text-[12px] font-bold mt-2 hover:opacity-80">
                <Plus className="w-3.5 h-3.5" /> Add another
              </button>
            </div>
            <div className="flex gap-3 pt-6">
              <button onClick={() => setStep(4)} className="flex-1 h-12 text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--bg-raised)]">Skip for now</button>
              <button onClick={() => setStep(4)} className="bg-[var(--text-primary)] text-white flex-[2] h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">Send Invites <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-3xl mb-4 block">📤</span>
              <h2 className="font-serif text-[28px] italic text-[var(--text-primary)] mb-2">Initialize Assets</h2>
              <p className="text-[var(--text-secondary)] font-medium">Upload your first drawing set or BIM model.</p>
            </div>
            <div className="w-full h-[180px] border-2 border-dashed border-[var(--border-default)] rounded-[14px] flex flex-col items-center justify-center gap-3 hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-all cursor-pointer group">
              <div className="p-3 bg-[var(--bg-raised)] rounded-full group-hover:bg-white/50">
                <Upload className="w-6 h-6 text-[var(--text-tertiary)]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-bold text-[var(--text-primary)]">Drop files here to start syncing</p>
                <p className="text-[11px] font-mono text-[var(--text-tertiary)] mt-1 tracking-tight">DWG · RVT · IFC · PDF · PNG</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(5)} className="flex-1 h-12 text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--bg-raised)]">Later</button>
              <button onClick={() => setStep(5)} className="bg-[var(--text-primary)] text-white flex-[2] h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">Upload & Continue <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-3xl mb-4 block">🎉</span>
              <h2 className="font-serif text-[28px] italic text-[var(--text-primary)] mb-2">Welcome to ArchSync</h2>
              <p className="text-[var(--text-secondary)] font-medium">Workspace ready. Studio Meridian is now live.</p>
            </div>
            <div className="space-y-4 pt-4">
              {[
                { title: 'Project Context', desc: 'Manage drawings with full version history.' },
                { title: 'Real-time Pins', desc: 'Place spatial comments directly on plans.' },
                { title: 'BIM Streaming', desc: 'Walk through Revit and IFC models in-browser.' }
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-4 p-4 border border-[var(--border-subtle)] rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-[var(--green-bg)] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[var(--text-primary)]">{f.title}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full h-12 bg-[var(--accent)] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[var(--accent-dark)] transition-all mt-4"
            >
              Go to my Dashboard
            </button>
            <div className="text-center mt-6">
              <p className="text-[11px] font-mono text-[var(--text-tertiary)] flex items-center justify-center gap-1.5 font-medium">
                Tip: Press <span className="px-1.5 py-0.5 bg-[var(--bg-raised)] rounded border border-[var(--border-subtle)]">⌘</span><span className="px-1.5 py-0.5 bg-[var(--bg-raised)] rounded border border-[var(--border-subtle)]">K</span> to open command palette
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
