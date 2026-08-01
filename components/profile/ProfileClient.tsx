/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MapPin,
  Scale,
  Ruler,
  Camera,
  BarChart3,
  Package,
  BookOpen,
  User,
  Settings,
  ShieldCheck,
  Key,
  Upload,
  UserCheck,
  Loader2,
  Edit,
  Trash2,
  Star,
  ShoppingBag,
  CheckCircle2,
  X,
  PhoneCall,
  Tag,
  Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TackleBox from './TackleBox';
import CatchAnalyticsPanel from './CatchAnalyticsPanel';
import CatchCardExport from '../community/CatchCardExport';
import CatchFishPicker, { getSoftLegalMinCm, type FishOption } from '../CatchFishPicker';
import LanguageSwitcher from '../LanguageSwitcher';
import { compressImageToWebP } from '@/lib/image_compression';
import { formatMembershipLabel, getActivityBadge } from '@/lib/anglerTrust';
import { isNativeApp, pickPhotoNative } from '@/lib/capacitorUtils';

export default function ProfileClient({
  user,
  profile,
  initialCatches
}: {
  user: Record<string, any>;
  profile: Record<string, any>;
  initialCatches: Record<string, any>[];
}) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'stats' | 'log' | 'tackle' | 'settings' | 'favorites' | 'market'>('log');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteSpots, setFavoriteSpots] = useState<any[]>([]);
  const [highlightCatchId, setHighlightCatchId] = useState<string | null>(null);

  // User Marketplace Listings State
  const [userMarketItems, setUserMarketItems] = useState<any[]>([]);
  const [editingMarketItem, setEditingMarketItem] = useState<any | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemType, setEditItemType] = useState('Kamış');
  const [editItemCondition, setEditItemCondition] = useState('Az Kullanılmış');
  const [editItemCity, setEditItemCity] = useState('');
  const [editItemContact, setEditItemContact] = useState('');
  const [editItemIsSold, setEditItemIsSold] = useState(false);
  const [updatingMarketItem, setUpdatingMarketItem] = useState(false);

  // Profile Settings State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [city, setCity] = useState(profile?.city || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
  const [fishId, setFishId] = useState('');
  const [selectedFish, setSelectedFish] = useState<FishOption | null>(null);
  const [editFishId, setEditFishId] = useState('');

  // User Tackle Sets for the dropdown
  const [userTackleSets, setUserTackleSets] = useState<any[]>([]);

  useEffect(() => {
    fetchTackleSets();
    fetchFavoriteSpots();
    fetchUserMarketItems();
    fetchFollowStats();
  }, [user.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`profile-follows-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'follows' },
        (payload: any) => {
          const newRow = payload.new || {};
          const oldRow = payload.old || {};
          if (
            newRow.follower_id === user.id
            || newRow.following_id === user.id
            || oldRow.follower_id === user.id
            || oldRow.following_id === user.id
          ) {
            fetchFollowStats();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

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
        .select(`id, fishing_spots (*)`)
        .eq('user_id', user.id);
      if (data) {
        setFavoriteSpots(data.map((d: any) => d.fishing_spots).filter(Boolean));
      }
    } catch {}
  };

  const fetchUserMarketItems = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('community_marketplace_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setUserMarketItems(data);
    } catch {}
  };

  const fetchFollowStats = async () => {
    try {
      const supabase = createClient();
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id)
      ]);
      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch {}
  };

  const handleToggleSold = async (item: any) => {
    try {
      const supabase = createClient();
      const newStatus = !item.is_sold;
      const { error } = await supabase
        .from('community_marketplace_items')
        .update({ is_sold: newStatus })
        .eq('id', item.id);

      if (!error) {
        setUserMarketItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_sold: newStatus } : i))
        );
      } else {
        alert(isTr ? `Güncellenemedi: ${error.message}` : `Error: ${error.message}`);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    }
  };

  const openEditMarketItemModal = (item: any) => {
    setEditingMarketItem(item);
    setEditItemTitle(item.title || '');
    setEditItemDesc(item.description || '');
    setEditItemPrice(item.price ? String(item.price) : '');
    setEditItemType(item.item_type || 'Kamış');
    setEditItemCondition(item.condition || 'Az Kullanılmış');
    setEditItemCity(item.city || '');
    setEditItemContact(item.contact_info || '');
    setEditItemIsSold(!!item.is_sold);
  };

  const handleUpdateMarketItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarketItem) return;

    setUpdatingMarketItem(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('community_marketplace_items')
        .update({
          title: editItemTitle.trim(),
          description: editItemDesc.trim(),
          price: parseFloat(editItemPrice),
          item_type: editItemType,
          condition: editItemCondition,
          city: editItemCity.trim() || null,
          contact_info: editItemContact.trim() || null,
          is_sold: editItemIsSold
        })
        .eq('id', editingMarketItem.id);

      if (error) {
        alert(isTr ? `İlan güncellenemedi: ${error.message}` : `Failed: ${error.message}`);
      } else {
        alert(isTr ? '🎉 İlanınız başarıyla güncellendi!' : 'Listing updated!');
        setUserMarketItems((prev) =>
          prev.map((i) =>
            i.id === editingMarketItem.id
              ? {
                  ...i,
                  title: editItemTitle.trim(),
                  description: editItemDesc.trim(),
                  price: parseFloat(editItemPrice),
                  item_type: editItemType,
                  condition: editItemCondition,
                  city: editItemCity.trim() || null,
                  contact_info: editItemContact.trim() || null,
                  is_sold: editItemIsSold
                }
              : i
          )
        );
        setEditingMarketItem(null);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setUpdatingMarketItem(false);
    }
  };

  const handleDeleteMarketItem = async (itemId: string) => {
    if (!confirm(isTr ? 'Bu ilanı silmek istediğinize emin misiniz?' : 'Delete listing?')) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('community_marketplace_items').delete().eq('id', itemId);
      if (!error) {
        setUserMarketItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    } catch {}
  };

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
    if (!fishId) {
      alert(isTr ? 'Lütfen balık türünü seçin.' : 'Please select a fish species.');
      return;
    }

    const minCm = getSoftLegalMinCm(selectedFish);
    const lengthNum = length ? Number(length) : NaN;
    if (minCm != null && Number.isFinite(lengthNum) && lengthNum > 0 && lengthNum < minCm) {
      const ok = confirm(
        isTr
          ? `Boy (${lengthNum} cm) yasal asgari boydan (~${minCm} cm) küçük görünüyor. Yine de kaydetmek istiyor musunuz?`
          : `Length (${lengthNum} cm) looks below min size (~${minCm} cm). Save anyway?`
      );
      if (!ok) return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const compressedFile = await compressImageToWebP(imageFile, 1200, 0.8);
      // Same bucket/path as the community share flow; catch_photos uploads were
      // silently failing and the old base64 fallback bloated the catch_logs table.
      const filePath = `catches/${user.id}_${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, compressedFile, { contentType: 'image/webp', cacheControl: '31536000' });

      if (uploadError) {
        throw new Error(
          isTr
            ? `Fotoğraf yüklenemedi: ${uploadError.message}`
            : `Photo upload failed: ${uploadError.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(filePath);
      const imageUrl = publicUrlData.publicUrl;

      const formattedTackleId = (tackleBoxId && tackleBoxId.trim() !== '') ? tackleBoxId : null;

      const { error: insertError } = await supabase.from('catch_logs').insert({
        user_id: user.id,
        image_url: imageUrl,
        fish_id: fishId,
        weight: weight ? parseFloat(weight) : null,
        length: length ? parseFloat(length) : null,
        lure_used: lureUsed || null,
        location_note: locationNote || null,
        tackle_box_id: formattedTackleId
      });

      if (insertError) {
        alert(isTr ? `Av kaydedilemedi: ${insertError.message}` : `Catch record failed: ${insertError.message}`);
      } else {
        alert(isTr ? '🎉 Avınız başarıyla kaydedildi!' : 'Catch saved successfully!');
        setIsModalOpen(false);
        setImageFile(null);
        setWeight('');
        setLength('');
        setLureUsed('');
        setLocationNote('');
        setTackleBoxId('');
        setFishId('');
        setSelectedFish(null);
        router.refresh();
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatarFile = async (file: File) => {
    setAvatarUploading(true);
    try {
      const supabase = createClient();
      const compressedAvatar = await compressImageToWebP(file, 400, 0.85);
      const filePath = `avatars/${user.id}_${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, compressedAvatar, { contentType: 'image/webp', cacheControl: '31536000' });

      if (uploadError) {
        alert(isTr ? `Fotoğraf yüklenemedi: ${uploadError.message}` : `Upload error: ${uploadError.message}`);
      } else {
        const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
        if (data?.publicUrl) {
          const newUrl = data.publicUrl;
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await uploadAvatarFile(file);
  };

  // Native picker (Capacitor Camera) converts HEIC/HEIF to JPEG, unlike raw <input type="file">
  const handleAvatarPickNative = async () => {
    if (avatarUploading) return;
    const file = await pickPhotoNative('prompt');
    if (!file) return;
    await uploadAvatarFile(file);
  };

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

  const openEditCatchModal = (log: any) => {
    setEditingCatch(log);
    setEditLocationNote(log.location_note || '');
    setEditWeight(log.weight ? String(log.weight) : '');
    setEditLength(log.length ? String(log.length) : '');
    setEditLureUsed(log.lure_used || '');
    setEditTackleBoxId(log.tackle_box_id || '');
    setEditFishId(log.fish_id || '');
  };

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
          tackle_box_id: formattedTackleId,
          fish_id: editFishId || null,
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

  const totalCatches = initialCatches.length;

  useEffect(() => {
    if (activeTab !== 'log' || !highlightCatchId) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(`catch-card-${highlightCatchId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    const clearHighlight = window.setTimeout(() => setHighlightCatchId(null), 2600);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [activeTab, highlightCatchId]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-6 mobile-scroll-pad">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#0F172A] to-slate-800 flex items-center justify-center text-emerald-400 font-black text-3xl shadow-lg border-2 border-emerald-500 relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={username || 'Profile'} fill sizes="96px" className="object-cover rounded-full" />
            ) : (
              (fullName || username || user?.email)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          {isNativeApp() ? (
            <button
              type="button"
              onClick={handleAvatarPickNative}
              className="absolute bottom-0 right-0 bg-[#0F172A] hover:bg-slate-800 text-emerald-400 p-2 rounded-full cursor-pointer shadow-md transition-all border border-slate-700"
            >
              {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          ) : (
            <label className="absolute bottom-0 right-0 bg-[#0F172A] hover:bg-slate-800 text-emerald-400 p-2 rounded-full cursor-pointer shadow-md transition-all border border-slate-700">
              {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          )}
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {fullName || username || (isTr ? 'OltaApp Üyesi' : 'Angler')}
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
            <span className="bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              {followersCount} {isTr ? 'Takipçi' : 'Followers'}
            </span>
            <span className="bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              {followingCount} {isTr ? 'Takip' : 'Following'}
            </span>
            <span className="bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              {totalCatches} {isTr ? 'Av kaydı' : 'Catches'}
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100">
              {formatMembershipLabel(profile?.created_at || user?.created_at, isTr)}
            </span>
            <span className="flex items-center space-x-1 bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{getActivityBadge(totalCatches, isTr)}</span>
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
          <span>{isTr ? 'Avlarım' : 'My Catches'}</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'market' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>{isTr ? 'İkinci El İlanlarım' : 'My Listings'}</span>
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
                <span className="text-xs font-extrabold">{isTr ? 'Yeni Av Ekle' : 'Add Catch'}</span>
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
                  <div
                    key={log.id}
                    id={`catch-card-${log.id}`}
                    className={`bg-white rounded-3xl overflow-hidden border shadow-sm flex flex-col transition-all duration-500 ${
                      highlightCatchId === log.id
                        ? 'border-amber-400 ring-2 ring-amber-300/70 shadow-amber-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative group">
                      <Image src={log.image_url} alt="Catch" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <div className="font-bold text-[#0F172A] text-lg truncate">
                            {log.location_note || (isTr ? 'Bilinmeyen Mera' : 'Unknown Spot')}
                          </div>
                          {(log.fishes?.name_tr || log.fishes?.name_en) && (
                            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                              {isTr ? (log.fishes.name_tr || log.fishes.name_en) : (log.fishes.name_en || log.fishes.name_tr)}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
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

        {/* TAB: MY MARKETPLACE LISTINGS */}
        {activeTab === 'market' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>{isTr ? 'Yayındaki ve Satılan İkinci El İlanlarım' : 'My Marketplace Listings'}</span>
              </h2>

              <button
                onClick={() => router.push('/community')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>{isTr ? 'Yeni İlan Ver' : 'Sell Gear'}</span>
              </button>
            </div>

            {userMarketItems.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-600">{isTr ? 'Henüz hiçbir ekipman ilanı vermediniz.' : 'No listings posted yet.'}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">{isTr ? 'Kullanmadığınız olta, makine veya kamışları Topluluk Ekipman Pazarı sayfasından hemen satışa çıkarabilirsiniz.' : 'List your unused rods or reels for sale.'}</p>
                <button
                  onClick={() => router.push('/community')}
                  className="bg-[#0F172A] text-emerald-400 font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  {isTr ? 'Ekipman Pazarına Git' : 'Go to Marketplace'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userMarketItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                      item.is_sold ? 'border-slate-200 bg-slate-50/70 opacity-80' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {item.image_url ? (
                        <div className="relative aspect-[4/3] bg-slate-100 w-full overflow-hidden">
                          <Image src={item.image_url} alt={item.title} fill sizes="50vw" className="object-cover" />
                          <div className="absolute top-3 right-3 bg-[#0F172A] text-emerald-400 font-black text-xs px-3 py-1 rounded-xl shadow-md">
                            {item.price} {item.currency || 'TL'}
                          </div>
                          {item.is_sold ? (
                            <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md">
                              SATILDI
                            </div>
                          ) : (
                            <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md">
                              YAYINDA
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {item.is_sold ? (
                              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">SATILDI</span>
                            ) : (
                              <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">YAYINDA</span>
                            )}
                            <span className="text-xs font-bold text-slate-500">{item.item_type}</span>
                          </div>
                          <span className="text-sm font-black text-emerald-600">{item.price} TL</span>
                        </div>
                      )}

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                          <span>{item.condition}</span>
                          {item.city && <span>📍 {item.city}</span>}
                        </div>
                        <h3 className="font-extrabold text-sm text-[#0F172A] leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-slate-100 space-y-2">
                      {item.contact_info && (
                        <div className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.contact_info}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleToggleSold(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                            item.is_sold
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.is_sold ? (isTr ? 'Tekrar Satışa Çıkar' : 'Mark Active') : (isTr ? 'Satıldı İşaretle' : 'Mark Sold')}</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditMarketItemModal(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
                            title={isTr ? 'İlanı Düzenle' : 'Edit Listing'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMarketItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                            title={isTr ? 'İlanı Sil' : 'Delete Listing'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CatchAnalyticsPanel catches={initialCatches} isTr={isTr} />
          </motion.div>
        )}

        {activeTab === 'tackle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TackleBox userId={user.id} />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
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
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Kullanıcı Adı' : 'Username'}</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Örn: İstanbul, Marmara"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">{isTr ? 'Profil Fotoğrafı URL' : 'Avatar URL'}</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
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
                    onChange={(e) => setBio(e.target.value)}
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

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">{isTr ? 'Görüntüleme Dili' : 'Display Language'}</h3>
                  <p className="text-xs text-slate-500">
                    {isTr
                      ? 'Uygulama arayüzünün dilini buradan değiştirebilirsiniz.'
                      : 'Change the language used across the app interface.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">
                  {isTr ? 'Aktif dil' : 'Active language'}
                </span>
                <LanguageSwitcher />
              </div>
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
                {favoriteSpots.map((spot) => (
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

      {/* ADD CATCH MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'Yeni Av Ekle' : 'Add New Catch'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddCatch} className="space-y-4 text-xs font-medium max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Av Fotoğrafı *' : 'Catch Photo *'}</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700" required />
                </div>

                <CatchFishPicker
                  value={fishId}
                  lengthCm={length}
                  isTr={isTr}
                  required
                  onChange={(id, fish) => {
                    setFishId(id);
                    setSelectedFish(fish);
                  }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ağırlık (kg)' : 'Weight (kg)'}</label>
                    <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Örn: 2.5" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Boy (cm)' : 'Length (cm)'}</label>
                    <input type="number" step="1" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Örn: 45" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Mera / Konum Notu *' : 'Location / Spot Note *'}</label>
                  <input type="text" value={locationNote} onChange={(e) => setLocationNote(e.target.value)} placeholder={isTr ? 'Örn: Sarayburnu Kıyısı' : 'Spot location...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Kullanılan Yem / Takım' : 'Lure / Tackle Used'}</label>
                  <input type="text" value={lureUsed} onChange={(e) => setLureUsed(e.target.value)} placeholder={isTr ? 'Örn: LRF 5g Jighead + Silikon' : 'Lure used...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                </div>

                <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                  <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : (isTr ? 'Avı Kaydet' : 'Save Catch')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MARKET ITEM MODAL */}
      {editingMarketItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'İkinci El İlanını Düzenle' : 'Edit Listing'}</h3>
              <button onClick={() => setEditingMarketItem(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpdateMarketItem} className="space-y-3 text-xs font-medium max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Tür' : 'Type'}</label>
                  <select value={editItemType} onChange={(e) => setEditItemType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                    <option value="Kamış">Kamış</option>
                    <option value="Makine">Makine</option>
                    <option value="Sahte Yem">Sahte Yem</option>
                    <option value="Misina/Aksesuar">Misina/Aksesuar</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Durumu' : 'Condition'}</label>
                  <select value={editItemCondition} onChange={(e) => setEditItemCondition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                    <option value="Sıfır">Sıfır</option>
                    <option value="Çok İyi">Çok İyi</option>
                    <option value="Az Kullanılmış">Az Kullanılmış</option>
                    <option value="Yıpranmış">Yıpranmış</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ürün Adı / Başlık' : 'Title'}</label>
                <input type="text" value={editItemTitle} onChange={(e) => setEditItemTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Fiyat (TL)' : 'Price'}</label>
                  <input type="number" value={editItemPrice} onChange={(e) => setEditItemPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Şehir' : 'City'}</label>
                  <input type="text" value={editItemCity} onChange={(e) => setEditItemCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{isTr ? 'İletişim / Tel veya Instagram' : 'Contact Info'}</label>
                <input type="text" value={editItemContact} onChange={(e) => setEditItemContact(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Açıklama' : 'Description'}</label>
                <textarea rows={3} value={editItemDesc} onChange={(e) => setEditItemDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <input type="checkbox" id="is_sold_checkbox" checked={editItemIsSold} onChange={(e) => setEditItemIsSold(e.target.checked)} className="w-4 h-4 accent-rose-500 rounded" />
                <label htmlFor="is_sold_checkbox" className="text-xs font-bold text-slate-700">{isTr ? 'Ürün Satıldı Olarak İşaretlensin' : 'Mark as Sold'}</label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setEditingMarketItem(null)} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                <button type="submit" disabled={updatingMarketItem} className="px-5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{updatingMarketItem ? <Loader2 className="w-4 h-4 animate-spin" /> : (isTr ? 'Kaydet' : 'Save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
