'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, UserPlus, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    
    // Check if username is valid
    if (username.length < 3) {
      setError(isTr ? 'Kullanıcı adı en az 3 karakter olmalıdır.' : 'Username must be at least 3 characters.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    
    // Auto redirect after 2 seconds
    setTimeout(() => {
      router.push(`/${locale}/login`);
    }, 2000);
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
            {isTr ? 'Aramıza Katılın' : 'Join the Community'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-medium">
            {isTr ? 'Kendi av güncenizi oluşturun ve diğer balıkçılarla taktikleri paylaşın.' : 'Create your catch log and share tactics with other anglers.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{isTr ? 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' : 'Registration successful! Redirecting to login...'}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                placeholder={isTr ? 'Kullanıcı Adı' : 'Username'}
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                placeholder={isTr ? 'Şifre (En az 6 karakter)' : 'Password (Min 6 chars)'}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] transition-all disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <UserPlus className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </span>
              {loading ? (isTr ? 'Hesap Oluşturuluyor...' : 'Creating Account...') : (isTr ? 'Kayıt Ol' : 'Sign Up')}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Zaten hesabınız var mı?' : "Already have an account?"}{' '}
            <Link href={`/${locale}/login`} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              {isTr ? 'Giriş Yap' : 'Sign In'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
