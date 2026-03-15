import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { UserPlus, Mail, Lock, Loader2, ArrowRight, User } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization_id: '00000000-0000-0000-0000-000000000000', // Default org
          }
        }
      });

      if (error) throw error;
      
      alert('Signup successful! Please check your email for confirmation (or you can login directly if confirm email is disabled).');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600 opacity-[0.04] blur-[100px]" />
      
      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
            <CardTitle className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Join the Studio</CardTitle>
            <CardDescription className="text-[var(--text-secondary)] font-medium">
              Create your architect profile and start syncing your work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <Input
                    type="text"
                    placeholder="E.g. Zaha Hadid"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-11 h-12 bg-transparent border-[var(--border-default)] focus-visible:ring-[var(--accent)] transition-all rounded-xl"
                  />
                </div>
              </div>
              
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] ml-1">
                  Password
                </label>
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
                <p className="text-[10px] text-[var(--text-tertiary)] font-bold px-1 py-1">
                  Minimum 8 characters with numbers & symbols.
                </p>
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
                    Create Architect Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <p className="text-center w-full text-xs font-medium text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent)] font-bold hover:underline transition-colors">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
          The Workspace for Modern Architectural Excellence
        </p>
      </div>
    </div>
  );
}
