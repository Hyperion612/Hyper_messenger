import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Fingerprint, AlertTriangle, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const setIsAdminAuthenticated = (v: boolean) => {
    if (v) sessionStorage.setItem('hyper_admin_auth', 'true');
    else sessionStorage.removeItem('hyper_admin_auth');
  };
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (lockTimer > 0) {
      const interval = setInterval(() => setLockTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
      setFailedAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const handleStep1 = () => {
    if (!username || !password) {
      setError('All fields are required');
      return;
    }
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin' && password === 'hyper2026') {
        setStep(2);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setError(`Invalid credentials. Attempt ${newAttempts}/5`);
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(60);
        }
      }
    }, 1500);
  };

  const handleStep2 = () => {
    if (totp.length !== 6) {
      setError('Enter 6-digit code');
      return;
    }
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (totp === '000000' || totp === '123456') {
        setIsAdminAuthenticated(true);
        navigate('/hyper-admin-7x9k');
      } else {
        setError('Invalid TOTP code. Use 000000 or 123456 for demo.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen admin-mesh flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Security Badge */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/20"
          >
            <Shield className="w-8 h-8 text-red-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-1">Super Admin Access</h1>
          <p className="text-sm text-zinc-500">Restricted area • Multi-factor authentication required</p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Access Locked</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Too many failed attempts. Try again in:
                </p>
                <div className="text-3xl font-mono font-bold text-red-400">
                  {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-hyper-500 flex items-center justify-center text-xs font-bold text-white">1</div>
                  <div className="flex-1 h-0.5 bg-white/10 rounded" />
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-500">2</div>
                  <div className="flex-1 h-0.5 bg-white/10 rounded" />
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-500">3</div>
                </div>

                <h2 className="text-lg font-semibold text-white mb-1">Credentials</h2>
                <p className="text-xs text-zinc-500 mb-6">Enter your admin username and password</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors pr-12"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {error}
                    </motion.p>
                  )}

                  <button
                    onClick={handleStep1}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    Continue
                  </button>

                  <p className="text-[10px] text-zinc-600 text-center mt-4">
                    Demo: admin / hyper2026
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">✓</div>
                  <div className="flex-1 h-0.5 bg-green-500/30 rounded" />
                  <div className="w-6 h-6 rounded-full bg-hyper-500 flex items-center justify-center text-xs font-bold text-white">2</div>
                  <div className="flex-1 h-0.5 bg-white/10 rounded" />
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-500">3</div>
                </div>

                <h2 className="text-lg font-semibold text-white mb-1">Two-Factor Authentication</h2>
                <p className="text-xs text-zinc-500 mb-6">Enter your TOTP code from authenticator app</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">6-digit code</label>
                    <input
                      type="text"
                      value={totp}
                      onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white text-center font-mono text-xl tracking-widest placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {error}
                    </motion.p>
                  )}

                  <button
                    onClick={handleStep2}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                    Verify & Enter
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
                    <Lock className="w-3 h-3" />
                    <span>Session protected by mTLS + device fingerprint</span>
                  </div>

                  <p className="text-[10px] text-zinc-600 text-center">
                    Demo: use 000000 or 123456
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> mTLS</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> VPN Required</span>
            <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> Device Bound</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
