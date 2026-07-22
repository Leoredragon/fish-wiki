'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  Camera,
  MapPin,
  Calendar,
  User,
  PlusCircle,
  XCircle,
  CheckCircle2,
  Anchor
} from 'lucide-react';

interface CatchReport {
  id: string;
  anglerName: string;
  fishName: string;
  lengthCm: string;
  location: string;
  baitUsed: string;
  catchDate: string;
  photoUrl: string;
}

const INITIAL_REPORTS: CatchReport[] = [
  {
    id: 'r1',
    anglerName: 'Captain Deniz',
    fishName: 'Deniz Levreği',
    lengthCm: '54 cm (Trofe)',
    location: 'Çanakkale Saros Körfezi',
    baitUsed: 'Su Üstü WTD Popper (15g)',
    catchDate: 'Bugün, 06:30',
    photoUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'r2',
    anglerName: 'Cemil Avcı',
    fishName: 'Abant Alası',
    lengthCm: '32 cm',
    location: 'Bolu Abant Göl Çıkışı',
    baitUsed: 'Sinek Yemi (Black Gnat Fly #14)',
    catchDate: 'Dün, 17:15',
    photoUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'r3',
    anglerName: 'Sazan Master Selim',
    fishName: 'Aynalı Sazan',
    lengthCm: '68 cm (Trofe)',
    location: 'İznik Gölü Kıyısı',
    baitUsed: 'Çilek Aromalı Boilie & Hair Rig',
    catchDate: '2 Gün Önce',
    photoUrl: 'https://images.unsplash.com/photo-1516683769144-c733e561b642?auto=format&fit=crop&w=800&q=80'
  }
];

export default function CatchReportsClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [reports, setReports] = useState<CatchReport[]>(INITIAL_REPORTS);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [newReport, setNewReport] = useState<Partial<CatchReport>>({
    anglerName: '',
    fishName: '',
    lengthCm: '',
    location: '',
    baitUsed: '',
    photoUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.anglerName || !newReport.fishName) return;

    const reportObj: CatchReport = {
      id: `r_${Date.now()}`,
      anglerName: newReport.anglerName,
      fishName: newReport.fishName,
      lengthCm: newReport.lengthCm || '35 cm',
      location: newReport.location || 'Ege Kıyıları',
      baitUsed: newReport.baitUsed || 'LRF Silikon',
      catchDate: isTr ? 'Az Önce' : 'Just Now',
      photoUrl: newReport.photoUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    };

    setReports((prev) => [reportObj, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setNewReport({ anglerName: '', fishName: '', lengthCm: '', location: '', baitUsed: '', photoUrl: '' });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>{isTr ? 'Topluluk Av Günlüğü & Raporları' : 'Community Catch Reports & Angling Log'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Amatör Balıkçıların Canlı Av Günlüğü' : 'Live Angler Catch Feed'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Balıkçıların meralarda yakaladıkları trofe balıkları, kullandıkları yemleri ve av lokasyonlarını paylaştıkları canlı topluluk akışı.'
              : 'Share your recent catches, tackle setups, and success stories with fellow marine and freshwater anglers.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs py-3 px-5 rounded-2xl transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isTr ? 'Kendi Avını Paylaş' : 'Submit Your Catch'}</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Reports Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((rep) => (
          <motion.div
            key={rep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            {/* Catch Photo Header */}
            <div className="relative h-48 w-full bg-slate-900">
              <Image
                src={rep.photoUrl}
                alt={rep.fishName}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center space-x-1">
                <User className="w-3 h-3 text-emerald-400" />
                <span>{rep.anglerName}</span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-lg font-bold drop-shadow-md">{rep.fishName}</h3>
                <span className="text-xs font-semibold text-emerald-400">{rep.lengthCm}</span>
              </div>
            </div>

            {/* Catch Details Body */}
            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">{rep.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Anchor className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-600">{rep.baitUsed}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-400 border-t border-slate-100 pt-2 text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>{rep.catchDate}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Catch Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {isTr ? 'Av Raporu Paylaş' : 'Submit Catch Report'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-2 text-emerald-700">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-base">{isTr ? 'Av Raporunuz Yayınlandı!' : 'Catch Report Published!'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTr ? 'Adınız / Rumuz' : 'Your Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Balıkçı Serkan"
                      value={newReport.anglerName}
                      onChange={(e) => setNewReport({ ...newReport, anglerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTr ? 'Tutulan Balık Türü & Boy' : 'Fish Species & Size'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Deniz Levreği (42 cm)"
                      value={newReport.fishName}
                      onChange={(e) => setNewReport({ ...newReport, fishName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTr ? 'Av Yeri / Mera' : 'Fishing Spot'}
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Çanakkale Saros"
                      value={newReport.location}
                      onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isTr ? 'Kullanılan Yem / Takım' : 'Bait / Tackle Used'}
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Su Üstü Popper / LRF"
                      value={newReport.baitUsed}
                      onChange={(e) => setNewReport({ ...newReport, baitUsed: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md"
                  >
                    {isTr ? 'Raporu Gönder' : 'Submit Report'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
