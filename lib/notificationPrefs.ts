export type NotificationPrefs = {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  dailyScore: boolean;
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  likes: true,
  comments: true,
  follows: true,
  dailyScore: true
};

export const NOTIFICATION_PREFS_KEY = 'oltaapp_notification_prefs_v1';

export function loadNotificationPrefs(): NotificationPrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_NOTIFICATION_PREFS };
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
    const parsed = JSON.parse(raw);
    return {
      likes: parsed.likes !== false,
      comments: parsed.comments !== false,
      follows: parsed.follows !== false,
      dailyScore: parsed.dailyScore !== false
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  try {
    window.dispatchEvent(new CustomEvent('oltaapp:notification-prefs', { detail: prefs }));
  } catch {}
}

/** Map DB jsonb (snake_case) → client prefs */
export function prefsFromDb(raw: unknown): NotificationPrefs {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_NOTIFICATION_PREFS };
  const o = raw as Record<string, unknown>;
  return {
    likes: o.likes !== false,
    comments: o.comments !== false,
    follows: o.follows !== false,
    dailyScore: o.daily_score !== false && o.dailyScore !== false
  };
}

export function prefsToDb(prefs: NotificationPrefs) {
  return {
    likes: prefs.likes,
    comments: prefs.comments,
    follows: prefs.follows,
    daily_score: prefs.dailyScore
  };
}
