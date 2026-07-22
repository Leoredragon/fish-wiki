import { createClient } from '@/lib/supabase/server';
import { Shield, Users, Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return { title: 'Kullanıcı Yönetimi | Oltapp Admin' };
}

export default async function AdminUsersPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const t = await getTranslations({ locale, namespace: 'Admin' });

  // In a real app, you would check if the user has 'admin' role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch all profiles and their catch count
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      created_at,
      catch_logs (id)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] flex items-center space-x-3">
            <Users className="w-8 h-8 text-emerald-500" />
            <span>Kullanıcı Yönetimi</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Sisteme kayıtlı üyeleri ve istatistiklerini görüntüleyin.</p>
        </div>
        <Link
          href={`/${locale}/admin`}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all border border-slate-200"
        >
          &larr; Balık Yönetimine Dön
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Kullanıcı Adı</th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4 text-center">Toplam Av (Catch Log)</th>
                <th className="px-6 py-4 text-center">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {profiles?.map((profile: any) => (
                <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      {profile.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{profile.username || 'Gizli Kullanıcı'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(profile.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#0F172A] text-white px-3 py-1 rounded-full text-xs font-bold">
                      {profile.catch_logs?.length || 0} Av
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-400 font-mono">
                    {profile.id.substring(0, 8)}...
                  </td>
                </tr>
              ))}
              
              {(!profiles || profiles.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Henüz hiç kayıtlı kullanıcı yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
