/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Bell, Heart, MessageSquare, CheckCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotificationCenter({ userId }: { userId: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const router = useRouter();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    // Set up polling interval to check for new notifications every 15s
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
      }
    } catch {
      // Table may not exist yet if SQL hasn't been run
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    setLoading(true);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    setLoading(false);
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notif.id);
    }
    setIsOpen(false);
    router.push('/community');
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
        title={isTr ? 'Bildirimler' : 'Notifications'}
      >
        <Bell className="w-5 h-5 text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-sm text-[#0F172A]">
                  {isTr ? 'Bildirimler' : 'Notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} yeni
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center space-x-1 transition-colors"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                  <span>{isTr ? 'Tümünü Oku' : 'Mark all read'}</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  {isTr ? 'Henüz yeni bildiriminiz yok.' : 'No notifications yet.'}
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full p-3.5 text-left flex items-start space-x-3 transition-colors hover:bg-slate-50 ${
                      !notif.read ? 'bg-emerald-50/40 font-semibold' : 'bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
                      notif.type === 'like' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {notif.type === 'like' ? <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> : <MessageSquare className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-xs text-slate-800 leading-snug">
                        <strong className="font-extrabold text-[#0F172A]">{notif.actor_name}</strong>{' '}
                        {notif.type === 'like' 
                          ? (isTr ? 'avınızı tebrik etti! 👏' : 'liked your catch!') 
                          : (isTr ? 'avınıza yorum yaptı. 💬' : 'commented on your catch.')}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {new Date(notif.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
