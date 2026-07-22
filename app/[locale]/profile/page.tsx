import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Dijital Livarım | Oltapp' : 'My Catch Log | Oltapp',
  };
}

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user catches
  const { data: catches } = await supabase
    .from('catch_logs')
    .select('*, fishes(name_tr, name_en)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <ProfileClient user={user} profile={profile} initialCatches={catches || []} />;
}
