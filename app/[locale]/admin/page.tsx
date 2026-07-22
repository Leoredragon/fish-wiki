'use client';

import { useState, useEffect } from 'react';
import { supabase, Fish } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  PlusCircle,
  List,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Fish as FishIcon,
  Layers,
  Sparkles,
  Eye,
  Trash2,
  Check,
  ShieldAlert,
  Info,
  FileText,
  Scale,
  Calendar
} from 'lucide-react';

export default function AdminPage() {
  const t = useTranslations('Admin');

  // Form State
  const [formData, setFormData] = useState<Partial<Fish>>({
    name_tr: '',
    name_en: '',
    scientific_name: '',
    water_type: 'Tatlı Su',
    short_info_tr: '',
    short_info_en: '',
    limit_size: '',
    ban_periods: '',
    active_seasons: '',
    recommended_gear: '',
    description_tr: '',
    description_en: '',
    image_url: '',
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fishes, setFishes] = useState<Fish[]>([]);

  useEffect(() => {
    loadFishes();
  }, []);

  const loadFishes = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('fishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFishes(data);
      }
    } catch {
      // ignore
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_tr || !formData.name_en) {
      setNotification({ type: 'error', message: 'Lütfen Türkçe ve İngilizce isim alanlarını doldurun.' });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const { error } = await supabase
        .from('fishes')
        .insert([
          {
            name_tr: formData.name_tr,
            name_en: formData.name_en,
            scientific_name: formData.scientific_name || null,
            water_type: formData.water_type || 'Tatlı Su',
            short_info_tr: formData.short_info_tr || null,
            short_info_en: formData.short_info_en || null,
            limit_size: formData.limit_size || null,
            ban_periods: formData.ban_periods || null,
            active_seasons: formData.active_seasons || null,
            recommended_gear: formData.recommended_gear || null,
            description_tr: formData.description_tr || null,
            description_en: formData.description_en || null,
            image_url: formData.image_url || null,
            is_active: formData.is_active ?? true
          }
        ]);

      if (error) {
        throw error;
      }

      setNotification({ type: 'success', message: t('success') });

      // Reset form
      setFormData({
        name_tr: '',
        name_en: '',
        scientific_name: '',
        water_type: 'Tatlı Su',
        short_info_tr: '',
        short_info_en: '',
        limit_size: '',
        ban_periods: '',
        active_seasons: '',
        recommended_gear: '',
        description_tr: '',
        description_en: '',
        image_url: '',
        is_active: true
      });
      loadFishes();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || t('error') });
    } finally {
      setLoading(false);
    }
  };

  const toggleFishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('fishes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (!error) {
        setFishes(prev =>
          prev.map(f => (f.id === id ? { ...f, is_active: !currentStatus } : f))
        );
      }
    } catch {
      // ignore
    }
  };

  const deleteFish = async (id: string) => {
    if (!confirm('Bu balığı silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('fishes')
        .delete()
        .eq('id', id);

      if (!error) {
        setFishes(prev => prev.filter(f => f.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">{t('title')}</h1>
          <p className="text-xs text-slate-500">{t('subtitle')}</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
          <FishIcon className="w-4 h-4 text-[#10B981]" />
          <span>Kayıtlı Türler: {fishes.length}</span>
        </div>
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

      {/* Form & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: 3 Logical Form Cards */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">

          {/* CARD 1: Temel Bilgiler */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Info className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-[#0F172A]">{t('sectionBasic')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('nameTr')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name_tr"
                  required
                  placeholder="Örn: Abant Alası"
                  value={formData.name_tr}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('nameEn')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name_en"
                  required
                  placeholder="Örn: Abant Trout"
                  value={formData.name_en}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('scientificName')}
                </label>
                <input
                  type="text"
                  name="scientific_name"
                  placeholder="Örn: Salmo abanticus"
                  value={formData.scientific_name || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 italic focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('waterType')}
                </label>
                <select
                  name="water_type"
                  value={formData.water_type || 'Tatlı Su'}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all font-medium"
                >
                  <option value="Tatlı Su">Tatlı Su (Nehir & Göl)</option>
                  <option value="Tuzlu Su">Tuzlu Su (Deniz)</option>
                  <option value="Acı Su">Acı Su (Nehir Ağzı)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('shortInfoTr')}
                </label>
                <input
                  type="text"
                  name="short_info_tr"
                  placeholder={t('shortInfoTrPlaceholder')}
                  value={formData.short_info_tr || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('shortInfoEn')}
                </label>
                <input
                  type="text"
                  name="short_info_en"
                  placeholder={t('shortInfoEnPlaceholder')}
                  value={formData.short_info_en || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: Avcılık Kuralları ve Taktikler */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-[#0F172A]">{t('sectionRules')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('limitSize')}
                </label>
                <input
                  type="text"
                  name="limit_size"
                  placeholder={t('limitPlaceholder')}
                  value={formData.limit_size || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('banPeriods')}
                </label>
                <input
                  type="text"
                  name="ban_periods"
                  placeholder={t('banPlaceholder')}
                  value={formData.ban_periods || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('activeSeasons')}
                </label>
                <input
                  type="text"
                  name="active_seasons"
                  placeholder={t('seasonPlaceholder')}
                  value={formData.active_seasons || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('recommendedGear')}
                </label>
                <input
                  type="text"
                  name="recommended_gear"
                  placeholder={t('gearPlaceholder')}
                  value={formData.recommended_gear || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: Detaylı Açıklama ve Medya */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-[#0F172A]">{t('sectionDetails')}</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('imageUrl')}
                </label>
                <input
                  type="url"
                  name="image_url"
                  placeholder={t('imageUrlPlaceholder')}
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('descriptionTr')}
                </label>
                <textarea
                  name="description_tr"
                  rows={3}
                  placeholder="Balığın biyolojik özellikleri, avlandığı derinlikler ve davranış yapısı..."
                  value={formData.description_tr || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('descriptionEn')}
                </label>
                <textarea
                  name="description_en"
                  rows={3}
                  placeholder="Detailed description, habitat info, and angling tactics in English..."
                  value={formData.description_en || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Is Active Switch */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#10B981] rounded border-slate-300 focus:ring-[#10B981] accent-[#10B981]"
                />
                <label htmlFor="is_active" className="font-semibold text-slate-700 cursor-pointer">
                  {t('isActive')}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#10B981]" />
                <span>{t('submitting')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>{t('submit')}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Side: Registered Species List (Card) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 flex flex-col h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <List className="w-5 h-5 text-[#0F172A]" />
              <h2 className="text-base font-bold text-[#0F172A]">{t('fishList')}</h2>
            </div>
            <button onClick={loadFishes} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
              Yenile
            </button>
          </div>

          {fetching ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
            </div>
          ) : fishes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Layers className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs font-medium">{t('noFishes')}</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[750px] pr-1 scrollbar-thin">
              {fishes.map(fish => (
                <div
                  key={fish.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between space-x-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{fish.name_tr}</h4>
                      <span className="text-[11px] text-slate-400 italic shrink-0">({fish.name_en})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {fish.water_type || 'Tatlı Su'} • {fish.limit_size || 'Limit Belirtilmedi'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => fish.id && toggleFishStatus(fish.id, !!fish.is_active)}
                      title="Durumu Değiştir"
                      className={`p-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        fish.is_active
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {fish.is_active ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {fish.id && (
                      <button
                        onClick={() => deleteFish(fish.id!)}
                        title="Sil"
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
