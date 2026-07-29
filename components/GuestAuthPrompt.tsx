'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Fish } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export type GuestAuthAction =
  | 'favorite'
  | 'add_spot'
  | 'share_catch'
  | 'story'
  | 'like'
  | 'comment'
  | 'forum'
  | 'market'
  | 'tip'
  | 'follow'
  | 'generic';

const COPY: Record<
  GuestAuthAction,
  { titleTr: string; titleEn: string; bodyTr: string; bodyEn: string; ctaTr: string; ctaEn: string }
> = {
  favorite: {
    titleTr: 'Meranı favorilere kaydet',
    titleEn: 'Save this spot',
    bodyTr: 'Favori meralarını kaydetmek için ücretsiz giriş yeterli. Gezmeye devam da edebilirsin.',
    bodyEn: 'Sign in free to save favorite spots. You can keep browsing as a guest.',
    ctaTr: 'Giriş yap, kaydet',
    ctaEn: 'Sign in to save'
  },
  add_spot: {
    titleTr: 'Kendi meranı ekle',
    titleEn: 'Add your fishing spot',
    bodyTr: 'Haritaya mera eklemek için ücretsiz hesap gerekir. İncelemeye devam etmek için kapatabilirsin.',
    bodyEn: 'A free account is needed to add spots. Close to keep exploring the map.',
    ctaTr: 'Giriş yap, mera ekle',
    ctaEn: 'Sign in to add spot'
  },
  share_catch: {
    titleTr: 'Avını toplulukla paylaş',
    titleEn: 'Share your catch',
    bodyTr: 'Fotoğraf ve av notunu paylaşmak için giriş yap. Akışı misafir olarak da izleyebilirsin.',
    bodyEn: 'Sign in to share photos and catch notes. You can still browse the feed as a guest.',
    ctaTr: 'Giriş yap, paylaş',
    ctaEn: 'Sign in to share'
  },
  story: {
    titleTr: 'Hikaye ekle',
    titleEn: 'Add a story',
    bodyTr: '24 saatlik hikaye paylaşmak için ücretsiz giriş gerekir.',
    bodyEn: 'Sign in free to post a 24-hour story.',
    ctaTr: 'Giriş yap, hikaye ekle',
    ctaEn: 'Sign in to post'
  },
  like: {
    titleTr: 'Beğenmek için giriş',
    titleEn: 'Sign in to like',
    bodyTr: 'Beğeniler hesabına bağlanır. Giriş yapmadan akışı gezebilirsin.',
    bodyEn: 'Likes are tied to your account. You can keep browsing without signing in.',
    ctaTr: 'Giriş yap, beğen',
    ctaEn: 'Sign in to like'
  },
  comment: {
    titleTr: 'Yorum yaz',
    titleEn: 'Leave a comment',
    bodyTr: 'Yorum yapmak için ücretsiz giriş yeterli.',
    bodyEn: 'A free account is enough to comment.',
    ctaTr: 'Giriş yap, yorum yaz',
    ctaEn: 'Sign in to comment'
  },
  forum: {
    titleTr: 'Foruma katıl',
    titleEn: 'Join the forum',
    bodyTr: 'Konu açmak veya yanıtlamak için giriş yap. Konuları okumaya devam edebilirsin.',
    bodyEn: 'Sign in to start or reply to topics. You can keep reading as a guest.',
    ctaTr: 'Giriş yap, foruma katıl',
    ctaEn: 'Sign in to join'
  },
  market: {
    titleTr: 'Pazarlık / ilan',
    titleEn: 'Marketplace listing',
    bodyTr: 'İlan vermek veya iletişime geçmek için ücretsiz hesap gerekir.',
    bodyEn: 'A free account is needed to list or contact sellers.',
    ctaTr: 'Giriş yap, devam et',
    ctaEn: 'Sign in to continue'
  },
  tip: {
    titleTr: 'İpucu paylaş',
    titleEn: 'Share a tip',
    bodyTr: 'Topluluk ipucu eklemek için giriş yap.',
    bodyEn: 'Sign in to share a community tip.',
    ctaTr: 'Giriş yap, ipucu ekle',
    ctaEn: 'Sign in to add tip'
  },
  follow: {
    titleTr: 'Takip et',
    titleEn: 'Follow angler',
    bodyTr: 'Balıkçıları takip etmek için ücretsiz giriş yeterli.',
    bodyEn: 'Sign in free to follow anglers.',
    ctaTr: 'Giriş yap, takip et',
    ctaEn: 'Sign in to follow'
  },
  generic: {
    titleTr: 'Ücretsiz girişle devam et',
    titleEn: 'Continue with free sign-in',
    bodyTr: 'Bu işlem için ücretsiz hesap gerekir. Misafir olarak gezinmeye devam edebilirsin.',
    bodyEn: 'This action needs a free account. You can keep browsing as a guest.',
    ctaTr: 'Giriş Yap / Kayıt Ol',
    ctaEn: 'Sign In / Register'
  }
};

interface GuestAuthPromptProps {
  open: boolean;
  action?: GuestAuthAction;
  onClose: () => void;
}

export default function GuestAuthPrompt({ open, action = 'generic', onClose }: GuestAuthPromptProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const copy = COPY[action] || COPY.generic;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <Fish className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">
                {isTr ? copy.titleTr : copy.titleEn}
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                {isTr ? copy.bodyTr : copy.bodyEn}
              </p>
            </div>

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/${locale}/login`);
                }}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
              >
                <span>{isTr ? copy.ctaTr : copy.ctaEn}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-2xl transition-all text-xs"
              >
                {isTr ? 'Misafir olarak devam et' : 'Continue as guest'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
