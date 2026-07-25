/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Plus, MapPin, Scale, Ruler, Camera, BarChart3, Package, BookOpen, User, Settings, ShieldCheck, Key, Upload, UserCheck, Loader2, Edit, Trash2, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TackleBox from './TackleBox';
import CatchCardExport from '../community/CatchCardExport';
import { getLegalMinSize } from '@/lib/fish_regulations';

export default function ProfileClient({ user, profile, initialCatches }: { user: Record<string, any>; profile: Record<string, any>; initialCatches: Record<string, any>[] }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'stats' | 'log' | 'tackle' | 'settings' | 'favorites'>('log');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteSpots, setFavoriteSpots] = useState<any[]>([]);
  
  // Profile Settings State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [city, setCity] = useState(profile?.city || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Catch Edit State
  const [editingCatch, setEditingCatch] = useState<any | null>(null);
  const [editLocationNote, setEditLocationNote] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editLength, setEditLength] = useState('');
  const [editLureUsed, setEditLureUsed] = useState('');
  const [editTackleBoxId, setEditTackleBoxId] = useState('');
  const [updatingCatch, setUpdatingCatch] = useState(false);

  // Form State for Catch Log
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [lureUsed, setLureUsed] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [tackleBoxId, setTackleBoxId] = useState<string>('');
  
  // User Tackle Sets for the dropdown
  const [userTackleSets, setUserTackleSets] = useState<any[]>([]);

  useEffect(() => {
    // Fetch tackle sets for the dropdown
    const fetchTackleSets = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tackle_sets').select('id, name').eq('user_id', user.id);
      if (data) setUserTackleSets(data);
    };

    const fetchFavoriteSpots = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('favorite_spots')
          .select(`
            id,
            fishing_spots (*)
          `)
          .eq('user_id', user.id);
        if (data) {
          setFavoriteSpots(data.map((d: any) => d.fishing_spots).filter(Boolean));
        }
      } catch {}
    };

    fetchTackleSets();
    fetchFavoriteSpots();
  }, [user.id]);

  const handleAddCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(isTr ? 'Giriş yapmış olmanız gerekmektedir.' : 'You must be logged in.');
      return;
    }
    if (!imageFile) {
      alert(isTr ? 'Lütfen bir av fotoğrafı seçin.' : 'Please select a catch photo.');
      return;
    }
    
    setLoading(true);

    try {
      const supabase = createClient();
      
      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        alert(isTr 
          ? `Fotoğraf yüklenemedi!\n\nHata: ${uploadError.message}\n\nLütfen Supabase panelinizde 'user_uploads' depolama alanının (Storage Bucket) açık ve yetkilendirilmiş olduğundan emin olun.` 
          : `Failed to upload image: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      const formattedTackleBoxId = (tackleBoxId && tackleBoxId.trim() !== '') ? tackleBoxId : null;

      // 2. Insert Record
      const { error: insertError } = await supabase
        .from('catch_logs')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          weight: weight ? parseFloat(weight) : null,
          length: length ? parseFloat(length) : null,
          lure_used: lureUsed || null,
          location_note: locationNote || null,
          tackle_box_id: formattedTackleBoxId
        });

      if (insertError) {
        console.error('Catch Log Insert Error:', insertError);
        const isFkeyError = insertError.message?.includes('foreign key constraint') || insertError.message?.includes('catch_logs_tackle_box_id_fkey');
        
        if (isFkeyError) {
          alert(isTr 
            ? `Av kaydı veritabanına eklenemedi!\n\nHata (İlişkisel Veri Bağlantısı): ${insertError.message}\n\nÇözüm: Supabase panelinizdeki SQL Editor alanında 'complete_database_setup.sql' dosyasını çalıştırarak veritabanı bağlantı yetkilerini güncelleyin.` 
            : `Foreign Key Error: Please run complete_database_setup.sql in Supabase SQL Editor.`);
        } else {
          alert(isTr 
            ? `Av kaydı veritabanına eklenemedi!\n\nHata: ${insertError.message}\n\nEğer tablo henüz oluşmadıysa lütfen Supabase panelinizde SQL kodunu çalıştırın.` 
            : `Database error: ${insertError.message}`);
        }
      } else {
        alert(isTr ? '🎉 Av kaydı başarıyla günlüğe eklendi!' : 'Catch log saved successfully!');
        setIsModalOpen(false);
        // Reset form
        setImageFile(null);
        setWeight('');
        setLength('');
        setLureUsed('');
        setLocationNote('');
        setTackleBoxId('');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      alert(isTr ? `Beklenmeyen bir hata oluştu: ${err?.message || err}` : `An error occurred: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        alert(isTr ? `Avatar yüklenemedi: ${uploadError.message}` : `Avatar upload failed: ${uploadError.message}`);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(fileName);
        
        if (publicUrlData?.publicUrl) {
          const newUrl = publicUrlData.publicUrl;
          setAvatarUrl(newUrl);
          await supabase
            .from('profiles')
            .update({ avatar_url: newUrl })
            .eq('id', user.id);
          
          alert(isTr ? '🎉 Profil fotoğrafınız başarıyla güncellendi!' : 'Profile picture updated successfully!');
          router.refresh();
        }
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          username: username.trim(),
          bio: bio.trim(),
          city: city.trim(),
          avatar_url: avatarUrl
        })
        .eq('id', user.id);

      if (error) {
        alert(isTr ? `Profil güncellenemedi: ${error.message}` : `Failed to update profile: ${error.message}`);
      } else {
        alert(isTr ? '🎉 Profil bilgileriniz başarıyla kaydedildi!' : 'Profile info updated successfully!');
        router.refresh();
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Change Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert(isTr ? 'Şifre en az 6 karakter olmalıdır.' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(isTr ? 'Şifreler birbiriyle eşleşmiyor!' : 'Passwords do not match!');
      return;
    }

    setUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        alert(isTr ? `Şifre değiştirilemedi: ${error.message}` : `Password update failed: ${error.message}`);
      } else {
        alert(isTr ? '🔒 Şifreniz başarıyla değiştirildi!' : 'Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Open Edit Catch Modal
  const openEditCatchModal = (log: any) => {
    setEditingCatch(log);
    setEditLocationNote(log.location_note || '');
    setEditWeight(log.weight ? String(log.weight) : '');
    setEditLength(log.length ? String(log.length) : '');
    setEditLureUsed(log.lure_used || '');
    setEditTackleBoxId(log.tackle_box_id || '');
  };

  // Update Catch Handler
  const handleUpdateCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatch) return;

    setUpdatingCatch(true);
    try {
      const supabase = createClient();
      const formattedTackleId = (editTackleBoxId && editTackleBoxId.trim() !== '') ? editTackleBoxId : null;

      const { error } = await supabase
        .from('catch_logs')
        .update({
          location_note: editLocationNote.trim(),
          weight: editWeight ? parseFloat(editWeight) : null,
          length: editLength ? parseFloat(editLength) : null,
          lure_used: editLureUsed || null,
          tackle_box_id: formattedTackleId
        })
        .eq('id', editingCatch.id);

      if (error) {
        alert(isTr ? `Av kaydı güncellenemedi: ${error.message}` : `Failed to update catch: ${error.message}`);
      } else {
        alert(isTr ? '🎉 Av kaydınız başarıyla güncellendi!' : 'Catch log updated successfully!');
        setEditingCatch(null);
        router.refresh();
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setUpdatingCatch(false);
    }
  };

  // Delete Catch Handler
  const handleDeleteCatch = async (logId: string) => {
    if (!confirm(isTr ? 'Bu av kaydını silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this catch log?')) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('catch_logs').delete().eq('id', logId);

      if (error) {
        alert(isTr ? `Av kaydı silinemedi: ${error.message}` : `Failed to delete catch log: ${error.message}`);
      } else {
        alert(isTr ? '🗑️ Av kaydı başarıyla silindi.' : 'Catch log deleted.');
        router.refresh();
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    }
  };

  // Stats Calculations
  const totalCatches = initialCatches.length;
  const biggestCatch = initialCatches.reduce((max, log) => (log.weight > (max.weight || 0) ? log : max), initialCatches[0] || null);
  const totalWeight = initialCatches.reduce((sum, log) => sum + (log.weight || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-6">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-emerald-400 font-black text-3xl shadow-lg border-2 border-emerald-500/20">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={username || 'Profile'} fill sizes="96px" className="object-cover" />
            ) : (
              (fullName || username || user?.email)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-[#0F172A] hover:bg-slate-800 text-emerald-400 p-2 rounded-full cursor-pointer shadow-md transition-all border border-slate-700">
            {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {fullName || username || (isTr ? 'Oltapp Üyesi' : 'Angler')}
            </h1>
            {username && (
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 inline-block w-max mx-auto sm:mx-0">
                @{username}
              </span>
            )}
          </div>

          {bio && <p className="text-xs text-slate-600 font-medium max-w-xl leading-relaxed">{bio}</p>}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs font-semibold text-slate-500">
            {city && (
              <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                <MapPin className="w-3.5 h-3.5" />
                <span>{city}</span>
              </span>
            )}
            <span className="flex items-center space-x-1 bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
              Oltapp Pro
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 no-scrollbar">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'log' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isTr ? 'Av Güncesi' : 'Catch Log'}</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'stats' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isTr ? 'İstatistikler' : 'Stats'}</span>
        </button>

        <button
          onClick={() => setActiveTab('tackle')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'tackle' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isTr ? 'Malzeme Çantası' : 'Tackle Box'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{isTr ? 'Profil Ayarları' : 'Settings'}</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'favorites' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{isTr ? 'Favori Meralarım' : 'Favorite Spots'}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'log' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Son Avlarım' : 'Recent Catches'}</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{isTr ? 'Yeni Av Ekle' : 'Add Catch'}</span>
              </button>
            </div>

            {initialCatches.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Henüz hiç av eklenmemiş.' : 'No catches added yet.'}</h3>
                <p className="text-sm text-slate-500 mt-2">{isTr ? 'İlk avınızı ekleyerek dijital livarınızı oluşturun.' : 'Add your first catch to build your log.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCatches.map((log: Record<string, any>) => (
                  <div key={log.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                    <div className="aspect-[4/3] bg-slate-100 relative group">
                      <Image src={log.image_url} alt="Catch" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
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
                          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Scale className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{log.weight} kg</span>
                          </div>
                        )}
                        {log.length && (
                          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Ruler className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{log.length} cm</span>
                          </div>
                        )}
                      </div>

                      {(log.lure_used || log.tackle_box_id) && (
                        <div className="pt-2 border-t border-slate-100 text-xs">
                          {log.tackle_box_id ? (
                            <div className="flex items-center space-x-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md inline-block">
                              <Package className="w-3 h-3" />
                              <span>{isTr ? 'Kayıtlı Ekipman Kullanıldı' : 'Saved Gear Used'}</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-slate-400 font-semibold uppercase">{isTr ? 'Kullanılan Takım/Yem:' : 'Lure/Bait:'}</span>
                              <span className="ml-1 text-slate-700 font-bold">{log.lure_used}</span>
                            </>
                          )}
                        </div>
                      )}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditCatchModal(log)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title={isTr ? 'Avı Düzenle' : 'Edit Catch'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCatch(log.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title={isTr ? 'Avı Sil' : 'Delete Catch'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <CatchCardExport log={log} profileName={profile?.username || 'Oltapp User'} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A]">{isTr ? 'Kişisel İstatistikler' : 'Personal Stats'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam Av Sayısı' : 'Total Catches'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{totalCatches}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-2">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'En Büyük Trofe' : 'Biggest Trophy'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{biggestCatch?.weight ? `${biggestCatch.weight} kg` : '-'}</div>
                <div className="text-xs font-semibold text-slate-500">{biggestCatch?.location_note}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-2">
                  <Ruler className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{isTr ? 'Toplam Ağırlık' : 'Total Weight'}</div>
                <div className="text-4xl font-black text-[#0F172A]">{totalWeight.toFixed(1)} kg</div>
              </div>

            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Species Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <span className="text-lg">🐟</span>
                  <span>{isTr ? 'Avlanan Balık Türleri Dağılımı' : 'Species Breakdown'}</span>
                </h3>
                {initialCatches.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Henüz veritabanında av bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const counts: Record<string, number> = {};
                      initialCatches.forEach(c => {
                        const species = c.lure_used || c.location_note || 'Diğer';
                        counts[species] = (counts[species] || 0) + 1;
                      });
                      return Object.entries(counts).map(([name, count]) => {
                        const pct = Math.round((count / initialCatches.length) * 100);
                        return (
                          <div key={name} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>{name}</span>
                              <span className="text-emerald-600">{count} adet (%{pct})</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>

              {/* Luckiest Set & Gear Efficiency */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <span className="text-lg">🎣</span>
                  <span>{isTr ? 'En Verimli Ekipman Seti' : 'Most Efficient Gear Set'}</span>
                </h3>
                {userTackleSets.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Henüz kayıtlı setiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {userTackleSets.slice(0, 3).map((set, idx) => (
                      <div key={set.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-[#0F172A]">{set.name}</h4>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">En Verimli Kombinasyon</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tackle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TackleBox userId={user.id} />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Profil Bilgileri Formu */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">{isTr ? 'Profil Bilgilerini Düzenle' : 'Edit Profile Information'}</h3>
                  <p className="text-xs text-slate-500">{isTr ? 'Profilinizde görünecek kişisel bilgileri güncelleyin.' : 'Update personal information shown on your profile.'}</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Ad Soyad' : 'Full Name'}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Kullanıcı Adı' : 'Username'}</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Örn: ahmet_balikci"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Şehir / Av Bölgesi' : 'City / Location'}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Örn: İstanbul, Marmara"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Profil Fotoğrafı URL' : 'Avatar URL'}</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={e => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Biyografi & Av Tarzı' : 'Bio & Fishing Style'}</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Örn: 10 yıldır Boğaz'da kurşun arkası ve spin avcılığı yapıyorum."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 flex items-center space-x-2 text-sm"
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{isTr ? 'Değişiklikleri Kaydet' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Şifre Değiştirme Formu */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">{isTr ? 'Şifre Değiştir' : 'Change Password'}</h3>
                  <p className="text-xs text-slate-500">{isTr ? 'Hesap güvenliğinizi sağlamak için şifrenizi güncelleyin.' : 'Update your password to keep account secure.'}</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Yeni Şifre' : 'New Password'}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Yeni Şifre (Tekrar)' : 'Confirm New Password'}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 flex items-center space-x-2 text-sm"
                  >
                    {updatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{isTr ? 'Şifreyi Güncelle' : 'Update Password'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>{isTr ? 'Favori Meralarım' : 'Favorite Spots'}</span>
              </h2>
              <button
                onClick={() => router.push('/map')}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                {isTr ? 'Haritada Tümünü Gör' : 'View All on Map'}
              </button>
            </div>

            {favoriteSpots.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-3">
                <p className="font-bold text-sm">{isTr ? 'Henüz favori mera eklemediniz.' : 'No favorite spots saved yet.'}</p>
                <p className="text-xs max-w-sm mx-auto">{isTr ? 'Haritadaki meraları inceleyin ve yıldız butonuna basarak favorilerinize kaydedin.' : 'Browse spots on map and click star icon to save here.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteSpots.map(spot => (
                  <div key={spot.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">📍 Mera</span>
                        <span className="text-[11px] font-semibold text-slate-400">Oluşturan: {spot.creator_name || 'Balıkçı'}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#0F172A]">{spot.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{spot.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => router.push('/map')}
                        className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
                      >
                        {isTr ? 'Haritada Git' : 'Go to Map'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Catch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto pt-20 pb-20">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-xl font-extrabold text-[#0F172A]">{isTr ? 'Yeni Av Günlüğü' : 'New Catch Log'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddCatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Av Fotoğrafı' : 'Catch Photo'} *</label>
                <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors w-full">
                  <Camera className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">{imageFile ? imageFile.name : (isTr ? 'Fotoğraf Seç' : 'Choose Photo')}</span>
                  <input type="file" accept="image/*" required onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
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

              {/* Legal Size Limit Warning check */}
              {length && lureUsed && (() => {
                const minSize = getLegalMinSize(lureUsed);
                if (minSize && parseFloat(length) < minSize) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold flex items-center space-x-2">
                      <span className="text-base">⚠️</span>
                      <span>{lureUsed} için yasal avlanma alt sınırı min. <strong>{minSize} cm</strong>&apos;dir (Sirküler No: 5/2). Sürdürülebilir balıkçılık için lütfen küçük balıkları suya iade edelim!</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Mera / Konum' : 'Location'}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={locationNote} onChange={e=>setLocationNote(e.target.value)} placeholder={isTr ? 'Örn: İstanbul Boğazı' : 'e.g. Bosphorus'} className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-700 flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>{isTr ? 'Kullanılan Ekipman' : 'Gear Used'}</span>
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Setlerinizden Seçin' : 'Select from Your Sets'}</label>
                  <select 
                    value={tackleBoxId} 
                    onChange={e => setTackleBoxId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
                  >
                    <option value="">{isTr ? '-- Set Seçilmedi --' : '-- None --'}</option>
                    {userTackleSets.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">{isTr ? 'veya' : 'or'}</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Manuel Yazın (Yem / Sahte)' : 'Enter Manually (Lure / Bait)'}</label>
                  <input type="text" value={lureUsed} onChange={e=>setLureUsed(e.target.value)} placeholder={isTr ? 'Örn: 10g Kaşık' : 'e.g. 10g Spoon'} disabled={!!tackleBoxId} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 w-full sm:w-auto">
                  {loading ? (isTr ? 'Yükleniyor...' : 'Uploading...') : (isTr ? 'Günlüğe Kaydet' : 'Save to Log')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Catch Modal */}
      {editingCatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto pt-20 pb-20">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-xl font-extrabold text-[#0F172A]">{isTr ? 'Av Kaydını Düzenle' : 'Edit Catch Log'}</h2>
              <button onClick={() => setEditingCatch(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleUpdateCatch} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Ağırlık (kg)' : 'Weight (kg)'}</label>
                  <input type="number" step="0.1" value={editWeight} onChange={e=>setEditWeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Uzunluk (cm)' : 'Length (cm)'}</label>
                  <input type="number" step="0.1" value={editLength} onChange={e=>setEditLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Mera / Konum' : 'Location'}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={editLocationNote} onChange={e=>setEditLocationNote(e.target.value)} placeholder={isTr ? 'Örn: İstanbul Boğazı' : 'e.g. Bosphorus'} className="w-full pl-9 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-700 flex items-center space-x-1.5">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>{isTr ? 'Kullanılan Ekipman' : 'Gear Used'}</span>
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Setlerinizden Seçin' : 'Select from Your Sets'}</label>
                  <select 
                    value={editTackleBoxId} 
                    onChange={e => setEditTackleBoxId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-700"
                  >
                    <option value="">{isTr ? '-- Set Seçilmedi --' : '-- None --'}</option>
                    {userTackleSets.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">{isTr ? 'veya' : 'or'}</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Manuel Yazın (Yem / Sahte)' : 'Enter Manually (Lure / Bait)'}</label>
                  <input type="text" value={editLureUsed} onChange={e=>setEditLureUsed(e.target.value)} placeholder={isTr ? 'Örn: 10g Kaşık' : 'e.g. 10g Spoon'} disabled={!!editTackleBoxId} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-medium disabled:opacity-50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingCatch(null)} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs">
                  {isTr ? 'İptal' : 'Cancel'}
                </button>
                <button type="submit" disabled={updatingCatch} className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-70 text-xs flex items-center space-x-2">
                  {updatingCatch ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <span>{isTr ? 'Güncelle' : 'Update'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
