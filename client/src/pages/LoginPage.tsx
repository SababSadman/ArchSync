import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { LayoutDashboard, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 opacity-[0.03] blur-[120px]" />
      
      <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-5 py-3 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-white flex items-center justify-center text-[12px] font-black">
              AS
            </div>
            <span className="text-lg font-black tracking-tight text-[var(--text-primary)]">
              ArchSync <span className="text-[var(--accent)] text-xs ml-0.5">•</span> Studio
            </span>
          </div>
        </div>

        <Card className="border-[var(--border-subtle)] shadow-2xl bg-[var(--bg-surface)]/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--accent)] to-blue-600" />
          <CardHeader className="space-y-2 pt-8">
            <CardTitle className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Welcome back</CardTitle>
            <CardDescription className="text-[var(--text-secondary)] font-medium">
              Enter your credentials to access your studio dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-1">
                  Studio Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <Input
                    type="email"
                    placeholder="name@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-12 bg-transparent border-[var(--border-default)] focus-visible:ring-[var(--accent)] transition-all rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                    Password
                  </label>
                  <a href="#" className="text-[10px] font-bold text-[var(--accent)] hover:underline uppercase tracking-tighter">
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 h-12 bg-transparent border-[var(--border-default)] focus-visible:ring-[var(--accent)] transition-all rounded-xl"
                  />
                </div>
              </div>

              {error && (
                <div className="text-[11px] font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-300">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-[var(--text-primary)] hover:bg-[var(--accent)] text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Enter Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <p className="text-center w-full text-xs font-medium text-[var(--text-secondary)]">
              New to the studio?{' '}
              <Link to="/signup" className="text-[var(--accent)] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
          Powered by ArchSync Engine © 2026
        </p>
      </div>
    </div>
  );
}
