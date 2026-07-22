import AnglingCalendarClient from '@/components/AnglingCalendarClient';
import { setRequestLocale } from 'next-intl/server';

export default async function CalendarPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AnglingCalendarClient />;
}
