'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import FishGrid from './FishGrid';

export default function HomePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
