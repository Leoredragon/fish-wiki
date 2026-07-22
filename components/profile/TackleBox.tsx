'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Package, Box, Anchor, Crosshair, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function TackleBox({ userId }: { userId: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [tackleItems, setTackleItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('rod');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTackleBox();
  }, []);

  const fetchTackleBox = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tackle_box')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setTackleItems(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from('tackle_box')
      .insert({ user_id: userId, name, category, description })
      .select()
      .single();

    if (!error && data) {
      setTackleItems([data, ...tackleItems]);
      setIsModalOpen(false);
      setName('');
      setCategory('rod');
      setDescription('');
    }
    setSaving(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'rod': return <span className="text-xl">🎣</span>;
      case 'reel': return <Anchor className="w-5 h-5" />;
      case 'lure': return <Crosshair className="w-5 h-5" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'rod': return isTr ? 'Kamış' : 'Rod';
      case 'reel': return isTr ? 'Makine' : 'Reel';
      case 'line': return isTr ? 'Misina' : 'Line';
      case 'lure': return isTr ? 'Sahte/Yem' : 'Lure/Bait';
      case 'accessory': return isTr ? 'Aksesuar' : 'Accessory';
      default: return cat;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Dijital Malzeme Çantam' : 'My Tackle Box'}</h2>
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Ekipmanlarınızı ekleyin, avlarınıza etiketleyin.' : 'Add your gear, tag them to your catches.'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isTr ? 'Malzeme Ekle' : 'Add Gear'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">...</div>
      ) : tackleItems.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Çantanız boş.' : 'Your tackle box is empty.'}</h3>
          <p className="text-sm text-slate-500 mt-2">{isTr ? 'Yeni bir ekipman ekleyerek başlayın.' : 'Start by adding new gear.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tackleItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                {getCategoryIcon(item.category)}
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                  {getCategoryLabel(item.category)}
                </div>
                <h4 className="font-bold text-[#0F172A] text-lg leading-tight mt-0.5">{item.name}</h4>
                {item.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-[#0F172A]">{isTr ? 'Malzeme Ekle' : 'Add Gear'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Kategori' : 'Category'}</label>
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-700">
                  <option value="rod">{isTr ? 'Kamış (Rod)' : 'Rod'}</option>
                  <option value="reel">{isTr ? 'Makine (Reel)' : 'Reel'}</option>
                  <option value="line">{isTr ? 'Misina (Line)' : 'Line'}</option>
                  <option value="lure">{isTr ? 'Sahte / Yem (Lure/Bait)' : 'Lure/Bait'}</option>
                  <option value="accessory">{isTr ? 'Aksesuar' : 'Accessory'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Malzeme Adı' : 'Name'}</label>
                <input required type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Örn: Shimano Catana 1-7g" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Açıklama / Özellik (Opsiyonel)' : 'Description (Optional)'}</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} placeholder="Örn: Tatlı su LRF avlarım için..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium resize-none"></textarea>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-70">
                  {saving ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Çantaya Ekle' : 'Add to Box')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
