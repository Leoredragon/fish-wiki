import AdminUsersClient from '@/components/admin/AdminUsersClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: locale === 'tr' ? 'Yönetici Paneli | Oltapp' : 'Admin Dashboard | Oltapp',
  };
}

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
