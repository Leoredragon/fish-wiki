import AdminDashboard from '@/components/admin/AdminDashboard';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Yönetici Paneli | Oltapp' : 'Admin Dashboard | Oltapp',
  };
}

export default function AdminUsersPage() {
  return <AdminDashboard />;
}
