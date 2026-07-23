'use client';

import { useState } from 'react';
import { Users, Fish, MapPin } from 'lucide-react';
import { useLocale } from 'next-intl';
import AdminUsersClient from './AdminUsersClient';
import AdminFishClient from './AdminFishClient';
import AdminSpotsClient from './AdminSpotsClient';

export default function AdminDashboard() {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const [activeTab, setActiveTab] = useState<'users' | 'fishes' | 'spots'>('users');

  return (
    <div className="space-y-6">
      {/* Top Admin Sub-Navigation Tabs */}
      <div className="bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto flex space-x-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 sm:px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
            activeTab === 'users'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{isTr ? '👥 Kullanıcılar' : '👥 Users'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fishes')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 sm:px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
            activeTab === 'fishes'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Fish className="w-4 h-4 text-cyan-400" />
          <span>{isTr ? '🐟 Balık & Markalar' : '🐟 Fish & Brands'}</span>
        </button>

        <button
          onClick={() => setActiveTab('spots')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 sm:px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all ${
            activeTab === 'spots'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>{isTr ? '📍 Mera Yönetimi' : '📍 Spots Manager'}</span>
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'users' && <AdminUsersClient />}
      {activeTab === 'fishes' && <AdminFishClient />}
      {activeTab === 'spots' && <AdminSpotsClient />}
    </div>
  );
}
