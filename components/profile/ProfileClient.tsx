/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, MapPin, Scale, Ruler, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ user, profile, initialCatches }: { user: Record<string, any>; profile: Record<string, any>; initialCatches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [lureUsed, setLureUsed] = useState('');
  const [locationNote, setLocationNote] = useState('');

  const handleAddCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    setLoading(true);

    const supabase = createClient();
    
    // 1. Upload Image
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user_uploads')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error(uploadError);
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user_uploads')
      .getPublicUrl(filePath);

    // 2. Insert Record
    const { error: insertError } = await supabase
      .from('catch_logs')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        weight: weight ? parseFloat(weight) : null,
        length: length ? parseFloat(length) : null,
        lure_used: lureUsed,
        location_note: locationNote
      });

    if (!insertError) {
      setIsModalOpen(false);
      router.refresh();
      // Reset form
      setImageFile(null);
      setWeight('');
      setLength('');
      setLureUsed('');
      setLocationNote('');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center text-emerald-400 font-bold text-2xl">
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">
              {profile?.username || 'Kullanıcı'}
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {isTr ? 'Dijital Livar ve Av Güncesi' : 'Digital Catch Log'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{isTr ? 'Yeni Av Ekle' : 'Add Catch'}</span>
        </button>
      </div>

      {/* Catch Grid */}
      {initialCatches.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Henüz hiç av eklenmemiş.' : 'No catches added yet.'}</h3>
          <p className="text-sm text-slate-500 mt-2">{isTr ? 'İlk avınızı ekleyerek dijital livarınızı oluşturun.' : 'Add your first catch to build your log.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialCatches.map((log: Record<string, any>) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
            >
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
                    <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl">
                      <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{log.weight} kg</span>
                    </div>
                  )}
                  {log.length && (
                    <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl">
                      <Ruler className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{log.length} cm</span>
                    </div>
                  )}
                </div>

                {log.lure_used && (
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-semibold uppercase">{isTr ? 'Kullanılan Takım/Yem:' : 'Lure/Bait:'}</span>
                    <span className="ml-1 text-slate-700 font-bold">{log.lure_used}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-[#0F172A]">{isTr ? 'Yeni Av Günlüğü' : 'New Catch Log'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddCatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Av Fotoğrafı' : 'Catch Photo'} *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100"
                />
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

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Mera / Konum' : 'Location'}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={locationNote} onChange={e=>setLocationNote(e.target.value)} placeholder={isTr ? 'Örn: İstanbul Boğazı' : 'e.g. Bosphorus'} className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Kullanılan Yem / Sahte' : 'Lure / Bait Used'}</label>
                <input type="text" value={lureUsed} onChange={e=>setLureUsed(e.target.value)} placeholder={isTr ? 'Örn: 10g Kaşık' : 'e.g. 10g Spoon'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-70">
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
