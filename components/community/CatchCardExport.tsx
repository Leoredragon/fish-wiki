'use client';

import { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Share2, Scale, Ruler, MapPin, Package, X, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHapticLight, triggerHapticMedium, shareImageNative } from '@/lib/capacitorUtils';
import { Share } from '@capacitor/share';
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

  const handleShareToSocial = async () => {
    triggerHapticMedium();
    setSharing(true);
    console.log('[CatchCardExport] handleShareToSocial triggered');
    try {
      const dataUrl = await generateCardImage();
      console.log('[CatchCardExport] PNG dataUrl length:', dataUrl ? dataUrl.length : 0);

      if (!dataUrl) {
        console.error('[CatchCardExport ERROR] PNG dataUrl is null/empty');
        alert(isTr ? 'Görsel üretilemedi.' : 'Image generation failed.');
        return;
      }

      if (Capacitor.isNativePlatform()) {
        console.log('[CatchCardExport] Calling shareImageNative for Capacitor...');
        const ok = await shareImageNative(dataUrl, `${log.location_note || 'Balık Avı'} - oltaApp`);
        console.log('[CatchCardExport] shareImageNative returned:', ok);
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
      console.error('[CatchCardExport ERROR] handleShareToSocial exception:', err);
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

      {/* SINGLE CLEAN PAYLAŞ BUTTON (Does not shrink even with long usernames) */}
      <button
        onClick={handleOpenModal}
        className="shrink-0 flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors active:scale-95 bg-slate-100 hover:bg-slate-200/80 px-3 py-1 rounded-xl border border-slate-200"
        title={isTr ? 'Paylaş' : 'Share'}
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span className="shrink-0">{isTr ? 'Paylaş' : 'Share'}</span>
      </button>

      {/* MODAL FOR PREVIEW & NATIVE SOCIAL MEDIA SHARE */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-[#0F172A]">{isTr ? 'Av Kartını Paylaş' : 'Share Catch Card'}</h3>
                  <p className="text-xs text-slate-500 font-medium">{isTr ? 'WhatsApp, Instagram, Facebook vb. için dikey format' : 'Vertical format for WhatsApp, Instagram, Facebook'}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center bg-slate-100 rounded-2xl p-4 sm:p-8 border border-slate-200">
                <div className="w-[300px] h-[533px] bg-[#0F172A] rounded-[1.5rem] overflow-hidden relative shadow-2xl flex flex-col shrink-0">
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

                  <div className="relative z-10 flex justify-between items-center p-4 w-full">
                    <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center space-x-1.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[9px]">
                        {profileName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-[11px] font-bold tracking-wide truncate max-w-[120px]">{profileName}</span>
                    </div>
                    <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-full font-black text-[10px] tracking-widest uppercase shadow-lg">
                      OLTAPP
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  <div className="relative z-10 p-4 space-y-2.5 w-full">
                    <div className="inline-flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="text-white text-[11px] font-bold truncate max-w-[180px]">{log.location_note || 'Bilinmeyen Mera'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl flex flex-col items-center justify-center">
                        <Scale className="w-4 h-4 text-emerald-400 mb-0.5" />
                        <span className="text-white font-black text-base leading-none">{log.weight ? `${log.weight}kg` : '-'}</span>
                        <span className="text-white/60 text-[9px] uppercase font-bold mt-0.5 tracking-widest">{isTr ? 'Ağırlık' : 'Weight'}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl flex flex-col items-center justify-center">
                        <Ruler className="w-4 h-4 text-emerald-400 mb-0.5" />
                        <span className="text-white font-black text-base leading-none">{log.length ? `${log.length}cm` : '-'}</span>
                        <span className="text-white/60 text-[9px] uppercase font-bold mt-0.5 tracking-widest">{isTr ? 'Uzunluk' : 'Length'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex space-x-3">
                <button
                  onClick={handleShareToSocial}
                  disabled={sharing}
                  className="w-full flex justify-center items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-70"
                >
                  {sharing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                  <span>
                    {sharing 
                      ? (isTr ? 'Görsel Hazırlanıyor...' : 'Preparing Image...') 
                      : (isTr ? 'Sosyal Medyada Paylaş (WhatsApp, Instagram...)' : 'Share via WhatsApp / Instagram')}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
