'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Package, Box, Anchor, Crosshair, Upload, Loader2, Tag, Edit, Trash2, X, ChevronRight, Layers } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function TackleBox({ userId }: { userId: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [tackleSets, setTackleSets] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);

  // Modals
  const [selectedSet, setSelectedSet] = useState<any | null>(null); // Detail Modal
  const [isFormOpen, setIsFormOpen] = useState(false); // Add/Edit Modal
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [setName, setSetName] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Rod State
  const [rodBrand, setRodBrand] = useState('');
  const [rodModel, setRodModel] = useState('');
  const [rodLength, setRodLength] = useState('');
  const [rodAction, setRodAction] = useState('');

  // Reel State
  const [reelBrand, setReelBrand] = useState('');
  const [reelModel, setReelModel] = useState('');
  const [reelSize, setReelSize] = useState('');
  const [reelRatio, setReelRatio] = useState('');

  // Line State
  const [lineBrand, setLineBrand] = useState('');
  const [lineModel, setLineModel] = useState('');
  const [lineThickness, setLineThickness] = useState('');
  const [lineTest, setLineTest] = useState('');

  // Lure State (Optional)
  const [lureBrand, setLureBrand] = useState('');
  const [lureModel, setLureModel] = useState('');
  const [lureType, setLureType] = useState('');

  useEffect(() => {
    fetchTackleSets();
    fetchBrands();
  }, []);

  const fetchTackleSets = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('tackle_sets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setTackleSets(data);
    setLoading(false);
  };

  const fetchBrands = async () => {
    const { data } = await supabase.from('equipment_brands').select('*').order('name');
    if (data) setBrands(data);
  };

  const openAddModal = () => {
    resetForm();
    setEditingSetId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (set: any) => {
    setEditingSetId(set.id);
    setSetName(set.name || '');
    setNotes(set.notes || '');
    setExistingImageUrl(set.image_url || null);
    setImageFile(null);

    // Rod
    setRodBrand(set.rod?.brand || '');
    setRodModel(set.rod?.model || '');
    setRodLength(set.rod?.length || '');
    setRodAction(set.rod?.action || '');

    // Reel
    setReelBrand(set.reel?.brand || '');
    setReelModel(set.reel?.model || '');
    setReelSize(set.reel?.size || '');
    setReelRatio(set.reel?.ratio || '');

    // Line
    setLineBrand(set.line?.brand || '');
    setLineModel(set.line?.model || '');
    setLineThickness(set.line?.thickness || '');
    setLineTest(set.line?.test || '');

    // Lure
    setLureBrand(set.lure?.brand || '');
    setLureModel(set.lure?.model || '');
    setLureType(set.lure?.type || '');

    setSelectedSet(null); // Close detail modal
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setSetName('');
    setNotes('');
    setImageFile(null);
    setExistingImageUrl(null);

    setRodBrand('');
    setRodModel('');
    setRodLength('');
    setRodAction('');

    setReelBrand('');
    setReelModel('');
    setReelSize('');
    setReelRatio('');

    setLineBrand('');
    setLineModel('');
    setLineThickness('');
    setLineTest('');

    setLureBrand('');
    setLureModel('');
    setLureType('');
  };

  const handleSaveSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setName.trim()) return alert(isTr ? 'Lütfen bir set adı girin.' : 'Please enter a set name.');

    setSaving(true);

    let image_url = existingImageUrl;
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

    const payload = {
      user_id: userId,
      name: setName,
      notes,
      image_url,
      rod: { brand: rodBrand, model: rodModel, length: rodLength, action: rodAction },
      reel: { brand: reelBrand, model: reelModel, size: reelSize, ratio: reelRatio },
      line: { brand: lineBrand, model: lineModel, thickness: lineThickness, test: lineTest },
      lure: (lureBrand || lureModel || lureType) ? { brand: lureBrand, model: lureModel, type: lureType } : null,
    };

    if (editingSetId) {
      const { data, error } = await supabase
        .from('tackle_sets')
        .update(payload)
        .eq('id', editingSetId)
        .select()
        .single();

      if (!error && data) {
        setTackleSets(prev => prev.map(s => s.id === editingSetId ? data : s));
        setIsFormOpen(false);
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('tackle_sets')
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        setTackleSets([data, ...tackleSets]);
        setIsFormOpen(false);
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleDeleteSet = async (setId: string) => {
    if (!confirm(isTr ? 'Bu seti silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this set?')) return;
    
    await supabase.from('tackle_sets').delete().eq('id', setId);
    setTackleSets(prev => prev.filter(s => s.id !== setId));
    setSelectedSet(null);
  };

  const getBrandsForCategory = (cat: string) => brands.filter(b => b.category === cat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Ekipman Setlerim' : 'My Tackle Sets'}</h2>
          <p className="text-sm text-slate-500 font-medium">
            {isTr ? 'Kamış, makine ve misinanızı set halinde kaydedin.' : 'Combine your rod, reel, and line into custom sets.'}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{isTr ? 'Yeni Set Ekle' : 'Add Set'}</span>
        </button>
      </div>

      {/* Grid of Sets */}
      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
      ) : tackleSets.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Henüz kaydedilmiş setiniz yok.' : 'No sets saved yet.'}</h3>
          <p className="text-sm text-slate-500 mt-2">{isTr ? 'İlk av setinizi (Örn: LRF Seti, Sazan Takımı) oluşturarak başlayın.' : 'Create your first set to tag in your catch log.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tackleSets.map((set) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedSet(set)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                {set.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={set.image_url} alt={set.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <Layers className="w-10 h-10 mb-1" />
                    <span className="text-xs font-semibold">{isTr ? 'Set Görseli Yok' : 'No Set Image'}</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center space-x-1">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>SET</span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-[#0F172A] text-xl leading-tight group-hover:text-emerald-600 transition-colors">
                    {set.name}
                  </h4>
                  {set.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">{set.notes}</p>}
                </div>

                {/* Sub-gear Pill Badges */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {set.rod?.model && (
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                      🎣 {set.rod.brand ? `${set.rod.brand} ` : ''}{set.rod.model}
                    </span>
                  )}
                  {set.reel?.model && (
                    <span className="inline-flex items-center bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                      ⚓ {set.reel.brand ? `${set.reel.brand} ` : ''}{set.reel.model}
                    </span>
                  )}
                  {set.line?.model && (
                    <span className="inline-flex items-center bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                      🧵 {set.line.brand ? `${set.line.brand} ` : ''}{set.line.model}
                    </span>
                  )}
                  {set.lure?.model && (
                    <span className="inline-flex items-center bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-100">
                      🪝 {set.lure.brand ? `${set.lure.brand} ` : ''}{set.lure.model}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL (Tıklayınca Açılan Detay Penceresi) */}
      <AnimatePresence>
        {selectedSet && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">SET DETAYLARI</span>
                </div>
                <button onClick={() => setSelectedSet(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">✕</button>
              </div>

              {/* Scroll Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {selectedSet.image_url && (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedSet.image_url} alt={selectedSet.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">{selectedSet.name}</h3>
                  {selectedSet.notes && <p className="text-sm text-slate-500 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedSet.notes}</p>}
                </div>

                {/* Sub-gear Sections */}
                <div className="space-y-3">
                  {/* Kamış */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
                      <span className="text-lg">🎣</span>
                      <span className="text-sm uppercase tracking-wide">Kamış (Olta)</span>
                    </div>
                    {selectedSet.rod?.model ? (
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong className="text-slate-800">Marka/Model:</strong> {selectedSet.rod.brand} {selectedSet.rod.model}</div>
                        {selectedSet.rod.length && <div><strong className="text-slate-800">Boy:</strong> {selectedSet.rod.length}</div>}
                        {selectedSet.rod.action && <div><strong className="text-slate-800">Atar/Aksiyon:</strong> {selectedSet.rod.action}</div>}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belirtilmedi</span>
                    )}
                  </div>

                  {/* Makine */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
                      <Anchor className="w-4 h-4 text-blue-500" />
                      <span className="text-sm uppercase tracking-wide">Makine</span>
                    </div>
                    {selectedSet.reel?.model ? (
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong className="text-slate-800">Marka/Model:</strong> {selectedSet.reel.brand} {selectedSet.reel.model}</div>
                        {selectedSet.reel.size && <div><strong className="text-slate-800">Kafa Boyu:</strong> {selectedSet.reel.size}</div>}
                        {selectedSet.reel.ratio && <div><strong className="text-slate-800">Devir:</strong> {selectedSet.reel.ratio}</div>}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belirtilmedi</span>
                    )}
                  </div>

                  {/* Misina */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
                      <span className="text-lg">🧵</span>
                      <span className="text-sm uppercase tracking-wide">Misina</span>
                    </div>
                    {selectedSet.line?.model ? (
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong className="text-slate-800">Marka/Model:</strong> {selectedSet.line.brand} {selectedSet.line.model}</div>
                        {selectedSet.line.thickness && <div><strong className="text-slate-800">Kalınlık:</strong> {selectedSet.line.thickness}</div>}
                        {selectedSet.line.test && <div><strong className="text-slate-800">Çeker:</strong> {selectedSet.line.test}</div>}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belirtilmedi</span>
                    )}
                  </div>

                  {/* Sahte / Yem */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
                      <Crosshair className="w-4 h-4 text-amber-500" />
                      <span className="text-sm uppercase tracking-wide">Sahte / Yem (Opsiyonel)</span>
                    </div>
                    {selectedSet.lure?.model ? (
                      <div className="text-xs text-slate-600 space-y-1">
                        <div><strong className="text-slate-800">Marka/Model:</strong> {selectedSet.lure.brand} {selectedSet.lure.model}</div>
                        {selectedSet.lure.type && <div><strong className="text-slate-800">Tip/Ağırlık:</strong> {selectedSet.lure.type}</div>}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belirtilmedi</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions (DÜZENLE / SİL) */}
              <div className="p-5 border-t border-slate-100 bg-white shrink-0 flex items-center space-x-3">
                <button
                  onClick={() => openEditModal(selectedSet)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDeleteSet(selectedSet.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-3 px-5 rounded-2xl transition-all flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sil</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
                <h2 className="text-lg font-extrabold text-[#0F172A]">
                  {editingSetId ? (isTr ? 'Seti Düzenle' : 'Edit Set') : (isTr ? 'Yeni Set Ekle' : 'Create New Set')}
                </h2>
                <button onClick={() => setIsFormOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">✕</button>
              </div>

              {/* Scrollable Form */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
                <form id="setForm" onSubmit={handleSaveSet} className="space-y-6">
                  
                  {/* SECTION 1: SET INFORMATION */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">1. General Set Info</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Set Adı' : 'Set Name'} *</label>
                      <input 
                        required 
                        type="text" 
                        value={setName} 
                        onChange={e => setSetName(e.target.value)} 
                        placeholder={isTr ? 'Örn: Boğaz LRF Setim, Sazan Takımı...' : 'e.g. Bosphorus LRF Set'} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Set Fotoğrafı (Opsiyonel)' : 'Set Image'}</label>
                      <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                        <Upload className="w-6 h-6 text-emerald-500 mb-1" />
                        <span className="text-xs font-semibold text-slate-600">
                          {imageFile ? imageFile.name : (existingImageUrl ? 'Görseli Değiştir' : 'Fotoğraf Yükle')}
                        </span>
                        <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="hidden" />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Not / Açıklama' : 'Notes'}</label>
                      <textarea 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        rows={2} 
                        placeholder={isTr ? 'Örn: Sadece gece avlarında kullandığım hafif takım...' : 'Notes...'} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* SECTION 2: KAMIŞ (ROD) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>🎣</span>
                      <span>2. Kamış (Olta)</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Marka</label>
                        <select value={rodBrand} onChange={e=>setRodBrand(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold">
                          <option value="">Seçiniz...</option>
                          {getBrandsForCategory('rod').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Model Adı</label>
                        <input type="text" placeholder="Örn: Catana DX" value={rodModel} onChange={e=>setRodModel(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Boy (cm)</label>
                        <input type="text" placeholder="240 cm" value={rodLength} onChange={e=>setRodLength(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Atar (g)</label>
                        <input type="text" placeholder="10-30 g" value={rodAction} onChange={e=>setRodAction(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: MAKİNE (REEL) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Anchor className="w-4 h-4 text-blue-500" />
                      <span>3. Makine</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Marka</label>
                        <select value={reelBrand} onChange={e=>setReelBrand(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold">
                          <option value="">Seçiniz...</option>
                          {getBrandsForCategory('reel').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Model Adı</label>
                        <input type="text" placeholder="Örn: Stradic FL" value={reelModel} onChange={e=>setReelModel(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Kafa Boyu</label>
                        <input type="text" placeholder="Örn: 4000" value={reelSize} onChange={e=>setReelSize(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Devir (Ratio)</label>
                        <input type="text" placeholder="Örn: 6.2:1" value={reelRatio} onChange={e=>setReelRatio(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: MİSİNA (LINE) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>🧵</span>
                      <span>4. Misina</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Marka</label>
                        <select value={lineBrand} onChange={e=>setLineBrand(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold">
                          <option value="">Seçiniz...</option>
                          {getBrandsForCategory('line').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Model / İp Türü</label>
                        <input type="text" placeholder="Örn: Kairiki 8x" value={lineModel} onChange={e=>setLineModel(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Kalınlık (mm / PE)</label>
                        <input type="text" placeholder="Örn: 0.16 mm" value={lineThickness} onChange={e=>setLineThickness(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Çeker (kg/lb)</label>
                        <input type="text" placeholder="Örn: 15 lb" value={lineTest} onChange={e=>setLineTest(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: SAHTE / YEM (LURE - OPTIONAL) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Crosshair className="w-4 h-4 text-amber-500" />
                      <span>5. Sahte / Yem (Opsiyonel)</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Marka</label>
                        <select value={lureBrand} onChange={e=>setLureBrand(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold">
                          <option value="">Seçiniz...</option>
                          {getBrandsForCategory('lure').map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Model Adı</label>
                        <input type="text" placeholder="Örn: Black Minnow 120" value={lureModel} onChange={e=>setLureModel(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Tip / Ağırlık</label>
                        <input type="text" placeholder="Örn: Silikon Yem 25g" value={lureType} onChange={e=>setLureType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium" />
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* Form Footer */}
              <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                <button 
                  form="setForm" 
                  type="submit" 
                  disabled={saving} 
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-70 flex justify-center items-center space-x-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingSetId ? (isTr ? 'Güncelle' : 'Update Set') : (isTr ? 'Seti Kaydet' : 'Save Set'))}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

