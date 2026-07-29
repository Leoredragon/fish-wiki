'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, CloudSun, MapPin, Compass, Users, LogIn, User, LogOut, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import OltaAppLogo from './OltaAppLogo';

import { User as SupabaseUser } from '@supabase/supabase-js';

import NotificationCenter from './NotificationCenter';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const isTr = locale === 'tr';
  const pathname = usePathname();
  const router = useRouter();
  
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSessionUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { href: '/', label: t('navHome'), icon: Compass },
    { href: '/wiki', label: isTr ? 'Wiki Rehber' : 'Wiki Guide', icon: BookOpen },
    { href: '/community', label: isTr ? 'Topluluk' : 'Community', icon: Users },
    { href: '/calendar', label: t('navCalendar'), icon: Calendar },
    { href: '/weather', label: t('navWeather'), icon: CloudSun },
    { href: '/map', label: t('navMap'), icon: MapPin }
  ];

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800/80 sticky top-0 z-50 shadow-md pt-safe transition-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-h-[4rem] shrink-0">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <OltaAppLogo className="w-10 h-10 rounded-xl shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform" />
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {t('title')}
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-medium text-slate-400 border-l border-slate-700 pl-2">
                {t('subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 border-l border-r border-slate-800/80 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {sessionUser && <NotificationCenter userId={sessionUser.id} />}

            {sessionUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{sessionUser.user_metadata?.username || (isTr ? 'Profilim' : 'My Profile')}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title={isTr ? 'Çıkış Yap' : 'Sign Out'}
                  className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isTr ? 'Giriş Yap' : 'Sign In'}</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
