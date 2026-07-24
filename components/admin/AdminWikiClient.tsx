/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  BookOpen,
  Search,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Camera,
  X,
  Sparkles,
  FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { INITIAL_WIKI_ARTICLES } from '@/components/wiki/WikiClient';

export default function AdminWikiClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [articles, setArticles] = useState<any[]>(INITIAL_WIKI_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState('disciplines');
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [shortDescTr, setShortDescTr] = useState('');
  const [shortDescEn, setShortDescEn] = useState('');
  const [contentTr, setContentTr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [waterType, setWaterType] = useState('Tüm Sular');
  const [difficultyLevel, setDifficultyLevel] = useState('Başlangıç');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wiki_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Auto-cleanup duplicate rows by title_tr in database if any exist
        const seen = new Set<string>();
        const idsToDelete: string[] = [];
        const uniqueSupabaseData: any[] = [];

        for (const item of data) {
          const key = (item.title_tr || '').trim().toLowerCase();
          if (seen.has(key)) {
            if (item.id) idsToDelete.push(item.id);
          } else {
            seen.add(key);
            uniqueSupabaseData.push(item);
          }
        }

        if (idsToDelete.length > 0) {
          supabase.from('wiki_articles').delete().in('id', idsToDelete).then(() => {});
        }

        const supabaseTitles = new Set(uniqueSupabaseData.map((item: any) => (item.title_tr || '').trim().toLowerCase()));
        const remainingInitial = INITIAL_WIKI_ARTICLES.filter(
          (item: any) => !supabaseTitles.has((item.title_tr || '').trim().toLowerCase())
        );
        setArticles([...uniqueSupabaseData, ...remainingInitial]);
      } else {
        setArticles(INITIAL_WIKI_ARTICLES);
      }
    } catch {
      setArticles(INITIAL_WIKI_ARTICLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const resetForm = () => {
    setEditingId(null);
    setCategory('disciplines');
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
    setCategory(article.category || 'disciplines');
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

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `wiki/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        setNotification({ type: 'error', message: 'Fotoğraf yüklenemedi: ' + uploadError.message });
        setUploadingImage(false);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          setImageUrl(publicUrlData.publicUrl);
        }
        setUploadingImage(false);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Beklenmeyen hata: ' + (err.message || 'Bilinmiyor') });
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

    const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Check if an article with the same title_tr already exists in loaded articles
    const existingArticle = articles.find(
      (a) => (a.title_tr || '').trim().toLowerCase() === titleTr.trim().toLowerCase()
    );

    const targetId = editingId && isValidUUID(editingId)
      ? editingId
      : existingArticle && isValidUUID(existingArticle.id)
      ? existingArticle.id
      : null;

    try {
      const recordToSave = targetId ? { id: targetId, ...payload } : payload;
      const { error } = await supabase
        .from('wiki_articles')
        .upsert([recordToSave]);

      if (error) {
        throw error;
      }

      setNotification({ type: 'success', message: 'Wiki rehber içeriği ve görseli başarıyla güncellendi.' });
      resetForm();
      await loadArticles();
    } catch (err: any) {
      console.error('Wiki Save Error:', err);
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

  const filteredArticles = articles.filter(
    (a) =>
      (a.title_tr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.short_desc_tr || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Balıkçılık Akademi & Wiki Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {editingId ? 'Rehber İçeriğini Düzenle' : 'Wiki Rehber İçerikleri & Fotoğrafları'}
          </h1>
          <p className="text-xs text-slate-400">
            Stiller, yem çeşitleri, misinalar, rig montajları ve aksesuarlar için içerik ekleyin.
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

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between shadow-sm transition-all ${
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

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{editingId ? 'İçerik Düzenleme Formu' : 'Yeni Rehber İçeriği Oluştur'}</span>
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Seçin</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="disciplines">Stiller & Disiplinler (Spin, LRF, Surfcast vb.)</option>
                <option value="tackles">Kamış & Makine</option>
                <option value="lines">Misinalar & Liderler (İp, FC vb.)</option>
                <option value="lures">Sahte Yem Çeşitleri (Popper, Minnow, Silikon vb.)</option>
                <option value="rigs">Rig & Montajlar (Texas Rig, Drop Shot vb.)</option>
                <option value="accessories">Aksesuarlar & İğne Türleri</option>
              </select>
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

            {/* Photo Upload & Preview */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kapak Fotoğrafı / Görsel</label>

              {imageUrl && (
                <div className="mb-3 relative rounded-2xl overflow-hidden border border-slate-200 h-36">
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
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1 shrink-0 transition-all">
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>{uploadingImage ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
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

        {/* List Container */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wiki başlığı veya açıklamada ara..."
              className="w-full bg-transparent font-semibold text-slate-800 text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-4 max-h-[850px] overflow-y-auto pr-1">
            {filteredArticles.map((article) => {
              const isBeingEdited = editingId === article.id;
              return (
                <div
                  key={article.id}
                  className={`bg-white p-4 rounded-3xl border transition-all flex items-center justify-between space-x-4 ${
                    isBeingEdited
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {article.image_url ? (
                      <img src={article.image_url} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                        <BookOpen className="w-6 h-6 text-emerald-500" />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">{article.category}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">{article.title_tr}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{article.short_desc_tr}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => startEdit(article)}
                      className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
