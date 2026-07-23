export interface FishRegulation {
  speciesTr: string;
  minSizeCm: number;
  circularNote: string;
}

export const FISH_REGULATIONS: Record<string, number> = {
  'lüfer': 18,
  'sarikanat': 18,
  'çinekop': 18,
  'kalkan': 45,
  'deniz levreği': 40,
  'levrek': 40,
  'sazan': 40,
  'aynalı sazan': 40,
  'palamut': 25,
  'torik': 25,
  'çupra': 20,
  'çipura': 20,
  'alabalık': 20,
  'abant alası': 20,
  'dere alabalığı': 20,
  'lahos': 45,
  'grida': 45,
  'orfoz': 45,
  'kefal': 20,
  'tatlı su kefali': 20,
  'sudak': 26,
  'yayın': 90,
  'turna': 40,
  'fırat turnası': 50,
  'kırmızı benekli alabalık': 20,
  'şabut': 30,
  'kadife': 26,
  'tatlı su levreği': 18,
  'kızılkanat': 15,
  'yılan balığı': 50
};

export function getLegalMinSize(fishName: string): number | null {
  if (!fishName) return null;
  const normalized = fishName.toLowerCase().trim();
  
  for (const [key, size] of Object.entries(FISH_REGULATIONS)) {
    if (normalized.includes(key)) {
      return size;
    }
  }
  return null;
}
