'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import FishGrid, { RICH_MOCK_FISHES } from './FishGrid';

export default function HomePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Count freshwater & saltwater species from mock data for hero badges
  const freshwaterCount = RICH_MOCK_FISHES.filter(f => f.water_type?.toLowerCase().includes('tatlı')).length;
  const saltwaterCount = RICH_MOCK_FISHES.filter(f => f.water_type?.toLowerCase().includes('tuzlu')).length;

  return (
    <div className="space-y-10 sm:space-y-12 pb-12">
      {/* Hero Section with Category Buttons */}
      <HeroSection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        freshwaterCount={freshwaterCount}
        saltwaterCount={saltwaterCount}
      />

      {/* Main Filter & Fish Cards Grid */}
      <section className="space-y-4">
        <FishGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>
    </div>
  );
}
