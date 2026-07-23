/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, MapPin, Scale, Ruler, Camera, BarChart3, Package, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import TackleBox from './TackleBox';
import CatchCardExport from '../community/CatchCardExport';
import { getLegalMinSize } from '@/lib/fish_regulations';

export default function ProfileClient({ user, profile, initialCatches }: { user: Record<string, any>; profile: Record<string, any>; initialCatches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'stats' | 'log' | 'tackle'>('log');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [lureUsed, setLureUsed] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [tackleBoxId, setTackleBoxId] = useState<string>('');
  
  // User Tackle Sets for the dropdown
  const [userTackleSets, setUserTackleSets] = useState<any[]>([]);

  useEffect(() => {
    // Fetch tackle sets for the dropdown
    const fetchTackleSets = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tackle_sets').select('id, name').eq('user_id', user.id);
      if (data) setUserTackleSets(data);
    };
    fetchTackleSets();
  }, [user.id]);

  const handleAddCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(isTr ? 'Giriş yapmış olmanız gerekmektedir.' : 'You must be logged in.');
      return;
    }
    if (!imageFile) {
      alert(isTr ? 'Lütfen bir av fotoğrafı seçin.' : 'Please select a catch photo.');
      return;
    }
    
    setLoading(true);

    try {
      const supabase = createClient();
      
      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        alert(isTr 
          ? `Fotoğraf yüklenemedi!\n\nHata: ${uploadError.message}\n\nLütfen Supabase panelinizde 'user_uploads' depolama alanının (Storage Bucket) açık ve yetkilendirilmiş olduğundan emin olun.` 
          : `Failed to upload image: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      const formattedTackleBoxId = (tackleBoxId && tackleBoxId.trim() !== '') ? tackleBoxId : null;

      // 2. Insert Record
      const { error: insertError } = await supabase
        .from('catch_logs')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          weight: weight ? parseFloat(weight) : null,
          length: length ? parseFloat(length) : null,
          lure_used: lureUsed || null,
          location_note: locationNote || null,
          tackle_box_id: formattedTackleBoxId
        });

      if (insertError) {
        console.error('Catch Log Insert Error:', insertError);
        const isFkeyError = insertError.message?.includes('foreign key constraint') || insertError.message?.includes('catch_logs_tackle_box_id_fkey');
        
        if (isFkeyError) {
          alert(isTr 
            ? `Av kaydı veritabanına eklenemedi!\n\nHata (İlişkisel Veri Bağlantısı): ${insertError.message}\n\nÇözüm: Supabase panelinizdeki SQL Editor alanında 'complete_database_setup.sql' dosyasını çalıştırarak veritabanı bağlantı yetkilerini güncelleyin.` 
            : `Foreign Key Error: Please run complete_database_setup.sql in Supabase SQL Editor.`);
        } else {
          alert(isTr 
            ? `Av kaydı veritabanına eklenemedi!\n\nHata: ${insertError.message}\n\nEğer tablo henüz oluşmadıysa lütfen Supabase panelinizde SQL kodunu çalıştırın.` 
            : `Database error: ${insertError.message}`);
        }
      } else {
        alert(isTr ? '🎉 Av kaydı başarıyla günlüğe eklendi!' : 'Catch log saved successfully!');
        setIsModalOpen(false);
        // Reset form
        setImageFile(null);
        setWeight('');
        setLength('');
        setLureUsed('');
        setLocationNote('');
        setTackleBoxId('');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      alert(isTr ? `Beklenmeyen bir hata oluştu: ${err?.message || err}` : `An error occurred: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Stats Calculations
  const totalCatches = initialCatches.length;
  const biggestCatch = initialCatches.reduce((max, log) => (log.weight > (max.weight || 0) ? log : max), initialCatches[0] || null);
  const totalWeight = initialCatches.reduce((sum, log) => sum + (log.weight || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-6">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-full flex items-center justify-center text-emerald-400 font-black text-3xl shadow-lg">
          {profile?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A]">
            {profile?.username || 'Kullanıcı'}
          </h1>
          <p className="text-sm font-medium text-slate-500 flex items-center mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Oltapp Pro
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'log' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isTr ? 'Av Güncesi' : 'Catch Log'}</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'stats' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isTr ? 'İstatistikler' : 'Stats'}</span>
        </button>
        <button
          onClick={() => setActiveTab('tackle')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'tackle' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isTr ? 'Malzeme Çantası' : 'Tackle Box'}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'log' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Son Avlarım' : 'Recent Catches'}</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{isTr ? 'Yeni Av Ekle' : 'Add Catch'}</span>
              </button>
            </div>

            {initialCatches.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Henüz hiç av eklenmemiş.' : 'No catches added yet.'}</h3>
                <p className="text-sm text-slate-500 mt-2">{isTr ? 'İlk avınızı ekleyerek dijital livarınızı oluşturun.' : 'Add your first catch to build your log.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCatches.map((log: Record<string, any>) => (
                  <div key={log.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                    <div className="aspect-[4/3] bg-slate-100 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={log.image_url} alt="Catch" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-[#0F172A] text-lg">
                          {log.location_note || (isTr ? 'Bilinmeyen Mera' : 'Unknown Spot')}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                        {log.weight && (
                          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Scale className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{log.weight} kg</span>
                          </div>
                        )}
                        {log.length && (
                          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Ruler className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{log.length} cm</span>
                          </div>
                        )}
                      </div>

                      {(log.lure_used || log.tackle_box_id) && (
                        <div className="pt-2 border-t border-slate-100 text-xs">
                          {log.tackle_box_id ? (
                            <div className="flex items-center space-x-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md inline-block">
                              <Package className="w-3 h-3" />
                              <span>{isTr ? 'Kayıtlı Ekipman Kullanıldı' : 'Saved Gear Used'}</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-slate-400 font-semibold uppercase">{isTr ? 'Kullanılan Takım/Yem:' : 'Lure/Bait:'}</span>
                              <span className="ml-1 text-slate-700 font-bold">{log.lure_used}</span>
                            </>
                          )}
                        </div>
                      )}
                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <CatchCardExport log={log} profileName={profile?.username || 'Oltapp User'} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Kişisel İstatistikler' : 'Personal Stats'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam Av Sayısı' : 'Total Catches'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{totalCatches}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-2">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'En Büyük Trofe' : 'Biggest Trophy'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{biggestCatch?.weight ? `${biggestCatch.weight} kg` : '-'}</div>
                <div className="text-xs font-semibold text-slate-500">{biggestCatch?.location_note}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-2">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam Yakalanan Ağırlık' : 'Total Caught Weight'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{totalWeight.toFixed(1)} kg</div>
              </div>

            </div>

            {/* Advanced Livar Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Location & Species Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <span className="text-lg">📊</span>
                  <span>{isTr ? 'En Çok Av Yapılan Meralar' : 'Top Fishing Spots'}</span>
                </h3>
                {initialCatches.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Veri yok</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(
                      initialCatches.reduce((acc: Record<string, number>, log) => {
                        const spot = log.location_note || 'Genel Mera';
                        acc[spot] = (acc[spot] || 0) + 1;
                        return acc;
                      }, {})
                    )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([spotName, count]) => {
                      const percentage = Math.round((count / initialCatches.length) * 100);
                      return (
                        <div key={spotName} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{spotName}</span>
                            <span className="text-emerald-600">{count} av ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Luckiest Set & Gear Efficiency */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <span className="text-lg">🎣</span>
                  <span>{isTr ? 'En Verimli Ekipman Seti' : 'Most Efficient Gear Set'}</span>
                </h3>
                {userTackleSets.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Henüz kayıtlı setiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {userTackleSets.slice(0, 3).map((set, idx) => (
                      <div key={set.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-[#0F172A]">{set.name}</h4>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">En Verimli Kombinasyon</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tackle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TackleBox userId={user.id} />
          </motion.div>
        )}
      </div>

      {/* Add Catch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto pt-20 pb-20">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-xl font-extrabold text-[#0F172A]">{isTr ? 'Yeni Av Günlüğü' : 'New Catch Log'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddCatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Av Fotoğrafı' : 'Catch Photo'} *</label>
                <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors w-full">
                  <Camera className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">{imageFile ? imageFile.name : (isTr ? 'Fotoğraf Seç' : 'Choose Photo')}</span>
                  <input type="file" accept="image/*" required onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Ağırlık (kg)' : 'Weight (kg)'}</label>
                  <input type="number" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Uzunluk (cm)' : 'Length (cm)'}</label>
                  <input type="number" step="0.1" value={length} onChange={e=>setLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              {/* Legal Size Limit Warning check */}
              {length && lureUsed && (() => {
                const minSize = getLegalMinSize(lureUsed);
                if (minSize && parseFloat(length) < minSize) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold flex items-center space-x-2">
                      <span className="text-base">⚠️</span>
                      <span>{lureUsed} için yasal avlanma alt sınırı min. <strong>{minSize} cm</strong>&apos;dir (Sirküler No: 5/2). Sürdürülebilir balıkçılık için lütfen küçük balıkları suya iade edelim!</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Mera / Konum' : 'Location'}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={locationNote} onChange={e=>setLocationNote(e.target.value)} placeholder={isTr ? 'Örn: İstanbul Boğazı' : 'e.g. Bosphorus'} className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-700 flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>{isTr ? 'Kullanılan Ekipman' : 'Gear Used'}</span>
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Setlerinizden Seçin' : 'Select from Your Sets'}</label>
                  <select 
                    value={tackleBoxId} 
                    onChange={e => setTackleBoxId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
                  >
                    <option value="">{isTr ? '-- Set Seçilmedi --' : '-- None --'}</option>
                    {userTackleSets.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">{isTr ? 'veya' : 'or'}</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Manuel Yazın (Yem / Sahte)' : 'Enter Manually (Lure / Bait)'}</label>
                  <input type="text" value={lureUsed} onChange={e=>setLureUsed(e.target.value)} placeholder={isTr ? 'Örn: 10g Kaşık' : 'e.g. 10g Spoon'} disabled={!!tackleBoxId} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 w-full sm:w-auto">
                  {loading ? (isTr ? 'Yükleniyor...' : 'Uploading...') : (isTr ? 'Günlüğe Kaydet' : 'Save to Log')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
