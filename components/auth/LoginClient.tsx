'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, LogIn, AlertCircle, Fish } from 'lucide-react';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';
import { triggerHapticLight, triggerHapticMedium, triggerHapticSuccess } from '@/lib/capacitorUtils';

function readRememberedEmail() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('oltapp_remembered_email') || '';
  } catch {
    return '';
  }
}

export default function LoginClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const isNative = Capacitor.isNativePlatform();
  const remembered = useMemo(() => readRememberedEmail(), []);

  const [email, setEmail] = useState(remembered);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(remembered));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.replace(`/${locale}/community`);
      } else {
        setCheckingSession(false);
      }
    });
  }, [locale, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticMedium();
    setLoading(true);
    setError(null);

    if (rememberMe) {
      localStorage.setItem('oltapp_remembered_email', email);
    } else {
      localStorage.removeItem('oltapp_remembered_email');
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      triggerHapticLight();
      setError(isTr ? 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' : 'Login failed. Please check your credentials.');
      setLoading(false);
      return;
    }

    await triggerHapticSuccess();
    router.push(`/${locale}/community`);
    router.refresh();
  };

  if (checkingSession) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          {isTr ? 'Oturum Kontrol Ediliyor...' : 'Checking Session...'}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center px-1 sm:px-6 ${isNative ? 'min-h-[78vh] py-4' : 'min-h-[80vh] py-12'}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md space-y-6 bg-white border border-slate-200/90 shadow-xl ${
          isNative ? 'p-6 rounded-[1.75rem]' : 'p-8 rounded-3xl'
        }`}
      >
        <div className="text-center space-y-3">
          {isNative && (
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Fish className="w-7 h-7 text-[#0F172A]" />
            </div>
          )}
          <h2 className={`font-extrabold text-[#0F172A] ${isNative ? 'text-2xl' : 'text-3xl'}`}>
            {isTr ? "oltaApp'e Giriş" : 'Sign in to oltaApp'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isTr
              ? 'Topluluk, livar ve meralara erişmek için giriş yapın.'
              : 'Sign in to access community, catch log and spots.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-3.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-base"
                placeholder={isTr ? 'E-posta Adresi' : 'Email Address'}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-base"
                placeholder={isTr ? 'Şifre' : 'Password'}
              />
            </div>

            <label className="flex items-center space-x-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-600">
                {isTr ? 'Beni Hatırla' : 'Remember Me'}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] transition-all disabled:opacity-70"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-4">
              <LogIn className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </span>
            {loading ? (isTr ? 'Giriş Yapılıyor...' : 'Signing in...') : isTr ? 'Giriş Yap' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Hesabınız yok mu?' : "Don't have an account?"}{' '}
            <Link
              href={`/${locale}/register`}
              onClick={() => triggerHapticLight()}
              className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              {isTr ? 'Kayıt Ol' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
