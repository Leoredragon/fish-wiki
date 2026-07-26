'use client';

import { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Share2, Scale, Ruler, MapPin, Package, X, Loader2, MessageCircle } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHapticLight, triggerHapticMedium, shareImageNative } from '@/lib/capacitorUtils';
import { Capacitor } from '@capacitor/core';

export default function CatchCardExport({ log, profileName }: { log: any; profileName: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [isOpen, setIsOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateCardImage = async () => {
    if (!cardRef.current) return null;
    try {
      console.log('[CatchCardExport] Starting htmlToImage.toPng...');
      return await htmlToImage.toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });
    } catch (err) {
      console.error('[CatchCardExport ERROR] htmlToImage failed:', err);
      return null;
    }
  };

  const handleOpenModal = () => {
    triggerHapticLight();
    setIsOpen(true);
  };

  const handleShareWhatsApp = async () => {
    triggerHapticMedium();
    const shareText = `🎣 ${profileName} oltaApp'te harika bir av paylaştı!\n${log.location_note || 'Mera'}: ${log.weight ? log.weight + 'kg' : ''} ${log.length ? log.length + 'cm' : ''}\nDetaylar: https://oltaapp.com`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_system');
  };

  const handleShareNative = async () => {
    triggerHapticMedium();
    setSharing(true);
    try {
      const dataUrl = await generateCardImage();
      if (!dataUrl) {
        alert(isTr ? 'Görsel hazırlanamadı.' : 'Image failed');
        return;
      }

      if (Capacitor.isNativePlatform()) {
        await shareImageNative(dataUrl, `${log.location_note || 'Balık Avı'} - oltaApp`);
      } else if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'oltaApp Av Kartı',
          text: `${profileName} oltaApp'te av kaydı paylaştı!`,
          url: typeof window !== 'undefined' ? window.location.href : 'https://oltaapp.com'
        });
      } else {
        const link = document.createElement('a');
        link.download = `oltapp_catch_${log.id || Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error('[CatchCardExport ERROR] handleShareNative exception:', err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* Hidden Card Element used for high-res PNG rendering in background */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0">
        <div 
          ref={cardRef}
          className="w-[360px] h-[640px] bg-[#0F172A] rounded-[2rem] overflow-hidden relative flex flex-col shrink-0"
          style={{ width: '360px', height: '640px' }}
        >
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={log.image_url} 
              crossOrigin="anonymous" 
              alt="Catch" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
          </div>

          <div className="relative z-10 flex justify-between items-center p-6 w-full">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-2 max-w-[200px]">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                {profileName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-xs font-bold tracking-wide truncate">{profileName}</span>
            </div>
            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full font-black text-xs tracking-widest uppercase shadow-lg shrink-0">
              OLTAPP
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="relative z-10 p-6 space-y-4 w-full">
            <div className="inline-flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white text-xs font-bold">{log.location_note || 'Bilinmeyen Mera'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center">
                <Scale className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-white font-black text-xl leading-none">{log.weight ? `${log.weight}kg` : '-'}</span>
                <span className="text-white/60 text-[10px] uppercase font-bold mt-1 tracking-widest">{isTr ? 'Ağırlık' : 'Weight'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center">
                <Ruler className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-white font-black text-xl leading-none">{log.length ? `${log.length}cm` : '-'}</span>
                <span className="text-white/60 text-[10px] uppercase font-bold mt-1 tracking-widest">{isTr ? 'Uzunluk' : 'Length'}</span>
              </div>
            </div>

            {(log.lure_used || log.tackle_box_id) && (
              <div className="bg-white/10 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl w-full">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">{isTr ? 'Kullanılan Takım' : 'Gear Used'}</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {log.lure_used || (isTr ? 'Kayıtlı Ekipman' : 'Saved Gear')}
                </div>
              </div>
            )}
            
            <div className="text-center w-full pt-2">
              <p className="text-white/40 text-[10px] font-medium tracking-wide">
                {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')} • {isTr ? 'Oltapp ile kaydedildi' : 'Logged with Oltapp'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SHORT CLEAN "Paylaş" BUTTON */}
      <button
        onClick={handleOpenModal}
        className="shrink-0 flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors active:scale-95 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200"
        title={isTr ? 'Paylaş' : 'Share'}
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span className="shrink-0 font-extrabold">{isTr ? 'Paylaş' : 'Share'}</span>
      </button>

      {/* POPUP MODAL FOR WHATSAPP / SYSTEM SHARE */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{isTr ? 'Av Kartını Paylaş' : 'Share Catch Card'}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{isTr ? 'Nasıl paylaşmak istersin?' : 'Choose sharing method'}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CARD PREVIEW THUMBNAIL */}
              <div className="flex justify-center bg-slate-900 rounded-2xl p-3 mb-4">
                <div className="w-[200px] h-[355px] bg-[#0F172A] rounded-xl overflow-hidden relative shadow-lg flex flex-col shrink-0">
                  <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={log.image_url} 
                      crossOrigin="anonymous" 
                      alt="Catch" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                  </div>
                  <div className="relative z-10 flex justify-between items-center p-2.5 w-full">
                    <span className="text-white text-[10px] font-bold tracking-wide truncate">{profileName}</span>
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black text-[8px] tracking-widest uppercase">OLTAPP</span>
                  </div>
                  <div className="flex-1"></div>
                  <div className="relative z-10 p-2.5 space-y-1 w-full text-white text-[10px] font-bold">
                    <p className="truncate">{log.location_note || 'Mera'}</p>
                    <p className="text-emerald-400">{log.weight ? `${log.weight}kg ` : ''}{log.length ? `${log.length}cm` : ''}</p>
                  </div>
                </div>
              </div>

              {/* POPUP ACTION BUTTONS */}
              <div className="space-y-2.5">
                {/* WHATSAPP DIRECT SHARE BUTTON */}
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>WhatsApp ile Paylaş</span>
                </button>

                {/* NATIVE SYSTEM SHARE BUTTON */}
                <button
                  onClick={handleShareNative}
                  disabled={sharing}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-70"
                >
                  {sharing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  ) : (
                    <Share2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <span>{sharing ? (isTr ? 'Görsel Hazırlanıyor...' : 'Preparing...') : (isTr ? 'Paylaş' : 'Share')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
