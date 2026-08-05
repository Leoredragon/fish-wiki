'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Camera, BookImage, UserPlus, Check, X } from 'lucide-react';

const STORAGE_KEY = 'oltaapp_first_week_v1';

type ChecklistState = {
  dismissed?: boolean;
  sharedCatch?: boolean;
  addedStory?: boolean;
  followed?: boolean;
  startedAt?: string;
};

function load(): ChecklistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init: ChecklistState = { startedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw) as ChecklistState;
  } catch {
    return {};
  }
}

function save(state: ChecklistState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/** Call from share/story/follow flows to mark checklist items done. */
export function markFirstWeekProgress(key: 'sharedCatch' | 'addedStory' | 'followed') {
  try {
    const state = load();
    if (state[key]) return;
    state[key] = true;
    save(state);
    window.dispatchEvent(new CustomEvent('oltaapp:first-week'));
  } catch {}
}

export default function FirstWeekChecklist({
  onShareCatch,
  onAddStory
}: {
  onShareCatch?: () => void;
  onAddStory?: () => void;
}) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [state, setState] = useState<ChecklistState | null>(null);

  useEffect(() => {
    setState(load());
    const refresh = () => setState(load());
    window.addEventListener('oltaapp:first-week', refresh);
    return () => window.removeEventListener('oltaapp:first-week', refresh);
  }, []);

  if (!state || state.dismissed) return null;

  const started = state.startedAt ? new Date(state.startedAt).getTime() : Date.now();
  const daysOpen = (Date.now() - started) / (1000 * 60 * 60 * 24);
  if (daysOpen > 7) return null;

  const items = [
    {
      key: 'sharedCatch' as const,
      done: !!state.sharedCatch,
      label: isTr ? 'İlk avını paylaş' : 'Share your first catch',
      icon: Camera,
      action: onShareCatch
    },
    {
      key: 'addedStory' as const,
      done: !!state.addedStory,
      label: isTr ? 'Bir hikâye ekle' : 'Add a story',
      icon: BookImage,
      action: onAddStory
    },
    {
      key: 'followed' as const,
      done: !!state.followed,
      label: isTr ? 'Bir balıkçıyı takip et' : 'Follow an angler',
      icon: UserPlus
    }
  ];

  const doneCount = items.filter((i) => i.done).length;
  if (doneCount === items.length) return null;

  const dismiss = () => {
    const next = { ...state, dismissed: true };
    save(next);
    setState(next);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
            {isTr ? 'İlk 7 gün' : 'First 7 days'}
          </p>
          <p className="text-sm font-bold text-[#0F172A]">
            {isTr ? `${doneCount}/${items.length} tamamlandı — topluluğa ısın` : `${doneCount}/${items.length} done — warm up the community`}
          </p>
        </div>
        <button type="button" onClick={dismiss} className="p-1 rounded-full text-slate-400 hover:bg-white/80" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <button
                type="button"
                disabled={item.done || !item.action}
                onClick={() => item.action?.()}
                className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-colors ${
                  item.done
                    ? 'bg-white/60 text-emerald-700'
                    : item.action
                      ? 'bg-white hover:bg-emerald-100/80 text-slate-700'
                      : 'bg-white/80 text-slate-600'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    item.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-emerald-600'
                  }`}
                >
                  {item.done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </span>
                <span className={item.done ? 'line-through opacity-80' : ''}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
