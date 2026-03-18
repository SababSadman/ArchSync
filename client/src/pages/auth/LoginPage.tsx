import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  FolderOpen, 
  History, 
  Globe, 
  Sparkles,
  ArrowRight,
  Chrome,
  Github
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { full_name: email.split('@')[0] } }
        });
        if (error) throw error;
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      {/* LEFT SIDE: Brand & Features */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[var(--text-primary)] relative overflow-hidden p-16">
        {/* Logo */}
        <div className="flex items-baseline font-serif text-[22px] tracking-tight mb-auto z-10">
          <span className="text-white">Arch</span>
          <span className="text-[var(--accent)]">Sync</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 mb-12">
          <h1 className="font-serif text-[clamp(32px,3.5vw,48px)] leading-tight text-white max-w-lg">
            Welcome to the future of <span className="italic">architecture collaboration.</span>
          </h1>
          <p className="text-white/50 text-[15px] mt-6 max-w-sm font-medium">
            Syncing complex designs, BIM data, and team feedback into one seamless, premium workflow.
          </p>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 gap-8 relative z-10">
          {[
            { icon: FolderOpen, text: "Drag-and-drop file management with WebGL CAD viewer" },
            { icon: History, text: "Full version control with side-by-side comparison" },
            { icon: Globe, text: "Client portal with digital sign-off" },
            { icon: Sparkles, text: "AI meeting summaries and auto changelogs" }
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-[14px] font-medium tracking-tight">
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[380px]">
          {/* Tab Switcher */}
          <div className="bg-[var(--bg-raised)] p-1 rounded-full flex mb-12">
            {(['signin', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2 text-[13px] font-bold rounded-full transition-all",
                  tab === t 
                    ? "bg-white text-[var(--text-primary)] shadow-sm" 
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {t === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h2 className="font-serif text-[32px] text-[var(--text-primary)] mb-8 italic">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 h-11 border border-[var(--border-default)] rounded-xl bg-white hover:bg-[var(--bg-raised)] transition-all font-semibold text-[13px]"
            >
              <Chrome className="w-4 h-4" />
              Google
            </button>
            <button 
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 h-11 border border-[var(--border-default)] rounded-xl bg-white hover:bg-[var(--bg-raised)] transition-all font-semibold text-[13px]"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)]">
              or use email
            </span>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {tab === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  className="h-11 px-4 bg-white border border-[var(--border-default)] rounded-xl text-[14px] outline-none focus:border-[var(--accent)] transition-all w-full"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  className="h-11 px-4 bg-white border border-[var(--border-default)] rounded-xl text-[14px] outline-none focus:border-[var(--accent)] transition-all w-full"
                />
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 px-4 bg-white border border-[var(--border-default)] rounded-xl text-[14px] outline-none focus:border-[var(--accent)] transition-all w-full"
            />
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 px-4 bg-white border border-[var(--border-default)] rounded-xl text-[14px] outline-none focus:border-[var(--accent)] transition-all w-full"
              />
              {tab === 'signin' && (
                <button type="button" className="mt-2 text-[var(--accent)] text-[12px] font-bold hover:underline block ml-auto">
                  Forgot password?
                </button>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full h-[42px] bg-[var(--text-primary)] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-[14px] mt-6"
            >
              {loading ? 'Processing...' : (
                <>
                  {tab === 'signin' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {error && (
              <p className="text-[var(--red)] text-[12px] text-center mt-4 font-medium animate-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-12 leading-relaxed font-medium">
              By continuing, you agree to ArchSync's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
