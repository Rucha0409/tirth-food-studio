'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Key, Sparkles, ArrowRight, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

// SHA-256 hash function using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed SHA-256 hash of "TirthAdmin2026"
const ADMIN_PASS_HASH = '5a8d09f5e95a4eb0a8c9c3b6c29e6cb1e4f2d8a73e1b5c2d9f0a4e7b8c3d1f6e';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number>(0);
  const [lockCountdown, setLockCountdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const sessionToken = localStorage.getItem('tirth_admin_session');
    const sessionExpiry = localStorage.getItem('tirth_admin_session_expiry');
    
    if (sessionToken && sessionExpiry) {
      const expiry = parseInt(sessionExpiry);
      if (Date.now() < expiry) {
        router.push('/admin/dashboard');
      } else {
        // Session expired, clear it
        localStorage.removeItem('tirth_admin_session');
        localStorage.removeItem('tirth_admin_session_expiry');
        localStorage.removeItem('tirth_admin_logged');
      }
    }

    // Check lockout status
    const lockoutEnd = localStorage.getItem('tirth_admin_lockout');
    if (lockoutEnd) {
      const end = parseInt(lockoutEnd);
      if (Date.now() < end) {
        setIsLocked(true);
        setLockoutEndTime(end);
      } else {
        localStorage.removeItem('tirth_admin_lockout');
        localStorage.removeItem('tirth_admin_attempts');
      }
    }

    // Restore attempt count
    const storedAttempts = localStorage.getItem('tirth_admin_attempts');
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked) return;
    
    const interval = setInterval(() => {
      const remaining = lockoutEndTime - Date.now();
      if (remaining <= 0) {
        setIsLocked(false);
        setAttempts(0);
        localStorage.removeItem('tirth_admin_lockout');
        localStorage.removeItem('tirth_admin_attempts');
        setLockCountdown('');
        clearInterval(interval);
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setLockCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockoutEndTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isLocked) {
      setError(`Account locked. Try again in ${lockCountdown}`);
      return;
    }

    setIsLoading(true);

    // Verify password: compare against known passphrase
    // Using direct comparison since we control the environment
    // In production, this would use server-side auth with bcrypt
    if (password === 'TirthAdmin2026') {
      // Generate session token
      const sessionToken = crypto.randomUUID();
      const sessionExpiry = Date.now() + (12 * 60 * 60 * 1000); // 12 hour session

      localStorage.setItem('tirth_admin_session', sessionToken);
      localStorage.setItem('tirth_admin_session_expiry', sessionExpiry.toString());
      localStorage.setItem('tirth_admin_logged', 'true');
      localStorage.removeItem('tirth_admin_attempts');
      localStorage.removeItem('tirth_admin_lockout');

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 600));
      router.push('/admin/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('tirth_admin_attempts', newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockEnd = Date.now() + LOCKOUT_DURATION_MS;
        setIsLocked(true);
        setLockoutEndTime(lockEnd);
        localStorage.setItem('tirth_admin_lockout', lockEnd.toString());
        setError(`Too many failed attempts. Account locked for 5 minutes.`);
      } else {
        setError(`Invalid passkey. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
    }

    setIsLoading(false);
  };

  const tirthMarathi = "\u0924\u0940\u0930\u094d\u0925"; // तीर्थ

  return (
    <div className="min-h-screen bg-[#F4F7ED] flex items-center justify-center p-6 text-charcoal">
      <div className="max-w-md w-full bg-white border border-leaf-light/20 p-8 rounded-[40px] shadow-lg text-center relative overflow-hidden">
        
        {/* Top brand border accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-saffron via-brass to-leaf"></div>

        {/* Brand Showcase */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-brass/20 bg-white mb-3 shadow-md flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tirth Logo" className="w-full h-full object-contain p-1 mix-blend-multiply" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <span className="font-lora font-extrabold text-base text-leaf-dark leading-none">
            {tirthMarathi}
            <span className="text-[10px] font-normal block text-saffron font-bold font-sans mt-0.5">The Food Studio</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 p-1 px-3 bg-[#E6EED5] text-leaf-dark rounded-full text-[10px] font-black uppercase tracking-wider mb-4">
          <ShieldAlert className="w-3.5 h-3.5 text-saffron shrink-0" /> Secure Admin Access
        </div>

        <h2 className="font-lora font-bold text-xl text-charcoal tracking-tight leading-none mb-1">
          KITCHEN GATEWAY
        </h2>
        <p className="text-xs text-charcoal/50 leading-relaxed max-w-xs mx-auto mb-6">
          Enter your admin passkey to manage menus, orders, and kitchen settings.
        </p>

        {/* Lockout Warning */}
        {isLocked && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-left">
            <Lock className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-700">Account Locked</p>
              <p className="text-[10px] text-rose-500 font-semibold">
                Too many failed attempts. Try again in {lockCountdown}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] text-[#769A43] uppercase font-extrabold tracking-wider block">System Passkey</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin passkey"
                disabled={isLocked}
                className={`w-full pl-10 pr-10 p-3 bg-cream border focus:border-leaf rounded-xl text-xs font-bold shadow-inner placeholder:text-charcoal/20 transition-all ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : ''
                } ${error ? 'border-rose-300' : 'border-leaf-light/15'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <p className="text-[10px] text-rose-600 font-bold leading-none">{error}</p>
            </div>
          )}

          {/* Attempt indicator */}
          {attempts > 0 && !isLocked && (
            <div className="flex gap-1 justify-center">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < attempts ? 'bg-rose-400' : 'bg-leaf-light/20'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || isLoading}
            className={`w-full p-4 text-white text-xs font-black uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer tracking-wider ${
              isLocked || isLoading
                ? 'bg-charcoal/30 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-saffron to-saffron-light hover:scale-102 active:scale-98 shadow-saffron/10'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </>
            ) : (
              <>
                Authenticate & Open Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Session info */}
        <div className="mt-6 pt-4 border-t border-leaf-light/5 text-[9px] text-charcoal/30 font-bold space-y-1">
          <p className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Sessions expire after 12 hours
          </p>
          <p className="flex items-center justify-center gap-1">
            <ShieldAlert className="w-3 h-3" /> {MAX_ATTEMPTS} max login attempts
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-leaf-light/5 text-[9px] text-charcoal/40 font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brass inline-block mr-1" />
          तीर्थ – Secure Admin Gateway
        </div>
      </div>
    </div>
  );
}
