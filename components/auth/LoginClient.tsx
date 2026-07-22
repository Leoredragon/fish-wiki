'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(isTr ? 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' : 'Login failed. Please check your credentials.');
      setLoading(false);
      return;
    }

    router.push(`/${locale}/profile`);
    router.refresh(); // Refresh layout to update Header auth state
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#0F172A]">
            {isTr ? 'Hesabınıza Giriş Yapın' : 'Sign In to Your Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-medium">
            {isTr ? 'Av güncenize erişmek için giriş yapın.' : 'Sign in to access your catch log.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-slate-200 rounded-2xl text-slate-700 bg-white hover:bg-slate-50 font-bold transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{isTr ? 'Google ile Devam Et' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">
            {isTr ? 'veya e-posta ile' : 'or with email'}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form className="mt-4 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                placeholder={isTr ? 'Şifre' : 'Password'}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] transition-all disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <LogIn className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </span>
              {loading ? (isTr ? 'Giriş Yapılıyor...' : 'Signing in...') : (isTr ? 'Giriş Yap' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Hesabınız yok mu?' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/register`} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              {isTr ? 'Kayıt Ol' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
