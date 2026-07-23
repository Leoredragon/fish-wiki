'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';

export default function TermsClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 pt-6">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-3"
      >
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold">
          <Scale className="w-4 h-4" />
          <span>{isTr ? 'Kullanım Koşulları ve Sözleşme' : 'Terms & Conditions Agreement'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {isTr ? 'Platform Kullanım Şartları' : 'Terms of Service'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          {isTr 
            ? 'Oltapp platformunu kullanırken dikkat edilmesi gereken yasal yükümlülükler ve topluluk kuralları.' 
            : 'Legal obligations and community guidelines while using the Oltapp platform.'}
        </p>
      </motion.div>

      {/* Terms Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed"
      >
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>1. Genel Kullanım Esasları</span>
          </h2>
          <p>
            Oltapp (Livar) amatör balıkçılığı desteklemek, bilgi paylaşımını artırmak ve mera rehberliği sunmak amacıyla kurulmuş dijital bir platformdur. Platforma üye olan veya ziyaret eden tüm kullanıcılar işbu şartları kabul etmiş sayılır.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <span>2. Av Meraları (Fishing Spots) Sorumluluğu</span>
          </h2>
          <p>
            Harita üzerine eklenen tüm mera bilgileri, açıklamalar ve görsellerin yasal sorumluluğu **içeriği ekleyen kullanıcıya aittir**.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-600">
            <li>**Özel Mülk İhlali:** Özel mülkiyete tabi araziler, askeri yasak bölgeler veya girmesi izne bağlı liman/barınak alanları mera olarak işaretlenemez.</li>
            <li>**Yasadışı Avcılık:** Ağ çekme, tırıvırı, dinamit, elektroyoklama gibi yasadışı veya bohçacı avcılık yöntemlerini teşvik eden mera ve açıklamalar kesinlikle yasaktır.</li>
            <li>**Moderatör Yetkisi:** Yukarıdaki kurallara aykırı olan veya yasal ihlal barındıran içerikler moderatörler tarafından haber verilmeksizin derhal platformdan silinir.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>3. Sürdürülebilirlik ve Sirküler Uyum Zorunluluğu</span>
          </h2>
          <p>
            Platformumuzda yasal alt boy sınırlarının altındaki balıkların trofe olarak sergilenmesi engellenmektedir. Tüm kullanıcılarımızın T.C. Tarım ve Orman Bakanlığı amatör balıkçılık sirkülerine uyması beklenmektedir.
          </p>
        </div>

        {/* Informational Acceptance Badge */}
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0F172A]">Kullanım Şartları Anlaşıldı ve Kabul Edildi</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Oltapp platformunu kullanarak doğaya ve yasal sirkülere saygılı bir balıkçılık kültürünü kabul etmiş olursunuz.</p>
            </div>
          </div>

          <span className="px-4 py-2 bg-[#0F172A] text-emerald-400 font-bold text-xs rounded-xl shrink-0 shadow-sm">
            Kabul Edildi ✓
          </span>
        </div>

      </motion.div>

    </div>
  );
}
