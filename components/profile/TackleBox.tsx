'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Package, Box, Anchor, Crosshair, Upload, Loader2, Tag, Scale, Ruler, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function TackleBox({ userId }: { userId: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [tackleItems, setTackleItems] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Brands
  const [brands, setBrands] = useState<any[]>([]);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [category, setCategory] = useState('rod');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  
  // Dynamic Specs
  const [specs, setSpecs] = useState<Record<string, string>>({});
  
  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTackleBox();
    fetchBrands();
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

  const fetchBrands = async () => {
    const { data } = await supabase.from('equipment_brands').select('*').order('name');
    if (data) setBrands(data);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setBrand('');
    setSpecs({});
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model) return alert('Lütfen marka ve model girin.');
    
    setSaving(true);
    
    let image_url = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `tackle/${userId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, imageFile);
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }
    }

    const name = `${brand} ${model}`;

    const { data, error } = await supabase
      .from('tackle_box')
      .insert({ 
        user_id: userId, 
        name, 
        category, 
        description,
        brand,
        model,
        image_url,
        specifications: specs
      })
      .select()
      .single();

    if (!error && data) {
      setTackleItems([data, ...tackleItems]);
      setIsModalOpen(false);
      resetForm();
    }
    setSaving(false);
  };

  const resetForm = () => {
    setCategory('rod');
    setBrand('');
    setModel('');
    setDescription('');
    setSpecs({});
    setImageFile(null);
  };

  const filteredBrands = brands.filter(b => b.category === category);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'set': return <Package className="w-5 h-5" />;
      case 'rod': return <span className="text-xl">🎣</span>;
      case 'reel': return <Anchor className="w-5 h-5" />;
      case 'lure': return <Crosshair className="w-5 h-5" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'set': return isTr ? 'Kombinasyon' : 'Set';
      case 'rod': return isTr ? 'Kamış' : 'Rod';
      case 'reel': return isTr ? 'Makine' : 'Reel';
      case 'line': return isTr ? 'Misina' : 'Line';
      case 'lure': return isTr ? 'Sahte/Yem' : 'Lure/Bait';
      case 'accessory': return isTr ? 'Aksesuar' : 'Accessory';
      default: return cat;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isTr ? 'Bu ekipmanı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this gear?')) return;
    
    setTackleItems(prev => prev.filter(item => item.id !== id));
    await supabase.from('tackle_box').delete().eq('id', id);
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
          className="flex items-center space-x-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{isTr ? 'Malzeme Ekle' : 'Add Gear'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
      ) : tackleItems.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Çantanız boş.' : 'Your tackle box is empty.'}</h3>
          <p className="text-sm text-slate-500 mt-2">{isTr ? 'Yeni bir ekipman ekleyerek başlayın.' : 'Start by adding new gear.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tackleItems.map((item) => (
            <div key={item.id} className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 group">
              {/* Swipe Background Actions */}
              <div className="absolute inset-0 flex items-center justify-between px-6 font-bold text-white text-sm">
                <div className="flex items-center text-blue-500">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Düzenle (Yakında)</span>
                </div>
                <div className="flex items-center text-red-500">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Silmek için kaydır</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                drag="x"
                dragConstraints={{ left: -120, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) {
                    handleDelete(item.id);
                  }
                }}
                className="bg-white relative z-10 w-full h-full rounded-3xl flex flex-col group-hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing"
              >
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden rounded-t-3xl">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                  ) : (
                    <div className="text-slate-300">{getCategoryIcon(item.category)}</div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {getCategoryLabel(item.category)}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col pointer-events-none">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">{item.brand || 'Markasız'}</span>
                  </div>
                  <h4 className="font-extrabold text-[#0F172A] text-xl leading-tight">{item.model || item.name}</h4>
                  
                  {item.specifications && Object.keys(item.specifications).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {Object.entries(item.specifications).map(([key, val]) => (
                        <span key={key} className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                          <Tag className="w-3 h-3 mr-1 opacity-50" />
                          {val as string}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.description && <p className="text-xs text-slate-500 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">{item.description}</p>}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
              <h2 className="text-lg font-extrabold text-[#0F172A]">{isTr ? 'Yeni Ekipman Ekle' : 'Add Gear'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto pb-safe flex-1 scrollbar-thin">
              <form id="tackleForm" onSubmit={handleAdd} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Kategori' : 'Category'}</label>
                    <select value={category} onChange={e=>handleCategoryChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-bold text-slate-700">
                      <option value="set">{isTr ? 'Set (Kombinasyon)' : 'Set'}</option>
                      <option value="rod">{isTr ? 'Kamış (Rod)' : 'Rod'}</option>
                      <option value="reel">{isTr ? 'Makine (Reel)' : 'Reel'}</option>
                      <option value="line">{isTr ? 'Misina (Line)' : 'Line'}</option>
                      <option value="lure">{isTr ? 'Sahte/Yem (Lure)' : 'Lure'}</option>
                      <option value="accessory">{isTr ? 'Aksesuar' : 'Accessory'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Marka' : 'Brand'}</label>
                    <select required={category !== 'set'} value={brand} onChange={e=>setBrand(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-bold text-slate-700">
                      <option value="">Seçiniz...</option>
                      <option value="Karışık (Custom)">Karışık / Markasız</option>
                      {filteredBrands.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{category === 'set' ? (isTr ? 'Set Adı' : 'Set Name') : (isTr ? 'Model Adı' : 'Model Name')}</label>
                  <input required type="text" value={model} onChange={e=>setModel(e.target.value)} placeholder={category === 'set' ? "Örn: LRF Setim" : "Örn: Stradic, Catana..."} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>

                {/* DYNAMIC SPECS BASED ON CATEGORY */}
                {category === 'rod' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Boy (cm)</label>
                      <input type="text" placeholder="240" onChange={e => setSpecs({...specs, Boy: e.target.value + ' cm'})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Atar (g)</label>
                      <input type="text" placeholder="10-30" onChange={e => setSpecs({...specs, Atar: e.target.value + ' g'})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Aksiyon</label>
                      <input type="text" placeholder="Örn: Fast" onChange={e => setSpecs({...specs, Aksiyon: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                  </div>
                )}

                {category === 'reel' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Kafa Boyu</label>
                      <input type="text" placeholder="4000" onChange={e => setSpecs({...specs, 'Kafa Boyu': e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Devir (Ratio)</label>
                      <input type="text" placeholder="6.2:1" onChange={e => setSpecs({...specs, Devir: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                  </div>
                )}

                {category === 'line' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Kalınlık (mm)</label>
                      <input type="text" placeholder="0.16" onChange={e => setSpecs({...specs, 'Kalınlık': e.target.value + ' mm'})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Çeker (lb/kg)</label>
                      <input type="text" placeholder="20 lb" onChange={e => setSpecs({...specs, 'Çeker': e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Ekipman Görseli</label>
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                    <Upload className="w-6 h-6 text-emerald-500 mb-2" />
                    <span className="text-sm font-semibold text-slate-600">{imageFile ? imageFile.name : 'Fotoğraf Yükle (Opsiyonel)'}</span>
                    <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Özel Not / Açıklama' : 'Note / Description'}</label>
                  <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} placeholder="Örn: Sadece tatlı suda lrf için kullanıyorum..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium resize-none"></textarea>
                </div>
              </form>
            </div>

            {/* Footer fixed at bottom of modal */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
              <button form="tackleForm" type="submit" disabled={saving} className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-70 flex justify-center items-center">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (isTr ? 'Çantaya Ekle' : 'Add to Box')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
