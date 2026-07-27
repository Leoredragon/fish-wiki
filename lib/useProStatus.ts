'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useProStatus() {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const supabase = createClient();

  const checkPro = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      // 1. Check local storage simulation override first for instant zero-latency test
      const localSim = localStorage.getItem(`oltapp_pro_sim_${user.id}`);
      if (localSim !== null) {
        setIsPro(localSim === 'true');
        setLoading(false);
        return;
      }

      // 2. Check Supabase profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (profile && typeof profile.is_premium === 'boolean') {
        setIsPro(profile.is_premium);
      } else {
        setIsPro(false);
      }
    } catch {
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPro();

    // Listen for storage events to update state instantly when admin toggles pro status
    const handleStorage = () => checkPro();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleProMode = async (newVal: boolean) => {
    if (!currentUser) return false;
    return toggleUserProStatus(currentUser.id, newVal);
  };

  const toggleUserProStatus = async (targetUserId: string, newVal: boolean) => {
    try {
      // 1. Always store in localStorage for instant 0ms offline & sim status
      localStorage.setItem(`oltapp_pro_sim_${targetUserId}`, String(newVal));

      // 2. Dispatch event for instant same-page React updates across components
      window.dispatchEvent(new Event('storage'));

      // 3. Update local state if it's current user
      if (currentUser && currentUser.id === targetUserId) {
        setIsPro(newVal);
      }

      // 4. Attempt Supabase profiles table update
      await supabase
        .from('profiles')
        .update({ is_premium: newVal })
        .eq('id', targetUserId);

      return true;
    } catch {
      return true;
    }
  };

  return {
    isPro,
    setIsPro,
    loading,
    currentUser,
    toggleProMode,
    toggleUserProStatus,
    refetch: checkPro
  };
}

export function isUserProSync(userId: string): boolean {
  if (typeof window === 'undefined' || !userId) return false;
  const val = localStorage.getItem(`oltapp_pro_sim_${userId}`);
  return val === 'true';
}
