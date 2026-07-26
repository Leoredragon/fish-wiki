'use client';

import { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Download, Share2, Scale, Ruler, MapPin, Package, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { nativeShare, triggerHapticLight, triggerHapticMedium } from '@/lib/capacitorUtils';

export default function CatchCardExport({ log, profileName }: { log: any; profileName: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShareButtonClick = async () => {
    triggerHapticLight();
    const shared = await nativeShare({
      title: `${log.location_note || 'Balık Avı'} - oltaApp`,
      text: `${profileName} oltaApp'te yeni bir av kaydı paylaştı!`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://oltaapp.com'
    });

    if (!shared) {
      setIsOpen(true);
    }
  };

  const handleDownload = async () => {
    triggerHapticMedium();
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `oltapp_catch_${log.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShareButtonClick}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors active:scale-95"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{isTr ? 'Paylaş' : 'Share'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-[#0F172A]">{isTr ? 'Sosyal Medya Av Kartı' : 'Social Catch Card'}</h3>
                  <p className="text-xs text-slate-500 font-medium">{isTr ? 'Instagram veya Shorts için dikey format' : 'Vertical format for Instagram/Shorts'}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Area for the Card preview */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center bg-slate-100 rounded-2xl p-4 sm:p-8 border border-slate-200">
                
                {/* THE CARD TO EXPORT (9:16 Aspect Ratio approximation ~ 360x640) */}
                <div 
                  ref={cardRef}
                  className="w-[360px] min-h-[640px] bg-[#0F172A] rounded-[2rem] overflow-hidden relative shadow-2xl flex flex-col shrink-0"
                  style={{
                    // Enforce strict dimensions for the export
                    width: '360px',
                    height: '640px'
                  }}
                >
                  {/* Background Image (The Catch) */}
                  <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={log.image_url} 
                      crossOrigin="anonymous" 
                      alt="Catch" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                  </div>

                  {/* Top Bar: Brand & User */}
                  <div className="relative z-10 flex justify-between items-center p-6 w-full">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[10px]">
                        {profileName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-xs font-bold tracking-wide">{profileName}</span>
                    </div>
                    <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full font-black text-xs tracking-widest uppercase shadow-lg">
                      OLTAPP
                    </div>
                  </div>

                  {/* Spacer to push content to bottom */}
                  <div className="flex-1"></div>

                  {/* Bottom Content: Stats & Info */}
                  <div className="relative z-10 p-6 space-y-4 w-full">
                    {/* Location Badge */}
                    <div className="inline-flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-white text-xs font-bold">{log.location_note || 'Bilinmeyen Mera'}</span>
                    </div>

                    {/* Stats Grid */}
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

                    {/* Gear / Lure */}
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

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex justify-center items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-70"
                >
                  <Download className="w-5 h-5" />
                  <span>{downloading ? (isTr ? 'Kart Oluşturuluyor...' : 'Generating Card...') : (isTr ? 'Görüntüyü İndir (PNG)' : 'Download Image (PNG)')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
