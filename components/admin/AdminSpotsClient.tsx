/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  MapPin,
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
  Compass
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { compressImageToWebP } from '@/lib/image_compression';

export default function AdminSpotsClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();

  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [editingSpotId, setEditingSpotId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadSpots = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fishing_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSpots(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpots();
  }, [loadSpots]);

  const resetForm = () => {
    setEditingSpotId(null);
    setTitle('');
    setCreatorName('');
    setDescription('');
    setLat('');
    setLng('');
    setImageUrl('');
  };

  const startEditSpot = (spot: any) => {
    setEditingSpotId(spot.id);
    setTitle(spot.title || '');
    setCreatorName(spot.creator_name || '');
    setDescription(spot.description || '');
    setLat(spot.lat ? spot.lat.toString() : '');
    setLng(spot.lng ? spot.lng.toString() : '');
    setImageUrl(spot.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow selecting the same file again if needed
    e.target.value = '';

    setUploadingImage(true);
    try {
      const compressed = await compressImageToWebP(file, 1400, 0.82);
      const fileName = `spots/${Math.random().toString(36).substring(2)}_${Date.now()}.webp`;

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

      const { data: publicUrlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
        setNotification({ type: 'success', message: 'Görsel sıkıştırılarak yüklendi.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Beklenmeyen hata: ' + (err.message || 'Bilinmiyor') });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !lat || !lng) {
      setNotification({ type: 'error', message: 'Lütfen mera başlığını ve lat/lng koordinatlarını girin.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    const payload = {
      title: title.trim(),
      creator_name: creatorName.trim() || 'Oltapp Yönetimi',
      description: description.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      image_url: imageUrl.trim() || null
    };

    try {
      if (editingSpotId) {
        const { error } = await supabase
          .from('fishing_spots')
          .update(payload)
          .eq('id', editingSpotId);

        if (error) throw error;
        setNotification({ type: 'success', message: 'Mera bilgileri ve görseli başarıyla güncellendi.' });
      } else {
        const { error } = await supabase
          .from('fishing_spots')
          .insert([payload]);

        if (error) throw error;
        setNotification({ type: 'success', message: 'Yeni mera başarıyla eklendi.' });
      }

      resetForm();
      loadSpots();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Mera kaydedilirken hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpot = async (id: string) => {
    if (!confirm('Bu merayı silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('fishing_spots').delete().eq('id', id);
      if (!error) {
        setSpots((prev) => prev.filter((s) => s.id !== id));
        if (editingSpotId === id) resetForm();
        setNotification({ type: 'success', message: 'Mera başarıyla silindi.' });
      }
    } catch {
      // ignore
    }
  };

  const filteredSpots = spots.filter(
    (s) =>
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.creator_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Mera & Konum Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {editingSpotId ? 'Merayı Düzenle' : 'Mera Düzenleme & Fotoğraf Yönetimi'}
          </h1>
          <p className="text-xs text-slate-400">
            Haritadaki meraların fotoğraflarını, koordinatlarını ve detay açıklamalarını düzenleyin.
          </p>
        </div>

        {editingSpotId && (
          <button
            onClick={resetForm}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Yeni Mera Ekle Modu</span>
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
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>{editingSpotId ? 'Mera Bilgilerini Düzenle' : 'Yeni Mera Ekle'}</span>
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mera Adı / Başlık <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Sarayburnu Akıntı Burnu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ekleyen / Oluşturan İsim</label>
              <input
                type="text"
                placeholder="Örn: Kaptan Ahmet veya Oltapp Yönetimi"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enlem (Lat)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="41.0175"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Boylam (Lng)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="28.9833"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Photo Upload & Preview */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mera Fotoğrafı (URL veya Yükle)</label>
              
              {imageUrl && (
                <div className="mb-3 relative rounded-2xl overflow-hidden border border-slate-200 h-40 group">
                  <img src={imageUrl} alt="Mera önizleme" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
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
              <label className="block font-bold text-slate-700 mb-1">Mera Detaylı Açıklaması</label>
              <textarea
                rows={4}
                placeholder="Bu merada çıkan balık türleri, uygun takımlar ve avlanma zamanı bilgisi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <span>{editingSpotId ? 'Değişiklikleri Kaydet' : 'Merayı Sisteme Ekle'}</span>
              )}
            </button>

            {editingSpotId && (
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

        {/* Spots List Container */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mera başlığı veya açıklamada ara..."
              className="w-full bg-transparent font-semibold text-slate-800 text-sm focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mr-3" />
              <span className="text-sm font-bold text-slate-500">Meralar yükleniyor...</span>
            </div>
          ) : filteredSpots.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-2">
              <p className="font-bold text-base">Mera bulunamadı.</p>
              <p className="text-xs text-slate-400">Yeni mera eklemek için soldaki formu kullanın.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[850px] overflow-y-auto pr-1">
              {filteredSpots.map((spot) => {
                const isBeingEdited = editingSpotId === spot.id;
                return (
                  <div
                    key={spot.id}
                    className={`bg-white p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isBeingEdited
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {spot.image_url ? (
                        <img src={spot.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                          <MapPin className="w-6 h-6 text-emerald-500" />
                        </div>
                      )}

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-[#0F172A] text-sm truncate">{spot.title}</h3>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{spot.description}</p>
                        <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-400 pt-1">
                          <span className="flex items-center space-x-1 text-emerald-600">
                            <MapPin className="w-3 h-3" />
                            <span>{spot.lat?.toFixed(4)}, {spot.lng?.toFixed(4)}</span>
                          </span>
                          <span>• {spot.creator_name || 'Yönetim'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => startEditSpot(spot)}
                        title="Mera ve Görseli Düzenle"
                        className="px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSpot(spot.id)}
                        title="Merayı Sil"
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
