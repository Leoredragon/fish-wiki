import AdminDashboard from '@/components/admin/AdminDashboard';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Yönetici Paneli | Oltapp' : 'Admin Dashboard | Oltapp',
  };
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireAdmin(locale);

  return <AdminDashboard />;
}
