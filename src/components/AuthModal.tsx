import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Check,
  Zap,
  Coffee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playTactileClick, playCremaChime } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  if (!isOpen) return null;

  const { login, signup, quickLogin } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [grindPref, setGrindPref] = useState('Espresso Fine (9 Bar)');
  const [subscribeSysteme, setSubscribeSysteme] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          playCremaChime();
          if (onSuccess) onSuccess('Signed in successfully! Welcome back to the Lab.');
          onClose();
        } else {
          setErrorMsg(res.error || 'Authentication failed');
        }
      } else if (mode === 'signup') {
        const res = await signup(name, email, password, 'Cup of Excellence Vault', grindPref);
        if (res.success) {
          playCremaChime();
          if (onSuccess) onSuccess('Account created & synced to Systeme.io!');
          onClose();
        } else {
          setErrorMsg(res.error || 'Registration failed');
        }
      } else if (mode === 'forgot') {
        setTimeout(() => {
          setForgotSent(true);
          setLoading(false);
        }, 600);
        return;
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (userKey: 'julian' | 'elena') => {
    playTactileClick();
    quickLogin(userKey);
    playCremaChime();
    if (onSuccess) {
      onSuccess(
        userKey === 'julian'
          ? 'Logged in as Julian Vance (VIP Member)'
          : 'Logged in as Elena Rostova (Nitro Subscriber)'
      );
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#141721] border border-white/12 rounded-[1.5rem] shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mode Switcher */}
        <div className="p-6 bg-gradient-to-b from-[#1B202E] to-[#141721] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff9f43]/20 flex items-center justify-center text-[#ff9f43]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                {mode === 'signin'
                  ? 'Sign In to Cockpit'
                  : mode === 'signup'
                  ? 'Create Member Profile'
                  : 'Reset Extraction Pass'}
              </h2>
              <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-widest text-[#dac2b1]/60">
                Obsidian Brew & Systeme.io
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        {mode !== 'forgot' && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-[#0E1118] rounded-xl border border-white/10 text-xs font-['Space_Grotesk'] font-bold">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setMode('signin');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-[#FF9F43] text-[#0B0D13] shadow-md shadow-[#ff9f43]/20 font-bold'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-[#FF9F43] text-[#0B0D13] shadow-md shadow-[#ff9f43]/20 font-bold'
                    : 'text-[#dac2b1]/60 hover:text-white'
                }`}
              >
                Join / Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#ffb4ab] text-xs font-['Plus_Jakarta_Sans']">
              {errorMsg}
            </div>
          )}

          {forgotSent ? (
            <div className="p-5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-3">
              <Check className="w-8 h-8 text-[#10B981] mx-auto" />
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                Password Reset Dispatched
              </h3>
              <p className="text-xs text-[#dac2b1]/80">
                A secure login link has been dispatched to <span className="text-white font-medium">{email}</span>.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setMode('signin');
                }}
                className="text-xs font-['Space_Grotesk'] font-bold text-[#00f2fe] hover:underline block mx-auto"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name for signup */}
              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#00f2fe]">
                    <UserIcon className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                  Email Address
                </label>
                <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#00f2fe]">
                  <Mail className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          playTactileClick();
                          setMode('forgot');
                        }}
                        className="text-[10px] font-['Space_Grotesk'] text-[#00f2fe] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center bg-[#0E1118] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#00f2fe]">
                    <Lock className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Signup preferences: Preferred Grind & Systeme.io Opt-in */}
              {mode === 'signup' && (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-['Space_Grotesk'] uppercase text-white/70 font-semibold block mb-1">
                      Default Grind Calibration
                    </label>
                    <select
                      value={grindPref}
                      onChange={(e) => setGrindPref(e.target.value)}
                      className="w-full bg-[#0E1118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f2fe]"
                    >
                      <option value="Espresso Fine (9 Bar)">Espresso Fine (9 Bar)</option>
                      <option value="Whole Bean">Whole Bean</option>
                      <option value="Coarse (French/Chemex)">Coarse (French/Chemex)</option>
                      <option value="Cold Extraction Ultra-Fine">Cold Extraction Ultra-Fine</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-[#dac2b1]/80 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={subscribeSysteme}
                      onChange={(e) => setSubscribeSysteme(e.target.checked)}
                      className="mt-0.5 accent-[#ff9f43]"
                    />
                    <span>
                      Sync with <strong className="text-white">Systeme.io</strong> contact list for micro-lot roast alerts & exclusive allocation drops.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full crema-btn text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'signin'
                        ? 'Sign In to Account'
                        : mode === 'signup'
                        ? 'Create & Sync Profile'
                        : 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Pills for Instant Testing */}
          {mode === 'signin' && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-['Space_Grotesk'] uppercase tracking-wider text-white/50 block font-semibold">
                Instant 1-Click Demo Profiles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('julian')}
                  className="p-2.5 rounded-xl bg-[#181B24] hover:bg-[#202533] border border-[#a78bfa]/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span className="text-xs font-bold text-white group-hover:text-[#ffc697]">
                      Julian Vance
                    </span>
                  </div>
                  <span className="text-[10px] text-[#dac2b1]/60 block mt-0.5">
                    VIP Vault Member
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('elena')}
                  className="p-2.5 rounded-xl bg-[#181B24] hover:bg-[#202533] border border-[#00f2fe]/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-[#00f2fe]" />
                    <span className="text-xs font-bold text-white group-hover:text-[#00f2fe]">
                      Elena Rostova
                    </span>
                  </div>
                  <span className="text-[10px] text-[#dac2b1]/60 block mt-0.5">
                    Nitro Cold Subscriber
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        <div className="p-3 bg-[#0B0D13] border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-['Space_Grotesk'] text-[#dac2b1]/60 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Nocturnal Privacy & 256-Bit Encrypted Sessions</span>
        </div>
      </div>
    </div>
  );
};
