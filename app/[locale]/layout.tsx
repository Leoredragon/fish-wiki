import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import MobileBottomNavGate from '@/components/MobileBottomNavGate';
import AppSplashScreen from '@/components/AppSplashScreen';
import CapacitorInit from '@/components/CapacitorInit';
import NativeChrome from '@/components/NativeChrome';
import RateAppPrompt from '@/components/RateAppPrompt';
import { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Oltapp - Dijital Balıkçılık & Livar',
  description: 'Türkiye Amatör Balıkçılık Topluluğu, Meralar, Hava Durumu ve Dijital Livar.',
  manifest: '/manifest.json',
  icons: {
    icon: '/olta-app-icon.png',
    apple: '/olta-app-icon.png'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Oltapp'
  }
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col bg-[#F8FAFC] text-[#1E293B] antialiased">
        <NextIntlClientProvider messages={messages}>
          <NativeChrome />
          <CapacitorInit />
          <AppSplashScreen />
          <Header />
          <PWAInstallBanner />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8 bg-[#F8FAFC]">
            {children}
          </main>
          <MobileBottomNavGate />
          <RateAppPrompt />
          <div className="native-hide">
            <Footer />
          </div>
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
