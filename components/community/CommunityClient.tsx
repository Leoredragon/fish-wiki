/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Scale, Ruler, MapPin, Users, Heart } from 'lucide-react';

export default function CommunityClient({ catches }: { catches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-2">
          <Users className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A]">
          {isTr ? 'Oltapp Topluluğu' : 'Oltapp Community'}
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          {isTr 
            ? 'Türkiye’nin dört bir yanından amatör balıkçıların yakaladıkları balıklar ve kullandıkları taktikler.' 
            : 'Catches and tactics from amateur anglers all around the country.'}
        </p>
      </div>

      <div className="space-y-8">
        {catches.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            {isTr ? 'Henüz paylaşım yapılmamış. İlk paylaşan sen ol!' : 'No catches shared yet. Be the first!'}
          </div>
        ) : (
          catches.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm"
            >
              {/* Post Header */}
              <div className="p-4 sm:p-5 flex items-center space-x-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                  {log.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-[#0F172A] text-sm">
                    {log.profiles?.username || 'Gizli Kullanıcı'}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="aspect-[4/5] sm:aspect-video bg-slate-100 w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={log.image_url} alt="Catch" className="w-full h-full object-cover" />
              </div>

              {/* Details & Footer */}
              <div className="p-4 sm:p-5 space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-sm font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{log.location_note || (isTr ? 'Mera belirtilmedi' : 'Location not specified')}</span>
                  </div>
                  
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {log.weight && (
                    <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <Scale className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700">{log.weight} kg</span>
                    </div>
                  )}
                  {log.length && (
                    <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <Ruler className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700">{log.length} cm</span>
                    </div>
                  )}
                </div>

                {log.lure_used && (
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-bold uppercase">{isTr ? 'Takım / Yem: ' : 'Tackle / Bait: '}</span>
                    <span className="text-sm text-slate-800 font-semibold">{log.lure_used}</span>
                  </div>
                )}
                
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
