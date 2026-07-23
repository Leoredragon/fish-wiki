import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newFishes = [
  {
    name_tr: 'Fırat Turnası',
    name_en: 'Manger (Barbus)',
    scientific_name: 'Luciobarbus esocinus',
    water_type: 'Tatlı Su',
    short_info_tr: 'Fırat ve Dicle nehirlerinin 100 kg\'a ulaşabilen dev efsanevi avcısı.',
    short_info_en: 'Legendary giant predator of the Euphrates and Tigris rivers reaching up to 100 kg.',
    limit_size: 'Asgari 50 cm',
    ban_periods: '15 Mart - 15 Haziran',
    active_seasons: 'İlkbahar, Yaz, Sonbahar',
    recommended_gear: 'Ağır Dip Oltası, Kaşık, Canlı Yem Düzenekleri',
    favorite_baits: 'Canlı Balık, Hamur, Ağır Metal Kaşıklar, Sülük',
    primary_regions: 'Atatürk Barajı, Keban Barajı, Birecik, Fırat ve Dicle Nehirleri',
    taste_rating: '4/5 Yıldız - İri ve Yağlı Et',
    cooking_tips_tr: 'Fırında baharatlı buğulama veya kuşbaşı doğranıp şiş kebap yapılır.',
    cooking_tips_en: 'Best oven-baked with herbs or grilled as skewers.',
    description_tr: 'Güneydoğu ve Doğu Anadolu sularının en büyük trofe balığıdır. Oltaya bindiğinde bükülmez bir direnç gösterir ve ağır takımlarla avlanır.',
    description_en: 'The largest trophy freshwater species of the Euphrates basin, known for its massive power.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Kırmızı Benekli Alabalık',
    name_en: 'Brown Trout',
    scientific_name: 'Salmo trutta fario',
    water_type: 'Tatlı Su',
    short_info_tr: 'Dağ derelerinin ve buz gibi kaynak sularının yerli kraliçesi.',
    short_info_en: 'The native queen of cold mountain streams and spring waters.',
    limit_size: 'Asgari 20 cm (Günlük limit: 3 Adet)',
    ban_periods: '1 Ekim - 28 Şubat (Orman içi sularda)',
    active_seasons: 'İlkbahar, Yaz',
    recommended_gear: 'Fly-fishing, Ultra Light LRF, Mepps Kaşık (0-1 No)',
    favorite_baits: 'Suni Sinek (Dry/Nymph), Mikro Kaşıklar, Küçük Silikonlar',
    primary_regions: 'Doğu Karadeniz dereleri, Toros dağ dereleri, Munzur, Kaçkarlar',
    taste_rating: '5/5 Yıldız - Müthiş Lezzet ve Kırmızı Et',
    cooking_tips_tr: 'Tereyağında hafifçe tavada kızartılır veya kiremitte fırınlanır.',
    cooking_tips_en: 'Best pan-fried in fresh butter or clay pot baked.',
    description_tr: 'Buz gibi berrak derelerde yaşamını sürdüren, inanılmaz ürkek ve zeki bir alabalık türüdür. Sinek oltası (Fly fishing) sporu için en değerli balıktır.',
    description_en: 'An extremely wary and intelligent native trout, highly prized by fly anglers.',
    image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Tatlı Su Levreği (Perç)',
    name_en: 'European Perch',
    scientific_name: 'Perca fluviatilis',
    water_type: 'Tatlı Su',
    short_info_tr: 'Çizgili vücudu ve turuncu yüzgeçleriyle göllerin obur avcısı.',
    short_info_en: 'A voracious lake predator with tiger stripes and bright orange fins.',
    limit_size: 'Asgari 18 cm',
    ban_periods: '15 Mart - 30 Nisan',
    active_seasons: 'İlkbahar, Yaz, Sonbahar',
    recommended_gear: 'LRF (Light Rock Fishing), Döner Kaşık, Silikon Sahteler',
    favorite_baits: 'Mikro Silikonlar (2-5cm), Döner Kaşıklar (Mepps 1-2 No), Canlı Gümüş Balığı',
    primary_regions: 'Sapanca Gölü, Terkos Gölü, Uluabat, Eğirdir, İç Anadolu gölleri',
    taste_rating: '4/5 Yıldız - Beyaz ve Sıkı Et',
    cooking_tips_tr: 'Derisi yüzüldükten sonra mısır ununa bulanıp tavada çıtır kızartılır.',
    cooking_tips_en: 'Skin removed, coated in cornmeal and pan-fried crispy.',
    description_tr: 'Sürü halinde gezen ve mikro yemlere gözü kapalı atlayan çok keyifli bir LRF balığıdır. Dikenli sırt yüzgecine dikkat edilmelidir.',
    description_en: 'Schooling lake predators that offer non-stop action on ultralight lures.',
    image_url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Şabut Balığı',
    name_en: 'Euphrates Barbel',
    scientific_name: 'Arabibarbus grypus',
    water_type: 'Tatlı Su',
    short_info_tr: 'Mezopotamya sularına özgü lezzeti ve gücüyle ünlü bıyıklı balık.',
    short_info_en: 'A powerful barbell species native to Mesopotamian waters.',
    limit_size: 'Asgari 30 cm',
    ban_periods: '15 Mart - 15 Haziran',
    active_seasons: 'İlkbahar, Yaz',
    recommended_gear: 'Sazan Montajı, Yemli Dip Oltası',
    favorite_baits: 'Haşlanmış Mısır, Özel Sazan Hamurları, Solucan, Yengeç',
    primary_regions: 'Fırat ve Dicle Nehri, Atatürk Barajı, Keban Barajı, Birecik',
    taste_rating: '5/5 Yıldız - Yörenin En Lezzetli Balığı',
    cooking_tips_tr: 'Izgarada meşe kömüründe pişirilir veya fırında sebzeli buğulama yapılır.',
    cooking_tips_en: 'Grilled over charcoal or baked with fresh vegetables.',
    description_tr: 'Fırat ve Dicle nehrinde yaşayan, pullu ve bıyıklı yapısıyla yüksek ekonomik ve lezzet değerine sahip endemik bir tatlı su türüdür.',
    description_en: 'An endemic barbel species highly valued for its gastronomy and fighting power.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Kızılkanat',
    name_en: 'Rudd',
    scientific_name: 'Scardinius erythrophthalmus',
    water_type: 'Tatlı Su',
    short_info_tr: 'Parlak kırmızı yüzgeçleri ve gümüş gövdesiyle sazlıkların sevimli sakini.',
    short_info_en: 'Beautiful silver fish with bright red fins inhabiting reed beds.',
    limit_size: 'Asgari 15 cm',
    ban_periods: '15 Mart - 15 Haziran',
    active_seasons: 'İlkbahar, Yaz',
    recommended_gear: 'Şamandıralı İnce Takım, LRF',
    favorite_baits: 'Ekmek İçi, Solucan, Mısır, Küçük Sinek Sahteleri',
    primary_regions: 'Sapanca, Terkos, Uluabat, Manyas ve tüm göl sazlıkları',
    taste_rating: '3/5 Yıldız - Kılçıklı Ancak Tatlı Et',
    cooking_tips_tr: 'Tavada ince çizikler atılarak bol yağda kızartılır.',
    cooking_tips_en: 'Deep fried with cross cuts along the body.',
    description_tr: 'Durgun ve bitkili göllerde şamandıralı oltalarla avlanması özellikle genç balıkçılar için çok keyifli olan tatlı su balığıdır.',
    description_en: 'A classic float-fishing species found in vegetated freshwater lakes.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Kadife Balığı',
    name_en: 'Tench',
    scientific_name: 'Tinca tinca',
    water_type: 'Tatlı Su',
    short_info_tr: 'Koyu yeşil kadifemsi pul yapısı ve hassas ısırıklarıyla ünlü dip sakini.',
    short_info_en: 'Dark green velvet-skinned bottom dweller known for subtle bites.',
    limit_size: 'Asgari 26 cm',
    ban_periods: '15 Mart - 15 Haziran',
    active_seasons: 'İlkbahar, Yaz',
    recommended_gear: 'Hassas Şamandıralı Takım, Dip Oltası',
    favorite_baits: 'Solucan, Kırmızı Kurt, Haşlanmış Mısır, Ekmek İçi',
    primary_regions: 'İznik Gölü, Mogan Gölü, Abant, Göller Bölgesi durgun sularda',
    taste_rating: '3/5 Yıldız - Yumuşak ve Yağlı Et',
    cooking_tips_tr: 'Fırında meşe odununda ızgarada veya tavada pişirilir.',
    cooking_tips_en: 'Grilled over oak charcoal or pan-fried.',
    description_tr: 'Çamurlu ve sazlık diplerde yaşayan, vücudu koruyucu kaygan bir tabakayla kaplı çok uyanık bir dip balığıdır.',
    description_en: 'A cautious bottom feeding fish living in muddy reed beds.',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    is_active: true
  },
  {
    name_tr: 'Yılan Balığı',
    name_en: 'European Eel',
    scientific_name: 'Anguilla anguilla',
    water_type: 'Tatlı Su',
    short_info_tr: 'Denizlerden nehirlere göç eden son derece güçlü ve yağlı yılanımsı balık.',
    short_info_en: 'Catadromous snake-like fish migrating between oceans and freshwaters.',
    limit_size: 'Asgari 50 cm',
    ban_periods: 'Yıl boyu serbest',
    active_seasons: 'İlkbahar, Yaz, Sonbahar',
    recommended_gear: 'Gece Yemli Dip Oltası',
    favorite_baits: 'Canlı Balık, Sülük, Solucan, Balık Parçaları',
    primary_regions: 'Manavgat Nehir Ağzı, Köyceğiz Gölü, Sakarya Nehri, Asi Nehri',
    taste_rating: '5/5 Yıldız - Çok Yüksek Yağ Oranı ve Güçlü Lezzet',
    cooking_tips_tr: 'Izgarada kömür ateşinde kendi yağında pişirilir veya füme yapılır.',
    cooking_tips_en: 'Grilled over charcoal in its own natural fat or smoked.',
    description_tr: 'Okyanusta doğup tatlı su nehirlerimize göç eden, gece kayalık ve çamurlu diplerde yemli oltalarla yakalanan egzotik bir türdür.',
    description_en: 'An exotic catadromous species targeted at night with heavy bottom bait rigs.',
    image_url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    is_active: true
  }
];

async function insertFishes() {
  console.log('Inserting new freshwater fish species into Supabase...');
  for (const fish of newFishes) {
    const { data, error } = await supabase
      .from('fishes')
      .insert(fish);

    if (error) {
      console.error(`Error inserting ${fish.name_tr}:`, error.message);
    } else {
      console.log(`Successfully added: ${fish.name_tr}`);
    }
  }
  console.log('Done!');
}

insertFishes();
