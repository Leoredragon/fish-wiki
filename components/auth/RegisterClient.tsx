'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, UserPlus, AlertCircle, User, Fish } from 'lucide-react';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';
import { triggerHapticLight, triggerHapticMedium, triggerHapticSuccess } from '@/lib/capacitorUtils';

export default function RegisterClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const isNative = Capacitor.isNativePlatform();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticMedium();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (username.length < 3) {
      triggerHapticLight();
      setError(isTr ? 'Kullanıcı adı en az 3 karakter olmalıdır.' : 'Username must be at least 3 characters.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (signUpError) {
      triggerHapticLight();
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    await triggerHapticSuccess();
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push(`/${locale}/login`);
    }, 1600);
  };

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
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Fish className="w-7 h-7 text-[#0F172A]" />
          </div>
          <h2 className={`font-extrabold text-[#0F172A] ${isNative ? 'text-2xl' : 'text-3xl'}`}>
            {isTr ? "oltaApp'e Katıl" : 'Join oltaApp'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isTr
              ? 'Av güncenizi oluşturun ve toplulukla taktik paylaşın.'
              : 'Create your catch log and share tactics with the community.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold">
            {isTr ? 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...' : 'Registration successful! Redirecting to login...'}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-3.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-base"
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
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl block w-full pl-11 px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-base"
                placeholder={isTr ? 'Şifre (En az 6 karakter)' : 'Password (Min 6 chars)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] transition-all disabled:opacity-70"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-4">
              <UserPlus className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </span>
            {loading ? (isTr ? 'Hesap Oluşturuluyor...' : 'Creating Account...') : isTr ? 'Kayıt Ol' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Zaten hesabınız var mı?' : 'Already have an account?'}{' '}
            <Link
              href={`/${locale}/login`}
              onClick={() => triggerHapticLight()}
              className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              {isTr ? 'Giriş Yap' : 'Sign In'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
