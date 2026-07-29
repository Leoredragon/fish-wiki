/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Camera,
  X,
  FileText,
  Tags,
  FolderTree
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { compressImageToWebP } from '@/lib/image_compression';

type WikiCategory = {
  id: string;
  label_tr: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
};

type WikiSubcategory = {
  id: string;
  category_id: string;
  label_tr: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
};

function slugifyWikiId(input: string) {
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || `cat_${Date.now()}`;
}

export default function AdminWikiClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [subcategories, setSubcategories] = useState<WikiSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Article form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState('disciplines');
  const [subCategory, setSubCategory] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [shortDescTr, setShortDescTr] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [contentTr, setContentTr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [waterType, setWaterType] = useState('Tüm Sular');
  const [difficultyLevel, setDifficultyLevel] = useState('Başlangıç');

  // Taxonomy manager form
  const [catIdInput, setCatIdInput] = useState('');
  const [catLabelTr, setCatLabelTr] = useState('');
  const [catLabelEn, setCatLabelEn] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [savingTaxonomy, setSavingTaxonomy] = useState(false);

  const [subParentCategoryId, setSubParentCategoryId] = useState('tackles');
  const [subIdInput, setSubIdInput] = useState('');
  const [subLabelTr, setSubLabelTr] = useState('');
  const [subLabelEn, setSubLabelEn] = useState('');
  const [editingSubKey, setEditingSubKey] = useState<string | null>(null);

  const loadTaxonomy = useCallback(async () => {
    const [{ data: cats }, { data: subs }] = await Promise.all([
      supabase.from('wiki_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('wiki_subcategories').select('*').order('sort_order', { ascending: true })
    ]);
    setCategories(cats || []);
    setSubcategories(subs || []);
    if (!cats?.length) return;
    setCategory((prev) => (cats.some((c) => c.id === prev) ? prev : cats[0].id));
    setSubParentCategoryId((prev) => (cats.some((c) => c.id === prev) ? prev : cats[0].id));
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wiki_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setArticles(data);
      else setArticles([]);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTaxonomy();
    loadArticles();
  }, [loadTaxonomy, loadArticles]);

  const categorySubs = useMemo(
    () => subcategories.filter((s) => s.category_id === category && s.is_active !== false),
    [subcategories, category]
  );

  const managerSubs = useMemo(
    () => subcategories.filter((s) => s.category_id === subParentCategoryId),
    [subcategories, subParentCategoryId]
  );

  const resetForm = () => {
    setEditingId(null);
    setCategory(categories[0]?.id || 'disciplines');
    setSubCategory('');
    setTitleTr('');
    setTitleEn('');
    setShortDescTr('');
    setShortDescEn('');
    setContentTr('');
    setContentEn('');
    setImageUrl('');
    setWaterType('Tüm Sular');
    setDifficultyLevel('Başlangıç');
  };

  const startEdit = (article: any) => {
    setEditingId(article.id);
    setCategory(article.category || categories[0]?.id || 'disciplines');
    setSubCategory(article.sub_category || '');
    setTitleTr(article.title_tr || '');
    setTitleEn(article.title_en || '');
    setShortDescTr(article.short_desc_tr || '');
    setShortDescEn(article.short_desc_en || '');
    setContentTr(article.content_tr || '');
    setContentEn(article.content_en || '');
    setImageUrl(article.image_url || '');
    setWaterType(article.water_type || 'Tüm Sular');
    setDifficultyLevel(article.difficulty_level || 'Başlangıç');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploadingImage(true);
    try {
      const compressed = await compressImageToWebP(file, 1400, 0.82);
      const fileName = `wiki/${Math.random().toString(36).substring(2)}_${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, compressed, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false
        });

      if (uploadError) {
        setNotification({ type: 'error', message: 'Fotoğraf yüklenemedi: ' + uploadError.message });
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('user_uploads').getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) setImageUrl(publicUrlData.publicUrl);
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Beklenmeyen hata: ' + (err.message || 'Bilinmiyor') });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim()) {
      setNotification({ type: 'error', message: 'Lütfen Türkçe başlığı doldurun.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    const payload = {
      category,
      sub_category: subCategory || null,
      title_tr: titleTr.trim(),
      title_en: titleEn.trim() || titleTr.trim(),
      short_desc_tr: shortDescTr.trim(),
      short_desc_en: shortDescEn.trim() || shortDescTr.trim(),
      content_tr: contentTr.trim(),
      content_en: contentEn.trim() || contentTr.trim(),
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
      water_type: waterType,
      difficulty_level: difficultyLevel,
      is_active: true
    };

    const isValidUUID = (id: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const existingArticle = articles.find(
      (a) => (a.title_tr || '').trim().toLowerCase() === titleTr.trim().toLowerCase()
    );

    const targetId =
      editingId && isValidUUID(editingId)
        ? editingId
        : existingArticle && isValidUUID(existingArticle.id)
          ? existingArticle.id
          : null;

    try {
      const recordToSave = targetId ? { id: targetId, ...payload } : payload;
      const { data, error } = await supabase
        .from('wiki_articles')
        .upsert([recordToSave])
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Kayıt yazılamadı (yetki/RLS). Admin oturumunu kontrol edin.');

      setNotification({ type: 'success', message: 'Wiki rehber içeriği başarıyla kaydedildi.' });
      resetForm();
      await loadArticles();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Veri kaydedilirken bir hata oluştu.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rehber yazısını silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('wiki_articles').delete().eq('id', id);
      if (!error) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        if (editingId === id) resetForm();
        setNotification({ type: 'success', message: 'İçerik başarıyla silindi.' });
      }
    } catch {
      // ignore
    }
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCatIdInput('');
    setCatLabelTr('');
    setCatLabelEn('');
  };

  const resetSubForm = () => {
    setEditingSubKey(null);
    setSubIdInput('');
    setSubLabelTr('');
    setSubLabelEn('');
  };

  const saveCategory = async () => {
    if (!catLabelTr.trim()) {
      setNotification({ type: 'error', message: 'Kategori Türkçe adı zorunlu.' });
      return;
    }
    setSavingTaxonomy(true);
    try {
      const id = editingCategoryId || slugifyWikiId(catIdInput || catLabelTr);
      const sort_order = editingCategoryId
        ? categories.find((c) => c.id === editingCategoryId)?.sort_order || 100
        : (categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0) + 10);

      const { error } = await supabase.from('wiki_categories').upsert({
        id,
        label_tr: catLabelTr.trim(),
        label_en: catLabelEn.trim() || catLabelTr.trim(),
        sort_order,
        is_active: true
      });
      if (error) throw error;

      setNotification({ type: 'success', message: 'Kategori kaydedildi.' });
      resetCategoryForm();
      await loadTaxonomy();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Kategori kaydedilemedi.' });
    } finally {
      setSavingTaxonomy(false);
    }
  };

  const saveSubcategory = async () => {
    if (!subLabelTr.trim() || !subParentCategoryId) {
      setNotification({ type: 'error', message: 'Üst kategori ve alt kategori adı zorunlu.' });
      return;
    }
    setSavingTaxonomy(true);
    try {
      const id = editingSubKey?.split('::')[1] || slugifyWikiId(subIdInput || subLabelTr);
      const existing = subcategories.find((s) => s.category_id === subParentCategoryId && s.id === id);
      const sort_order = existing
        ? existing.sort_order
        : managerSubs.reduce((m, s) => Math.max(m, s.sort_order || 0), 0) + 10;

      const { error } = await supabase.from('wiki_subcategories').upsert({
        id,
        category_id: subParentCategoryId,
        label_tr: subLabelTr.trim(),
        label_en: subLabelEn.trim() || subLabelTr.trim(),
        sort_order,
        is_active: true
      });
      if (error) throw error;

      setNotification({ type: 'success', message: 'Alt kategori kaydedildi.' });
      resetSubForm();
      await loadTaxonomy();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Alt kategori kaydedilemedi.' });
    } finally {
      setSavingTaxonomy(false);
    }
  };

  const deleteCategory = async (id: string) => {
    const used = articles.some((a) => a.category === id);
    if (used) {
      setNotification({
        type: 'error',
        message: 'Bu kategoriye bağlı içerik var. Önce içerikleri başka kategoriye taşıyın.'
      });
      return;
    }
    if (!confirm(`"${id}" kategorisini silmek istiyor musunuz?`)) return;
    const { error } = await supabase.from('wiki_categories').delete().eq('id', id);
    if (error) {
      setNotification({ type: 'error', message: error.message });
      return;
    }
    setNotification({ type: 'success', message: 'Kategori silindi.' });
    await loadTaxonomy();
  };

  const deleteSubcategory = async (categoryId: string, id: string) => {
    const used = articles.some((a) => a.category === categoryId && a.sub_category === id);
    if (used) {
      setNotification({
        type: 'error',
        message: 'Bu alt kategoriye bağlı içerik var. Önce içeriklerde alt kategoriyi değiştirin.'
      });
      return;
    }
    if (!confirm(`"${id}" alt kategorisini silmek istiyor musunuz?`)) return;
    const { error } = await supabase
      .from('wiki_subcategories')
      .delete()
      .eq('category_id', categoryId)
      .eq('id', id);
    if (error) {
      setNotification({ type: 'error', message: error.message });
      return;
    }
    setNotification({ type: 'success', message: 'Alt kategori silindi.' });
    await loadTaxonomy();
  };

  const filteredArticles = articles.filter((a) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (a.title_tr || '').toLowerCase().includes(query) ||
      (a.title_en || '').toLowerCase().includes(query) ||
      (a.category || '').toLowerCase().includes(query) ||
      (a.sub_category || '').toLowerCase().includes(query)
    );
  });

  const categoryLabel = (id: string) => {
    const found = categories.find((c) => c.id === id);
    return found ? (isTr ? found.label_tr : found.label_en) : id;
  };

  const subLabel = (categoryId: string, id?: string | null) => {
    if (!id) return '—';
    const found = subcategories.find((s) => s.category_id === categoryId && s.id === id);
    return found ? (isTr ? found.label_tr : found.label_en) : id;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Balıkçılık Akademi & Wiki Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {editingId ? 'Rehber İçeriğini Düzenle' : 'Wiki Rehber İçerikleri & Kategoriler'}
          </h1>
          <p className="text-xs text-slate-400">
            İçerik, kategori ve alt kategori yönetimini buradan yapabilirsiniz.
          </p>
        </div>

        {editingId && (
          <button
            onClick={resetForm}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Yeni İçerik Ekle</span>
          </button>
        )}
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs opacity-60 hover:opacity-100">
            Kapat
          </button>
        </div>
      )}

      {/* Taxonomy Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <FolderTree className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-[#0F172A]">Kategori & Alt Kategori Yönetimi</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Tags className="w-3.5 h-3.5" />
              <span>Kategoriler</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={catLabelTr}
                onChange={(e) => setCatLabelTr(e.target.value)}
                placeholder="Türkçe ad *"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                value={catLabelEn}
                onChange={(e) => setCatLabelEn(e.target.value)}
                placeholder="İngilizce ad"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              {!editingCategoryId && (
                <input
                  value={catIdInput}
                  onChange={(e) => setCatIdInput(e.target.value)}
                  placeholder="Opsiyonel id (örn: accessories)"
                  className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveCategory}
                disabled={savingTaxonomy}
                className="bg-[#0F172A] text-white px-3 py-2 rounded-xl text-xs font-bold"
              >
                {editingCategoryId ? 'Kategoriyi Güncelle' : 'Kategori Ekle'}
              </button>
              {editingCategoryId && (
                <button type="button" onClick={resetCategoryForm} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100">
                  Vazgeç
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{c.label_tr}</p>
                    <p className="text-[10px] text-slate-400">{c.id}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(c.id);
                        setCatLabelTr(c.label_tr);
                        setCatLabelEn(c.label_en);
                        setCatIdInput(c.id);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-slate-200"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button type="button" onClick={() => deleteCategory(c.id)} className="p-1.5 rounded-lg bg-white border border-slate-200">
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Tags className="w-3.5 h-3.5" />
              <span>Alt Kategoriler</span>
            </div>

            <select
              value={subParentCategoryId}
              onChange={(e) => {
                setSubParentCategoryId(e.target.value);
                resetSubForm();
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label_tr}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={subLabelTr}
                onChange={(e) => setSubLabelTr(e.target.value)}
                placeholder="Alt kategori Türkçe *"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                value={subLabelEn}
                onChange={(e) => setSubLabelEn(e.target.value)}
                placeholder="Alt kategori İngilizce"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              {!editingSubKey && (
                <input
                  value={subIdInput}
                  onChange={(e) => setSubIdInput(e.target.value)}
                  placeholder="Opsiyonel id (örn: rod)"
                  className="sm:col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveSubcategory}
                disabled={savingTaxonomy}
                className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold"
              >
                {editingSubKey ? 'Alt Kategoriyi Güncelle' : 'Alt Kategori Ekle'}
              </button>
              {editingSubKey && (
                <button type="button" onClick={resetSubForm} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100">
                  Vazgeç
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {managerSubs.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">Bu kategoride henüz alt kategori yok.</p>
              ) : (
                managerSubs.map((s) => (
                  <div key={`${s.category_id}-${s.id}`} className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.label_tr}</p>
                      <p className="text-[10px] text-slate-400">{s.id}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubKey(`${s.category_id}::${s.id}`);
                          setSubParentCategoryId(s.category_id);
                          setSubIdInput(s.id);
                          setSubLabelTr(s.label_tr);
                          setSubLabelEn(s.label_en);
                        }}
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSubcategory(s.category_id, s.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{editingId ? 'İçerik Düzenleme Formu' : 'Yeni Rehber İçeriği Oluştur'}</span>
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Seçin</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label_tr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alt Kategori</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">Alt kategori yok / seçilmedi</option>
                  {categorySubs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label_tr}
                    </option>
                  ))}
                </select>
                {categorySubs.length === 0 && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Bu kategoride alt kategori yok. Yukarıdan ekleyebilirsiniz.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Türkçe Başlık *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Texas Rig Montajı"
                  value={titleTr}
                  onChange={(e) => setTitleTr(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">İngilizce Başlık</label>
                <input
                  type="text"
                  placeholder="Örn: Texas Rig Setup"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Su Tipi</label>
                <select
                  value={waterType}
                  onChange={(e) => setWaterType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Tüm Sular">Tüm Sular</option>
                  <option value="Tuzlu Su">Tuzlu Su</option>
                  <option value="Tatlı Su">Tatlı Su</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Seviye</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Başlangıç">Başlangıç</option>
                  <option value="Orta">Orta</option>
                  <option value="İleri">İleri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kapak Fotoğrafı / Görsel</label>
              {imageUrl && (
                <div className="mb-3 relative rounded-2xl overflow-hidden border border-slate-200 h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-xl hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1 shrink-0 transition-all">
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <span>{uploadingImage ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
                  <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" disabled={uploadingImage} />
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kısa Açıklama (Türkçe)</label>
              <input
                type="text"
                placeholder="Örn: Takılmayan ofset iğne ve kurşun takımı ile otluk dip avı..."
                value={shortDescTr}
                onChange={(e) => setShortDescTr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detaylı Rehber Metni (Türkçe)</label>
              <textarea
                rows={5}
                placeholder="Püf noktaları, hedef balıklar, kamış ve makine aksiyonu teknik detayları..."
                value={contentTr}
                onChange={(e) => setContentTr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <span>{editingId ? 'GÜNCELLE' : 'YENİ İÇERİK EKLE'}</span>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border border-slate-200 text-xs transition-all"
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Başlık veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400 font-semibold">İçerik bulunamadı.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                          {categoryLabel(article.category)}
                        </span>
                        {article.sub_category && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {subLabel(article.category, article.sub_category)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] truncate">{article.title_tr}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{article.short_desc_tr}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => startEdit(article)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
