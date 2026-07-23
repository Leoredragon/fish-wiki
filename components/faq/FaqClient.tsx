'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  id: string;
  questionTr: string;
  questionEn: string;
  answerTr: string;
  answerEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'free',
    questionTr: 'Oltapp tamamen ücretsiz mi?',
    questionEn: 'Is Oltapp completely free to use?',
    answerTr: 'Evet, Oltapp amatör balıkçılığı desteklemek amacıyla tasarlanmıştır ve tüm temel özellikleri (Balık Rehberi, İnteraktif Av Meraları Haritası, Av Günlüğü, Solunar Takvim ve Malzeme Çantası) tamamen ücretsizdir.',
    answerEn: 'Yes, Oltapp is designed to support amateur angling, and all core features (Fish Wiki, Interactive Spot Map, Catch Log, Solunar Calendar, and Tackle Box) are 100% free.'
  },
  {
    id: 'map_access',
    questionTr: 'Av meraları haritasını kimler görebilir?',
    questionEn: 'Who can access the fishing spots map?',
    answerTr: 'Av meraları haritasını giriş yapmış veya yapmamış herkes ücretsiz olarak inceleyebilir. Ancak harita üzerinde yeni bir mera konumu işaretlemek ve detay eklemek için ücretsiz üyelik girişi yapmanız gerekmektedir.',
    answerEn: 'Anyone can view and explore the fishing spots map for free. However, to pick a location on the map and contribute a new fishing spot, you must log in with a free account.'
  },
  {
    id: 'size_limits',
    questionTr: 'Limit boy ve yasak zamanları neye göre belirleniyor?',
    questionEn: 'How are minimum legal size limits and closed seasons determined?',
    answerTr: 'Platformumuzdaki tüm yasal boy sınırları ve avlanma zamanı yasakları, T.C. Tarım ve Orman Bakanlığı tarafından yayımlanan Resmi 5/2 Numaralı Amatör Amaçlı Su Ürünleri Avcılığını Düzenleyen Sirküler esas alınarak ve bilimsel sürdürülebilirlik ilkelerine uygun şekilde güncel tutulmaktadır.',
    answerEn: 'All legal minimum fish sizes and seasonal closed periods are based on the official amateur fishing circulars (Circular No. 5/2) published by the Ministry of Agriculture and Forestry, keeping sustainability principles at the core.'
  }
];

export default function FaqClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [openId, setOpenId] = useState<string | null>('free');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 pt-6">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-200 rounded-full mb-1">
          <HelpCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A]">
          {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">
          {isTr 
            ? 'Oltapp kullanımı, av meraları haritası ve sürdürülebilirlik kuralları hakkında aklınıza takılan tüm sorular.' 
            : 'Find answers to common questions about Oltapp features, maps, and regulations.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          const question = isTr ? item.questionTr : item.questionEn;
          const answer = isTr ? item.answerTr : item.answerEn;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-extrabold text-[#0F172A] text-sm sm:text-base">{question}</span>
                </div>
                <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-emerald-100 text-emerald-600' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
