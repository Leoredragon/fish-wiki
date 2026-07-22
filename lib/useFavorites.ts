'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'fish_wiki_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleFavorite = (fishId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(fishId)) {
        updated = prev.filter((id) => id !== fishId);
      } else {
        updated = [...prev, fishId];
      }
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isFavorite = (fishId: string) => favorites.includes(fishId);

  return { favorites, toggleFavorite, isFavorite };
}
