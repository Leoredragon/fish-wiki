'use client';

import { useState } from 'react';
import { Users, Fish, MapPin, BookOpen, Crown, ToggleLeft, ToggleRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import AdminUsersClient from './AdminUsersClient';
import AdminFishClient from './AdminFishClient';
import AdminSpotsClient from './AdminSpotsClient';
import AdminWikiClient from './AdminWikiClient';
import { useProStatus } from '@/lib/useProStatus';

export default function AdminDashboard() {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const { isPro, toggleProMode } = useProStatus();
  const [toggling, setToggling] = useState(false);

  const [activeTab, setActiveTab] = useState<'users' | 'fishes' | 'spots' | 'wiki'>('users');

  const handleToggle = async () => {
    setToggling(true);
    await toggleProMode(!isPro);
    setToggling(false);
  };

  return (
    <div className="space-y-6">
      {/* PRO SIMULATION TOGGLE BANNER */}
      <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-base sm:text-lg">
                {isTr ? 'PRO Modu Simülasyonu' : 'PRO Mode Simulation'}
              </h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${isPro ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                {isPro ? 'PRO AKTİF ⚡' : 'FREE MOD 🔒'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isTr
                ? 'Bu switch AÇIK olduğunda hesabınız PRO gibi davranır. KAPALI olduğunda tüm kilitleri FREE kullanıcı gözünden test edersiniz.'
                : 'Toggle ON to test as PRO user, OFF to test glassmorphism locks as FREE user.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-xs transition-all shadow-md active:scale-95 shrink-0 cursor-pointer ${
            isPro
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {isPro ? (
            <>
              <ToggleRight className="w-5 h-5 fill-slate-950" />
              <span>{isTr ? 'PRO MOD: AÇIK' : 'PRO MODE: ON'}</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-slate-400" />
              <span>{isTr ? 'PRO MOD: KAPALI (FREE)' : 'PRO MODE: OFF (FREE)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Top Admin Sub-Navigation Tabs */}
      <div className="bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto flex flex-wrap sm:flex-nowrap gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all min-w-[120px] ${
            activeTab === 'users'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{isTr ? 'Kullanıcılar' : 'Users'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fishes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all min-w-[120px] ${
            activeTab === 'fishes'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Fish className="w-4 h-4 text-cyan-400" />
          <span>{isTr ? 'Balık & Markalar' : 'Fish & Brands'}</span>
        </button>

        <button
          onClick={() => setActiveTab('spots')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all min-w-[120px] ${
            activeTab === 'spots'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>{isTr ? 'Meralar' : 'Spots'}</span>
        </button>

        <button
          onClick={() => setActiveTab('wiki')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all min-w-[120px] ${
            activeTab === 'wiki'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>{isTr ? 'Wiki Rehberi' : 'Wiki Admin'}</span>
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'users' && <AdminUsersClient />}
      {activeTab === 'fishes' && <AdminFishClient />}
      {activeTab === 'spots' && <AdminSpotsClient />}
      {activeTab === 'wiki' && <AdminWikiClient />}
    </div>
  );
}
