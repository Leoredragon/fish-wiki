'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { MapPin, Compass, Anchor, Sparkles, Loader2, Plus, AlertCircle, X, Camera, User, Calendar, ArrowRight, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FishingSpot } from './MapComponent';
import { compressImageToWebP } from '@/lib/image_compression';

// Dynamically import Leaflet MapComponent with SSR disabled
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      <span className="text-sm font-semibold text-slate-500">Harita ve Meralar Yükleniyor...</span>
    </div>
  )
});

interface Region {
  id: string;
  nameTr: string;
  nameEn: string;
  waterType: string;
  descriptionTr: string;
  descriptionEn: string;
  popularSpeciesTr: string[];
  popularSpeciesEn: string[];
  recommendedGearTr: string;
  recommendedGearEn: string;
  pinCoordinates: { lat: number; lng: number };
}

const REGIONS: Region[] = [
  {
    id: 'bosphorus',
    nameTr: 'İstanbul Boğazı & Marmara',
    nameEn: 'Bosphorus & Marmara Sea',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Karadeniz ile Akdeniz arasındaki balık göç koridoru. Akıntılı suları ve kıyı meralarıyla lüfer, palamut ve istavrit avcılığının başkentidir.',
    descriptionEn: 'Major migratory corridor between the Black Sea and Mediterranean. Famous for Bluefish, Bonito, and European Seabass.',
    popularSpeciesTr: ['Lüfer', 'Deniz Levreği', 'İstavrit', 'Palamut'],
    popularSpeciesEn: ['Bluefish', 'European Seabass', 'Horse Mackerel', 'Atlantic Bonito'],
    recommendedGearTr: 'Spinning, Kurşun Arkası Rapala, Hansen Kaşık, Uzun Olta',
    recommendedGearEn: 'Heavy Spinning, Metal Spoons, Wire Rigs',
    pinCoordinates: { lat: 41.0082, lng: 28.9784 }
  },
  {
    id: 'aegean',
    nameTr: 'Ege Kıyıları (İzmir, Çeşme, Ayvalık)',
    nameEn: 'Aegean Coast (Izmir, Cesme)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Girintili çıkıntılı koyları ve sığ kayalık meralarıyla Türkiye’nin en zengin çupra, levrek ve kalamar meralarına ev sahipliği yapar.',
    descriptionEn: 'Indented coastline offering premier habitat for Gilt-head Bream, Seabass, and Squid.',
    popularSpeciesTr: ['Çupra', 'Deniz Levreği', 'Kalamar', 'Akya'],
    popularSpeciesEn: ['Gilt-head Bream', 'European Seabass', 'Squid', 'Amberjack'],
    recommendedGearTr: 'Yemli Gezer Kurşunlu Dip Takımı, LRF, EGI Kalamar Zokası',
    recommendedGearEn: 'Bottom Rigs with Marine Worms, EGI Squid Jigs, LRF',
    pinCoordinates: { lat: 38.4237, lng: 27.1428 }
  },
  {
    id: 'mediterranean',
    nameTr: 'Akdeniz Kıyıları (Antalya, Alanya, Fethiye)',
    nameEn: 'Mediterranean Coast (Antalya, Fethiye)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Derin mavi sular ve kayalık kanyonlar. Büyük trofe balıklar (Grida, Akya, Kuzu) için derin su jigging ve trolling imkanı sunar.',
    descriptionEn: 'Deep waters and underwater canyons offering trophy pelagic fishing for Amberjack and Groupers.',
    popularSpeciesTr: ['Akya', 'Grida (Lagos)', 'Kuzu Balığı', 'Çupra'],
    popularSpeciesEn: ['Amberjack', 'White Grouper', 'Greater Amberjack', 'Bream'],
    recommendedGearTr: 'Slow Jigging, Sırtı (Trolling), Ağır Dip Oltası',
    recommendedGearEn: 'Slow Jigging, Offshore Trolling, Heavy Bottom Tackle',
    pinCoordinates: { lat: 36.8969, lng: 30.7133 }
  },
  {
    id: 'blacksea',
    nameTr: 'Karadeniz (Trabzon, Rize, Sinop)',
    nameEn: 'Black Sea (Trabzon, Sinop)',
    waterType: 'Tuzlu Su',
    descriptionTr: 'Dalgalı açık sular ve kumluk dipler. Dip avcılığında kalkan, mezgit ve zargana avı oldukça yaygındır.',
    descriptionEn: 'Open sea and sandy seabed structure. Renowned for Turbot, Whiting, and Needlefish.',
    popularSpeciesTr: ['Kalkan', 'Mezgit', 'İstavrit', 'Lüfer'],
    popularSpeciesEn: ['Turbot', 'Whiting', 'Horse Mackerel', 'Bluefish'],
    recommendedGearTr: 'Surfcasting Dip Takımı, Çapari, Kaşık',
    recommendedGearEn: 'Surfcasting Rigs, Sabiki Rigs, Metal Spoons',
    pinCoordinates: { lat: 41.0027, lng: 39.7168 }
  },
  {
    id: 'abant_lakes',
    nameTr: 'Bolu & Göller Bölgesi (Abant, İznik)',
    nameEn: 'Bolu & Lake District (Abant, Iznik)',
    waterType: 'Tatlı Su',
    descriptionTr: 'Yüksek irtifa dereleri ve sakin göl meraları. Endemik Abant Alası ve trofe sazan avcılığının kalbidir.',
    descriptionEn: 'High-altitude mountain streams and peaceful lakes hosting endemic trout and specimen carp.',
    popularSpeciesTr: ['Abant Alası', 'Aynalı Sazan', 'Tatlı Su Kefali'],
    popularSpeciesEn: ['Abant Trout', 'Mirror Carp', 'Chub'],
    recommendedGearTr: 'Fly-Fishing, Boilie Sazan Montajı, LRF Micro Kaşık',
    recommendedGearEn: 'Fly-Fishing, Hair Rigs with Boilies, Micro Lures',
    pinCoordinates: { lat: 40.6053, lng: 31.2811 }
  }
];

