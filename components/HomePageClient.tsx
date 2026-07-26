'use client';

import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import FishGrid from './FishGrid';

export default function HomePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section with integrated Live Search input */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Featured Spotlight & Filter Chips & Main Feed */}
      <FishGrid
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
      />
    </div>
  );
}
