'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, Server, Check } from 'lucide-react';

export default function PrivacyClient() {
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
          <ShieldCheck className="w-4 h-4" />
          <span>{isTr ? 'KVKK & GDPR Uyum Bildirimi' : 'KVKK & GDPR Compliance Statement'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {isTr ? 'Gizlilik Politikası ve Veri Güvenliği' : 'Privacy Policy & Data Security'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          {isTr 
            ? 'Oltapp (Livar) olarak kişisel verilerinizin gizliliğine ve av meralarınızın mahremiyetine en yüksek derecede önem veriyoruz.' 
            : 'At Oltapp (Livar), we prioritize your personal data privacy and fishing spot confidentiality.'}
        </p>
      </motion.div>

      {/* Policy Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed"
      >
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>1. Kullanıcı Kimlik ve Hesap Güvenliği (Supabase Auth)</span>
          </h2>
          <p>
            Oltapp platformunda üyelik ve oturum açma işlemleri dünya standartlarında altyapıya sahip **Supabase Auth** mimarisi üzerinden yürütülmektedir.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-600">
            <li>E-posta adresiniz ve parola bilgileriniz uçtan uca yüksek güvenlikli kriptografik algoritmalarla (BCrypt/SHA) şrifrelenerek saklanır.</li>
            <li>Hesap şifreleriniz sistem yöneticileri dahil hiç kimsede düz metin (plaintext) olarak görüntülenemez.</li>
            <li>İstediğiniz zaman profilinizi ve hesabınıza bağlı tüm verileri silme hakkına sahipsiniz.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <EyeOff className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>2. Av Meraları ve Konum Verilerinin İşlenmesi</span>
          </h2>
          <p>
            Haritaya eklediğiniz av meraları ve mera konum bilgileri (enlem/boylam) amatör balıkçılık topluluğunun faydalanması amacıyla işlenir.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-600">
            <li>Konum verileriniz tamamen **anonimleştirilerek** genel harita üzerinde pin olarak sergilenir.</li>
            <li>Mera verileriniz veya kişisel profil bilgileriniz kesinlikle 3. şahıslara veya reklam ortaklarına **satılmaz ve devredilmez**.</li>
            <li>Kendi oluşturduğunuz meraları veya av günlüklerini istediğiniz an kaldırma yetkiniz bulunur.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Server className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>3. Mobil Uygulama İzinleri</span>
          </h2>
          <p>
            Android uygulamasında bazı özellikler cihaz izinleri ister. Bu izinler yalnızca ilgili özellik için kullanılır.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-600">
            <li><strong>Konum:</strong> Yakınındaki av meralarını göstermek ve harita özelliklerini kullanmak için.</li>
            <li><strong>Kamera:</strong> Av fotoğrafı, hikaye veya profil görseli paylaşımı için.</li>
            <li><strong>Bildirim:</strong> Uygulama içi hatırlatma ve önemli güncellemeler için (isteğe bağlı).</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Server className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>4. Çerezler (Cookies) ve Analiz Araçları</span>
          </h2>
          <p>
            Platformumuz sadece oturumunuzu açık tutmak (Session Cookie) ve dil tercihinizi (Türkçe/İngilizce) hatırlamak için zorunlu teknik çerezler kullanmaktadır. Reklam takibi yapan 3. taraf zararlı çerezler platformumuzda yer almaz.
          </p>
        </div>

        {/* Summary Security Box */}
        <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-950 font-medium text-xs sm:text-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Veri Güvencesi:</strong> Oltapp üzerinde paylaştığınız hiçbir veri izniniz olmadan pazarlama şirketleriyle paylaşılmaz. Amacımız sadece sürdürülebilir balıkçılığa hizmet etmektir.
          </div>
        </div>

      </motion.div>

    </div>
  );
}