export default function RegionMapClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const supabase = createClient();

  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
  
  // User Session & Spots
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([]);
  const [favoriteSpotIds, setFavoriteSpotIds] = useState<string[]>([]);

  // Modals & Interactivity State
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null); // Detail Modal
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false); // Guest Warning Modal
  
  // Location Pick Mode State
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [tempPickedLocation, setTempPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form State
  const [spotTitle, setSpotTitle] = useState('');
  const [spotDescription, setSpotDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [savingSpot, setSavingSpot] = useState(false);

  useEffect(() => {
    // 1. Get Session User
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      if (user) fetchFavoriteSpotIds(user.id);
    });

    // 2. Fetch User Fishing Spots
    fetchFishingSpots();
  }, []);

  const fetchFavoriteSpotIds = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('favorite_spots')
        .select('spot_id')
        .eq('user_id', userId);
      if (data) setFavoriteSpotIds(data.map(f => f.spot_id));
    } catch {}
  };

  const toggleFavoriteSpot = async (spotId: string) => {
    if (!currentUser) {
      setIsGuestModalOpen(true);
      return;
    }

    const isFav = favoriteSpotIds.includes(spotId);
    if (isFav) {
      setFavoriteSpotIds(prev => prev.filter(id => id !== spotId));
      await supabase.from('favorite_spots').delete().eq('user_id', currentUser.id).eq('spot_id', spotId);
    } else {
      setFavoriteSpotIds(prev => [...prev, spotId]);
      await supabase.from('favorite_spots').insert({ user_id: currentUser.id, spot_id: spotId });
    }
  };

  const fetchFishingSpots = async () => {
    const { data } = await supabase
      .from('fishing_spots')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFishingSpots(data);
  };

  const handleAddSpotClick = () => {
    if (!currentUser) {
      setIsGuestModalOpen(true);
    } else {
      setIsPickingLocation(true);
      setTempPickedLocation(null);
    }
  };

  const handleLocationPickedOnMap = (loc: { lat: number; lng: number }) => {
    setTempPickedLocation(loc);
    setIsAddFormOpen(true);
  };

  const handleSaveSpotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPickedLocation) {
      alert('Lütfen haritadan bir konum seçin.');
      return;
    }
    if (!currentUser) {
      alert('Mera eklemek için üye girişi yapmalısınız.');
      setIsGuestModalOpen(true);
      return;
    }
    if (!spotTitle.trim() || !spotDescription.trim()) {
      alert('Lütfen mera adı ve kısa bilgi girin.');
      return;
    }

    setSavingSpot(true);

    try {
      let image_url = null;
      if (imageFile) {
        const compressed = await compressImageToWebP(imageFile);
        const fileName = `spots/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
        const { error: uploadError } = await supabase.storage.from('user_uploads').upload(fileName, compressed, { contentType: 'image/webp', cacheControl: '31536000' });
        if (uploadError) {
          console.warn('Storage upload warning:', uploadError);
          alert(`Mera görseli yüklenemedi: ${uploadError.message}. Mera görselsiz olarak kaydedilecek.`);
        } else {
          const { data: publicUrlData } = supabase.storage.from('user_uploads').getPublicUrl(fileName);
          image_url = publicUrlData?.publicUrl || null;
        }
      }

      const creator_name = currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || 'Oltapp Üyesi';

      const { data, error } = await supabase
        .from('fishing_spots')
        .insert({
          user_id: currentUser?.id,
          creator_name,
          title: spotTitle.trim(),
          description: spotDescription.trim(),
          lat: tempPickedLocation.lat,
          lng: tempPickedLocation.lng,
          image_url
        })
        .select()
        .single();

      if (error) {
        console.error('Fishing spot insert error:', error);
        alert(`Mera kaydedilemedi!\n\nHata: ${error.message}\n\nEğer tablo henüz veritabanında yoksa lütfen verilen SQL scriptini Supabase SQL Editor'da çalıştırın.`);
      } else if (data) {
        alert('🎉 Mera haritaya başarıyla eklendi!');
        setFishingSpots(prev => [data, ...prev]);
        setIsAddFormOpen(false);
        setIsPickingLocation(false);
        setTempPickedLocation(null);
        resetAddForm();
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      alert('Beklenmeyen bir hata oluştu: ' + (err?.message || err));
    } finally {
      setSavingSpot(false);
    }
  };

  const resetAddForm = () => {
    setSpotTitle('');
    setSpotDescription('');
    setImageFile(null);
  };

  const cancelPickingMode = () => {
    setIsPickingLocation(false);
    setTempPickedLocation(null);
    setIsAddFormOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 relative">
      
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isTr ? 'Türkiye Balıkçılık Haritası' : 'Turkey Angling Map'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {isTr
              ? 'Haritadaki meraları inceleyin, yeşil pinlere dokunarak detayı görün ve kendi meranızı ekleyin.'
              : 'Explore spots on the map, click green pins for details, and add your own fishing spots.'}
          </p>
        </div>
      </motion.section>

      {/* Picking Location Floating Instruction Banner */}
      <AnimatePresence>
        {isPickingLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-20 z-50 bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Konum Seçme Modu Aktif</h4>
                <p className="text-xs text-slate-300">Haritada mera eklemek istediğiniz noktaya dokunun.</p>
              </div>
            </div>
            <button
              onClick={cancelPickingMode}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              İptal Et
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Leaflet Map Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">
              {isTr ? 'Tıklamalı Türkiye Av Haritası' : 'Interactive Turkey Fishing Map'}
            </h2>
          </div>

          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full">
            {isTr ? 'Haritadan Bölge Seçin' : 'Click Region on Map'}
          </span>
        </div>

        {/* Dynamic Leaflet Map Component */}
        <MapComponent 
          regions={REGIONS}
          selectedRegionId={selectedRegion.id}
          onSelectRegion={(id) => {
            const reg = REGIONS.find(r => r.id === id);
            if (reg) setSelectedRegion(reg);
          }}
          fishingSpots={fishingSpots}
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          isPickingLocation={isPickingLocation}
          onLocationPicked={handleLocationPickedOnMap}
          tempPickedLocation={tempPickedLocation}
          isTr={isTr}
        />
      </div>

      {/* Region Selector Pills */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            {isTr ? 'Bölge Listesi' : 'Select Region'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {REGIONS.map((reg) => {
            const isSelected = selectedRegion.id === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg)}
                className={`p-4 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                <span>{isTr ? reg.nameTr : reg.nameEn}</span>
                <span className={`text-[10px] mt-2 font-semibold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {reg.waterType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Region Detailed Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRegion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {isTr ? selectedRegion.nameTr : selectedRegion.nameEn}
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedRegion.waterType}
                </span>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold">
              {isTr ? 'Aktif Av Merası' : 'Active Spot'}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {isTr ? selectedRegion.descriptionTr : selectedRegion.descriptionEn}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Species */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isTr ? 'Hedef Balık Türleri' : 'Target Species'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isTr ? selectedRegion.popularSpeciesTr : selectedRegion.popularSpeciesEn).map((sp, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald-950 border border-emerald-200 font-bold px-3 py-1.5 rounded-2xl text-xs flex items-center space-x-1"
                  >
                    <span>{sp}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Gear for Region */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Anchor className="w-4 h-4 text-slate-700" />
                <span>{isTr ? 'Merada Çalışan Takımlar' : 'Effective Tackle & Rigs'}</span>
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/60">
                {isTr ? selectedRegion.recommendedGearTr : selectedRegion.recommendedGearEn}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON (+ Mera Ekle) */}
      <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={handleAddSpotClick}
          className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 border border-emerald-500/50 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-[#0F172A] flex items-center justify-center font-black">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-emerald-400">{isTr ? 'Mera Ekle' : 'Add Spot'}</span>
        </button>
      </div>

      {/* SPOT DETAIL BOTTOM SHEET / MODAL */}
      <AnimatePresence>
        {selectedSpot && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Cover Image */}
              {selectedSpot.image_url ? (
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedSpot.image_url} alt={selectedSpot.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedSpot(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase">MERA DETAYI</span>
                  <button onClick={() => setSelectedSpot(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">✕</button>
                </div>
              )}

              {/* Content Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">{selectedSpot.title}</h3>
                  
                  {/* Creator and Date Info */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Oluşturan: <strong className="text-slate-800">{selectedSpot.creator_name}</strong></span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tarih: <strong className="text-slate-800">{new Date(selectedSpot.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mera Hakkında Bilgi</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedSpot.description}
                  </p>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Koordinat: {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}</span>
                </div>

                {/* Favorite Toggle Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => toggleFavoriteSpot(selectedSpot.id)}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                      favoriteSpotIds.includes(selectedSpot.id)
                        ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favoriteSpotIds.includes(selectedSpot.id) ? 'fill-amber-400 text-amber-500' : ''}`} />
                    <span>
                      {favoriteSpotIds.includes(selectedSpot.id) 
                        ? (isTr ? 'Favorilerimde Kayıtlı ⭐' : 'Saved in Favorites') 
                        : (isTr ? 'Favorilerime Ekle ⭐' : 'Add to Favorites')}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GUEST WARNING MODAL */}
      <AnimatePresence>
        {isGuestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">Üyelik Gereklidir</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  Mera eklemek için üye olmanız gerekmektedir.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Giriş Yap / Kayıt Ol</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
                
                <button
                  onClick={() => setIsGuestModalOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-2xl transition-all text-xs"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD SPOT FORM MODAL */}
      <AnimatePresence>
        {isAddFormOpen && tempPickedLocation && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg font-extrabold text-[#0F172A]">Yeni Av Merası Ekle</h3>
                <button onClick={cancelPickingMode} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <form id="spotForm" onSubmit={handleSaveSpotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Mera Adı *</label>
                    <input
                      required
                      type="text"
                      value={spotTitle}
                      onChange={e => setSpotTitle(e.target.value)}
                      placeholder="Örn: Sarayburnu Akıntı Burnu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Kısa Bilgi / İpuçları *</label>
                    <textarea
                      required
                      rows={3}
                      value={spotDescription}
                      onChange={e => setSpotDescription(e.target.value)}
                      placeholder="Örn: Akıntılı meradır, ağır kurşun arkası rapala çalışır..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Mera Görseli (Opsiyonel)</label>
                    <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                      <Camera className="w-6 h-6 text-emerald-500 mb-1" />
                      <span className="text-xs font-semibold text-slate-600">
                        {imageFile ? imageFile.name : 'Fotoğraf Yükle'}
                      </span>
                      <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="hidden" />
                    </label>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>Seçilen Koordinat:</span>
                    <span className="font-bold text-emerald-600">{tempPickedLocation.lat.toFixed(4)}, {tempPickedLocation.lng.toFixed(4)}</span>
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                <button
                  form="spotForm"
                  type="submit"
                  disabled={savingSpot}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {savingSpot ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : <span>Merayı Haritaya Ekle</span>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
