'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Tag, Box, Edit, Search, Check, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandManager() {
  const supabase = createClient();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Brand State
  const [newCategory, setNewCategory] = useState('rod');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Brand State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Filter State
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('equipment_brands')
      .select('*')
      .order('category')
      .order('name');
    if (data) setBrands(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setSuccessMessage(null);
    
    const { data, error } = await supabase
      .from('equipment_brands')
      .insert({ category: newCategory, name: newName.trim() })
      .select()
      .single();

    if (!error && data) {
      setBrands(prev => [...prev, data].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
      setSuccessMessage(`"${data.name}" markası başarıyla eklendi!`);
      setNewName('');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setSaving(false);
  };

  const startEdit = (brand: any) => {
    setEditingId(brand.id);
    setEditName(brand.name);
    setEditCategory(brand.category);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    
    const { error } = await supabase
      .from('equipment_brands')
      .update({ name: editName.trim(), category: editCategory })
      .eq('id', id);

    if (!error) {
      setBrands(prev => prev.map(b => b.id === id ? { ...b, name: editName.trim(), category: editCategory } : b));
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" markasını silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabase.from('equipment_brands').delete().eq('id', id);
    if (!error) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  const categories = [
    { id: 'rod', name: 'Kamış (Rod)' },
    { id: 'reel', name: 'Makine (Reel)' },
    { id: 'line', name: 'Misina (Line)' },
    { id: 'lure', name: 'Sahte Yem (Lure)' },
    { id: 'accessory', name: 'Aksesuar (Accessory)' }
  ];

  const getCategoryLabel = (cat: string) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.name : cat;
  };

  // Filtered Brands
  const filteredBrands = brands.filter(b => {
    const matchesCategory = selectedFilterCategory === 'all' || b.category === selectedFilterCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#0F172A]">Ekipman Marka Yönetimi</h2>
            <p className="text-xs font-semibold text-slate-400">Kategori bazlı markaları ekleyin, düzenleyin ve yönetin.</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
          Toplam: {brands.length} Marka
        </span>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Brand Form */}
      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 mb-1">Kategori Seçin</label>
          <select 
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-bold text-slate-800"
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 mb-1">Yeni Marka Adı</label>
          <input 
            type="text" 
            required 
            placeholder="Örn: Shimano, Daiwa, Fujin..." 
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="w-full sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
          <span>Marka Ekle</span>
        </button>
      </form>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilterCategory === 'all' 
                ? 'bg-emerald-500 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tümü ({brands.length})
          </button>
          {categories.map(c => {
            const count = brands.filter(b => b.category === c.id).length;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setSelectedFilterCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilterCategory === c.id 
                    ? 'bg-emerald-500 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Marka ara..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Brands List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-400 font-bold">Aranan kriterde marka bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence>
            {filteredBrands.map(brand => (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all"
              >
                {editingId === brand.id ? (
                  /* INLINE EDIT FORM */
                  <div className="flex items-center justify-between w-full space-x-2">
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full text-xs font-bold border border-emerald-500 rounded-lg px-2 py-1 focus:outline-none"
                      />
                      <select 
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1"
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button 
                        type="button"
                        onClick={() => handleSaveEdit(brand.id)}
                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        title="Kaydet"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                        title="İptal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* DISPLAY BRAND ITEM */
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                        <Box className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0F172A] leading-tight">{brand.name}</h4>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider mt-0.5 inline-block">
                          {getCategoryLabel(brand.category).split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* EDIT BUTTON */}
                      <button 
                        type="button"
                        onClick={() => startEdit(brand)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {/* DELETE BUTTON */}
                      <button 
                        type="button"
                        onClick={() => handleDelete(brand.id, brand.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
