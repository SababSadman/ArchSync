import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#0a0f23] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-pink-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full"></div>
      </div>

      <header className="relative z-10 flex flex-col items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative group cursor-pointer group">
           <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           <div className="relative p-6 bg-[#0a0f23] rounded-full">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 2 2 2 0 01-4 2 2 2 0 01-2-2 2 2 0 012-2zM4 17.5A2.5 2.5 0 016.5 15h11a2.5 2.5 0 012.5 2.5V21h-16v-3.5zM12 7l3 3m0 0l-3 3m3-3H9" />
            </svg>
           </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
              ArchSync
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Beautifully integrated with <span className="text-teal-400 font-medium">Tailwind CSS v4</span>, Vite, and React.
          </p>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center gap-6">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="group relative px-8 py-4 bg-white text-[#0a0f23] font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative flex items-center gap-2">
            Count is: {count}
          </span>
        </button>

        <p className="text-sm text-gray-500 font-mono italic">
          Edit src/App.tsx to start building
        </p>
      </main>

      <footer className="absolute bottom-8 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} ArchSync. All rights reserved.
      </footer>
    </div>
  )
}

export default App
