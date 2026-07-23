'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Tag, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandManager() {
  const supabase = createClient();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCategory, setNewCategory] = useState('rod');
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

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
    
    const { data, error } = await supabase
      .from('equipment_brands')
      .insert({ category: newCategory, name: newName.trim() })
      .select()
      .single();

    if (!error && data) {
      setBrands(prev => [...prev, data].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
      setNewName('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu markayı silmek istediğinize emin misiniz?')) return;
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

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <Tag className="w-5 h-5 text-emerald-600" />
        <h2 className="text-base font-bold text-[#0F172A]">Ekipman Marka Yönetimi</h2>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 mb-1">Kategori</label>
          <select 
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 mb-1">Marka Adı</label>
          <input 
            type="text" 
            required 
            placeholder="Örn: Shimano" 
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Ekle</span>
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          <AnimatePresence>
            {brands.map(brand => (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">{brand.name}</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                      {brand.category}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(brand.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
