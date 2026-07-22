'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import FishGrid from './FishGrid';
import ActiveTargets from './home/ActiveTargets';

export default function HomePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section with integrated Live Search input */}
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Active Targets Module */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ActiveTargets />
      </div>

      {/* Featured Spotlight & Filter Chips & Main Feed */}
      <FishGrid
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
      />
    </div>
  );
}
