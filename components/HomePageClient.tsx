'use client';

import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import FishGrid from './FishGrid';
import type { Fish } from '@/lib/supabase';

interface HomePageClientProps {
  initialFishes?: Fish[];
}

export default function HomePageClient({ initialFishes = [] }: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 mobile-scroll-pad">
      {/* Hero Section with integrated Live Search input */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Featured Spotlight & Filter Chips & Main Feed */}
      <FishGrid
        initialFishes={initialFishes}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
      />
    </div>
  );
}
