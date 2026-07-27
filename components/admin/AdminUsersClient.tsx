/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Users,
  Search,
  ShieldCheck,
  Lock,
  Fish,
  MapPin,
  Calendar,
  ChevronRight,
  Package,
  Award,
  X,
  Loader2,
  RefreshCw,
  Crown,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useProStatus, isUserProSync } from '@/lib/useProStatus';

export default function AdminUsersClient() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const supabase = createClient();
  const { toggleUserProStatus } = useProStatus();
  const [, setTick] = useState(0);

  const handleUserProToggle = async (targetUser: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentPro = isUserProSync(targetUser.id) || Boolean(targetUser.is_premium);
    const newPro = !currentPro;

    await toggleUserProStatus(targetUser.id, newPro);

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, is_premium: newPro } : u))
    );
    if (selectedUserDetail && selectedUserDetail.id === targetUser.id) {
      setSelectedUserDetail((prev: any) => ({ ...prev, is_premium: newPro }));
    }
    setTick((t) => t + 1);
  };

  // Admin Auth PIN state (Secret PIN protection)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data state
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [catchesCount, setCatchesCount] = useState(0);
  const [tackleCount, setTackleCount] = useState(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('ALL');

  // Selected User Modal Detail state
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [userCatches, setUserCatches] = useState<any[]>([]);
  const [userTackleSets, setUserTackleSets] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    // Check if session pin is stored
    const storedPin = sessionStorage.getItem('oltapp_admin_unlocked');
    if (storedPin === 'true') {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, []);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret admin PIN is 1923 or admin
    if (pinInput.trim() === '1923' || pinInput.trim().toLowerCase() === 'admin') {
      sessionStorage.setItem('oltapp_admin_unlocked', 'true');
      setIsAuthenticated(true);
      setPinError(false);
      fetchAdminData();
    } else {
      setPinError(true);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);

    try {
      // 1. Fetch all profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch catch logs count per user
      const { data: catchesData } = await supabase
        .from('catch_logs')
        .select('id, user_id');

      // 3. Fetch tackle sets count per user
      const { data: tackleData } = await supabase
        .from('tackle_sets')
        .select('id, user_id');

      if (catchesData) setCatchesCount(catchesData.length);
      if (tackleData) setTackleCount(tackleData.length);

      if (profilesData) {
        // Map user profiles with catch counts & tackle counts
        const enrichedUsers = profilesData.map((prof: any) => {
          const userCatchCount = catchesData
            ? catchesData.filter((c: any) => c.user_id === prof.id).length
            : 0;
          const userTackleCount = tackleData
            ? tackleData.filter((t: any) => t.user_id === prof.id).length
            : 0;

          return {
            ...prof,
            catch_count: userCatchCount,
            tackle_count: userTackleCount
          };
        });

        setUsers(enrichedUsers);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUserDetail = async (userProf: any) => {
    setSelectedUserDetail(userProf);
    setLoadingDetail(true);

    try {
      // Fetch this user's catches
      const { data: catches } = await supabase
        .from('catch_logs')
        .select('*')
        .eq('user_id', userProf.id)
        .order('created_at', { ascending: false });

      // Fetch this user's tackle sets
      const { data: tackle } = await supabase
        .from('tackle_sets')
        .select('*')
        .eq('user_id', userProf.id);

      if (catches) setUserCatches(catches);
      if (tackle) setUserTackleSets(tackle);
    } catch {
      // ignore
    } finally {
      setLoadingDetail(false);
    }
  };

  // Filter users by search query and city
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCityFilter === 'ALL' || (u.city || '').toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesCity;
  });

  // Extract unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(users.map((u) => u.city).filter(Boolean)));

  // If not unlocked with Secret PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-center"
        >
          <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#0F172A]">
              {isTr ? 'Oltapp Yönetici Girişi' : 'Oltapp Admin Access'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {isTr ? 'Kullanıcı yönetim paneline erişmek için PIN kodunuzu girin.' : 'Enter Secret Admin PIN to access user dashboard.'}
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={10}
                required
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder={isTr ? 'Yönetici PIN Kodu (Örn: 1923)' : 'Admin PIN Code'}
                className="w-full text-center text-lg tracking-widest font-black bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {pinError && (
                <p className="text-xs text-red-500 font-bold mt-2">
                  {isTr ? 'Hatalı PIN kodu! Lütfen tekrar deneyin.' : 'Incorrect PIN code! Please try again.'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isTr ? 'Paneli Aç' : 'Unlock Dashboard'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Yönetim Paneli & Kullanıcı Dizini</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isTr ? 'Kayıtlı Balıkçı Listesi' : 'Registered Anglers Directory'}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {isTr ? 'Tüm kayıtlı kullanıcıları, av sayılarını ve profil detaylarını inceleyin.' : 'View all registered users and their activity stats.'}
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-white/15 flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isTr ? 'Yenile' : 'Refresh'}</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isTr ? 'Kayıtlı Üye' : 'Total Users'}</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{users.length}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isTr ? 'Toplam Av' : 'Total Catches'}</span>
            <Fish className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{catchesCount}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isTr ? 'Ekipman Seti' : 'Tackle Sets'}</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{tackleCount}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isTr ? 'Farklı Şehir' : 'Cities'}</span>
            <MapPin className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-[#0F172A]">{uniqueCities.length}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTr ? 'Ad soyad, kullanıcı adı veya şehir ile ara...' : 'Search by name, username or city...'}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Filter Dropdown */}
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">{isTr ? 'Tüm Şehirler' : 'All Cities'}</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                📍 {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List Container */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mr-3" />
          <span className="text-sm font-bold text-slate-500">{isTr ? 'Kullanıcı verileri yükleniyor...' : 'Loading users data...'}</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-2">
          <p className="font-bold text-base">{isTr ? 'Kullanıcı bulunamadı.' : 'No users found.'}</p>
          <p className="text-xs text-slate-400">{isTr ? 'Arama teriminizi veya filtrelerinizi sıfırlamayı deneyin.' : 'Try resetting your search query.'}</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                  <th className="py-4 px-6">Balıkçı</th>
                  <th className="py-4 px-6">Kullanıcı Adı</th>
                  <th className="py-4 px-6">Şehir</th>
                  <th className="py-4 px-6">Kayıt Tarihi</th>
                  <th className="py-4 px-6 text-center">PRO Üyelik</th>
                  <th className="py-4 px-6 text-center">Av Sayısı</th>
                  <th className="py-4 px-6 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-800">
                {filteredUsers.map((u) => {
                  const userPro = isUserProSync(u.id) || Boolean(u.is_premium);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                            {(u.full_name || u.username || 'B')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-extrabold text-[#0F172A]">{u.full_name || 'Balıkçı Üye'}</div>
                          <div className="text-xs text-slate-400 font-medium">ID: {u.id.substring(0, 8)}...</div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600 font-bold">
                        @{u.username || 'kullanici'}
                      </td>

                      <td className="py-4 px-6">
                        {u.city ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span>{u.city}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">- Belirtilmedi -</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {new Date(u.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={(e) => handleUserProToggle(u, e)}
                          title="PRO modunu aç/kapat"
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                            userPro
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <Crown className={`w-3.5 h-3.5 ${userPro ? 'fill-slate-950' : 'text-slate-400'}`} />
                          <span>{userPro ? 'PRO ⚡' : 'FREE 🔒'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-black text-xs">
                          <Fish className="w-3.5 h-3.5" />
                          <span>{u.catch_count} Av</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleOpenUserDetail(u)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                        >
                          Detay Gör
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredUsers.map((u) => {
              const userPro = isUserProSync(u.id) || Boolean(u.is_premium);
              return (
                <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base border border-emerald-200">
                          {(u.full_name || u.username || 'B')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-[#0F172A] text-base">{u.full_name || 'Balıkçı Üye'}</h3>
                        <p className="text-xs font-semibold text-emerald-600">@{u.username || 'kullanici'}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleUserProToggle(u, e)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                        userPro
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <Crown className={`w-3.5 h-3.5 ${userPro ? 'fill-slate-950' : 'text-slate-400'}`} />
                      <span>{userPro ? 'PRO ⚡' : 'FREE 🔒'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{u.city || 'Şehir Yok'}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Fish className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{u.catch_count} Av</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenUserDetail(u)}
                    className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center space-x-1 transition-all"
                  >
                    <span>Kullanıcı Detayları & Avları</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* USER DETAIL MODAL */}
      <AnimatePresence>
        {selectedUserDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 pb-16">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {selectedUserDetail.avatar_url ? (
                    <img src={selectedUserDetail.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-[#0F172A] font-black flex items-center justify-center text-lg">
                      {(selectedUserDetail.full_name || selectedUserDetail.username || 'B')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-extrabold">{selectedUserDetail.full_name || 'Balıkçı Üye'}</h2>
                    <p className="text-xs text-emerald-400 font-semibold">@{selectedUserDetail.username || 'kullanici'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* User Bio & Meta info */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Şehir:</span>
                    <span className="font-extrabold text-[#0F172A]">{selectedUserDetail.city || 'Belirtilmedi'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kayıt Tarihi:</span>
                    <span>{new Date(selectedUserDetail.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {selectedUserDetail.bio && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block mb-1">Biyografi:</span>
                      <p className="italic text-slate-800">{selectedUserDetail.bio}</p>
                    </div>
                  )}
                </div>

                {/* User PRO Status Switch Banner */}
                {(() => {
                  const modalUserPro = isUserProSync(selectedUserDetail.id) || Boolean(selectedUserDetail.is_premium);
                  return (
                    <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2.5">
                        <Crown className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="font-extrabold text-xs">
                            Kullanıcı PRO Üyelik Durumu: {modalUserPro ? 'PRO ⚡ (AÇIK)' : 'FREE 🔒 (KAPALI)'}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {modalUserPro ? 'Bu üye şu an tüm PRO alanlara erişebiliyor.' : 'Bu üye şu an ücretsiz mod kısıtlamalarını görüyor.'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUserProToggle(selectedUserDetail)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 ${
                          modalUserPro
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {modalUserPro ? 'FREE Yap 🔒' : 'PRO Yap ⚡'}
                      </button>
                    </div>
                  );
                })()}

                {/* User Catches */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center space-x-2">
                    <Fish className="w-4 h-4 text-emerald-500" />
                    <span>Balıkçının Av Kayıtları ({userCatches.length})</span>
                  </h3>

                  {loadingDetail ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-semibold">Avlar yükleniyor...</div>
                  ) : userCatches.length === 0 ? (
                    <div className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl text-center">Henüz kaydedilmiş av yok.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userCatches.map((c) => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-[#0F172A]">{c.location_note || 'Av Kaydı'}</span>
                            <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs font-bold text-emerald-700">
                            {c.weight && <span>⚖️ {c.weight} kg</span>}
                            {c.length && <span>📏 {c.length} cm</span>}
                          </div>
                          {c.lure_used && <p className="text-[11px] text-slate-500">Yem: {c.lure_used}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Tackle Sets */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center space-x-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>Malzeme Çantası ({userTackleSets.length})</span>
                  </h3>

                  {userTackleSets.length === 0 ? (
                    <div className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl text-center">Ekipman seti tanımlanmamış.</div>
                  ) : (
                    <div className="space-y-2">
                      {userTackleSets.map((t) => (
                        <div key={t.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <div className="font-extrabold text-[#0F172A]">{t.name}</div>
                          <div className="text-slate-600 text-[11px]">
                            {t.rod_name && <span>Kamış: {t.rod_name} | </span>}
                            {t.reel_name && <span>Makine: {t.reel_name}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
