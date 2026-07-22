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

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
