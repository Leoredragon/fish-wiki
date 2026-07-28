-- ====================================================================
-- OLTAPP: Wiki içerik düzeltmesi (görsel hariç)
-- Supabase SQL Editor'da RUN.
-- - Zayıf İngilizce metinleri güçlendirir
-- - Aksesuar kategorisine eksik rehberleri ekler
-- - Sahte/mock UUID satırları varsa pasifleştirir
-- Veri silmez; is_active=false sadece mock UUID'ler için.
-- ====================================================================

-- 1) Zayıf EN içerikleri başlık eşleşmesiyle güncelle
UPDATE public.wiki_articles SET
  short_desc_en = 'Dynamic shore and boat angling with hard lures, spoons and soft plastics.',
  content_en = E'Spin fishing is based on casting hard baits, topwater poppers, spoons and soft plastics from shore or boat, then retrieving them with rhythmic rod action.

GEAR SELECTION:
• Rod: 2.40m–2.70m, 10–40g or 7–28g casting weight, medium-fast action.
• Reel: size 3000–4000 with 5.2:1 or 6.2:1 gear ratio.
• Line: PE 0.8–1.2 braid + 0.30–0.35 mm fluorocarbon shock leader.

TARGET SPECIES:
European seabass, bluefish, little tunny, bonito, leerfish, barracuda and trout.'
WHERE lower(trim(title_tr)) = lower(trim('Spinning (At-Çek) Balıkçılığı'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Ultra-light coastal fishing with micro lures around rocks, harbors and breakwaters.',
  content_en = E'LRF (Light Rock Fishing) is a Japanese ultra-light method using 0.5–10 g micro lures in shallow rocky areas, harbors and breakwaters for maximum bite detection.

GEAR SELECTION:
• Rod: 2.10m–2.30m, 0.5–7g or 1–10g, sensitive tubular or solid tip.
• Reel: size 1000–2000 shallow spool.
• Line: PE 0.2–0.4 braid + 0.16–0.20 mm fluorocarbon leader.

TARGET SPECIES:
Horse mackerel, striped seabream, brown meagre, two-banded seabream, perch, sand smelt and comber.'
WHERE lower(trim(title_tr)) = lower(trim('LRF (Light Rock Fishing / Ultra Hafif At-Çek)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Patient trophy carp fishing with hair rigs, boilies, rod pods and bite alarms.',
  content_en = E'Carp angling is a popular freshwater trophy discipline based on accurate baiting, patience and specialized terminal tackle in lakes and reservoirs.

GEAR SELECTION:
• Rod: 3.60m–3.90m (12–13 ft), around 3.0 lb test curve.
• Reel: baitrunner / freespool reels with strong drag.
• Rig: hair rig, Ronnie/spinner, pop-up and bottom boilie presentations.

TARGET SPECIES:
Mirror carp, common carp and large specimen carp in still waters.'
WHERE lower(trim(title_tr)) = lower(trim('Sazan Balıkçılığı (Carp Angling)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Heavy metal jig casting from rocky shores for pelagic predators.',
  content_en = E'Shore jigging is casting 30–100 g metal jigs from deep rocky coasts and working them with sharp vertical jerks (high-pitch style).

GEAR SELECTION:
• Rod: 2.70m–3.00m shore jigging blanks with strong backbone.
• Reel: size 4000–6000 with smooth high-drag performance.
• Line: PE 1.5–3.0 braid + abrasion-resistant fluorocarbon leader.

TARGET SPECIES:
Amberjack-class predators, leerfish, grouper and other pelagic coastal fish.'
WHERE lower(trim(title_tr)) = lower(trim('Shore Jigging (Kıyı Ağır Metal Jig)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Boat fishing by towing lures or live bait behind a moving vessel.',
  content_en = E'Trolling (sırtı) covers large areas by towing hard baits, spoons or live bait behind a moving boat, usually at 3–6 knots.

GEAR SELECTION:
• Rod: strong boat / trolling rods.
• Reel: high-capacity spinning or lever-drag reels.
• Lures: diving minnows, spoons and natural bait setups.

TARGET SPECIES:
Bonito, tuna-class pelagics, leerfish and other open-water predators.'
WHERE lower(trim(title_tr)) = lower(trim('Sırtı / Trolling (Tekne Balıkçılığı)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Long-distance beach casting with heavy sinkers into the surf zone.',
  content_en = E'Surfcasting uses stiff 4.20m–4.50m rods to cast heavy sinker rigs beyond 100 m into the surf and sandbars.

GEAR SELECTION:
• Rod: 4.20m–4.50m, 100–250 g casting range.
• Reel: Big Pit / long-cast reels with tapered spools.
• Terminal: baited bottom rigs with strong shock leaders.

TARGET SPECIES:
Seabream species, flatfish, rays and other beach-zone fish.'
WHERE lower(trim(title_tr)) = lower(trim('Surfcasting (Kıyı İleri Atış & Ağır Dip)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Smooth 8-strand PE braid for long casts and high sensitivity.',
  content_en = E'8x braid is made from eight PE microfibers woven into a round, smooth profile.

ADVANTAGES:
• Near-zero stretch for maximum bite detection.
• Thin diameter and high breaking strength.
• Excellent casting distance and spool packing.

USE TIP:
Always add a fluorocarbon or mono leader for abrasion resistance and stealth.'
WHERE lower(trim(title_tr)) = lower(trim('8 Kat Örgü PE İp Misina (8x Braided Line)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Nearly invisible leader line with high abrasion resistance.',
  content_en = E'Fluorocarbon has a refractive index close to water, so it stays less visible underwater.

ADVANTAGES:
• Ideal as a 50 cm–1.5 m leader on braid mainline.
• High abrasion resistance against rocks and mussels.
• Good sink rate for deeper presentations.

USE TIP:
Choose softer FC for light LRF and harder FC for rocky shore work.'
WHERE lower(trim(title_tr)) = lower(trim('Fluorocarbon (FC) Lider Misina'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Stretchy nylon line that cushions sudden strikes and shocks.',
  content_en = E'Monofilament nylon stretches under load, helping absorb hard runs and sudden head shakes.

ADVANTAGES:
• Forgiving shock absorption.
• Easy knotting for beginners.
• Good all-round value for float and bottom fishing.

USE TIP:
Replace regularly because UV and memory reduce performance over time.'
WHERE lower(trim(title_tr)) = lower(trim('Monofilament (Naylon) Misina'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Hard minnow lures with diving lips for lifelike swimming action.',
  content_en = E'Floating and sinking minnows use a diving lip to create a natural side-to-side swimming action on retrieve.

HOW TO USE:
• Twitch-pause retrieves for seabass and trout.
• Steady retrieve for open-water predators.
• Match diving depth to the water column you are fishing.

BEST CONDITIONS:
Clear to moderately stained water with active baitfish.'
WHERE lower(trim(title_tr)) = lower(trim('Floating & Sinking Minnow (Maket Balıklar)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Soft plastics on jigheads for natural movement and subtle bites.',
  content_en = E'Soft plastics (shad, worm, craw) on jigheads offer natural texture and movement that triggers cautious fish.

HOW TO USE:
• Lift-and-drop jigging near the bottom.
• Slow dragging across rocky structure.
• Match jighead weight to depth and current.

BEST FOR:
LRF, light spin and rocky-shore sessions.'
WHERE lower(trim(title_tr)) = lower(trim('Silikon Yemler & Jighead (Shad, Worm, Craw)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Classic carp presentation with the bait hanging on a short hair.',
  content_en = E'The hair rig places the boilie or particle on a short hair behind the hook so the fish can suck the bait in and self-hook on the bolt principle.

KEY POINTS:
• Keep the hair length matched to bait size.
• Use sharp curved or wide-gape hooks.
• Pair with PVA bags or spodding for accurate baiting.

BEST FOR:
Mirror and common carp in lakes and reservoirs.'
WHERE lower(trim(title_tr)) = lower(trim('Hair Rig (Kıl Rig)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Highly mobile carp rig that spins and resets for better hook-ups.',
  content_en = E'The Ronnie / Spinner Rig uses a swivel and curved hook so the hook point stays aggressive and can rotate into the fish’s mouth.

KEY POINTS:
• Excellent for pop-up and wafter presentations.
• Resets well after casts and weed contact.
• Keep components tidy to maintain free rotation.

BEST FOR:
Wary specimen carp over clean or lightly weedy bottoms.'
WHERE lower(trim(title_tr)) = lower(trim('Ronnie Rig / Spinner Rig'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Sensitive float setup for shallow and mid-water presentations.',
  content_en = E'A float (mantar) rig presents bait under a buoyant indicator and is excellent for precise depth control.

HOW TO USE:
• Match float buoyancy to bait weight and current.
• Set depth so the bait sits just above weed or structure.
• Strike on confident dips or sustained submerges.

BEST FOR:
Mullet, bream, chub and general shore/pier fishing.'
WHERE lower(trim(title_tr)) = lower(trim('Şamandıralı (Mantar) Takım'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Weedless soft-plastic presentation for cover and rocky bottoms.',
  content_en = E'Texas Rig buries the hook point in a soft plastic so the bait travels through weed and rock with fewer snags.

HOW TO USE:
• Peg or free-sliding bullet weight above the hook.
• Work with slow hops and pauses.
• Use braided mainline for solid hook-sets through cover.

BEST FOR:
Bass-style predators and snaggy freshwater or coastal structure.'
WHERE lower(trim(title_tr)) = lower(trim('Texas Rig'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Versatile casting rod for lure fishing in fresh and salt water.',
  content_en = E'Spinning rods are typically 2-piece carbon blanks designed for casting and working hard and soft lures.

SELECTION TIPS:
• Match casting weight to your main lure range.
• Prefer medium-fast action for all-round control.
• Choose length by venue: shorter for piers, longer for open shore.

BEST PAIRING:
3000–4000 reel + PE braid + fluorocarbon leader.'
WHERE lower(trim(title_tr)) = lower(trim('Spin Kamışı (Spinning Rod)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Ultra-sensitive light rod for micro lures under 10 grams.',
  content_en = E'LRF rods use very sensitive tips to transmit micro bites when fishing tiny soft plastics and metal jigs.

SELECTION TIPS:
• Look for 0.5–7 g or 1–10 g casting ratings.
• Solid tips help detect delicate takes.
• Keep the setup light to protect fine leaders.

BEST PAIRING:
1000–2000 reel + PE 0.2–0.4 + thin FC leader.'
WHERE lower(trim(title_tr)) = lower(trim('LRF Kamışı (Ultra Light Rod)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Long stiff blank for casting heavy sinkers from the beach.',
  content_en = E'Surfcasting rods are built to launch heavy sinkers and baited rigs into the surf zone from sandy beaches.

SELECTION TIPS:
• 4.20m–4.50m length is common for distance casting.
• Match the blank power to sinker weight.
• Use a tapered shock leader for casting safety.

BEST PAIRING:
Big Pit reel + strong mono/braid + pyramid or grip sinkers.'
WHERE lower(trim(title_tr)) = lower(trim('Surfcast Kamışı (Surfcasting Rod)'));

UPDATE public.wiki_articles SET
  short_desc_en = 'Freespool carp reel that lets fish take line before the strike.',
  content_en = E'Baitrunner / freespool reels allow a carp to take line freely until the angler turns the handle or flips the baitrunner lever.

WHY IT MATTERS:
• Prevents the fish from feeling heavy resistance too early.
• Essential for overnight carp sessions with alarms.
• Provides controlled free-spool and a strong fighting drag.

BEST FOR:
Hair-rig carp fishing on lakes and reservoirs.'
WHERE lower(trim(title_tr)) = lower(trim('Sazan Makinesi (Baitrunner / Serbest Makara)'));

-- 2) Aksesuar rehberleri (yoksa ekle, görsel yok)
WITH new_accessories AS (
  SELECT *
  FROM (
    VALUES
      (
        'accessories',
        'Balıkçı Pensesi & Makas Seti',
        'Fishing Pliers & Scissors Kit',
        'Misina kesme, kanca çıkarma ve kıskaç işleri için temel el aleti seti.',
        'Essential hand tools for cutting line, removing hooks and crimping.',
        E'Pense ve makas seti, kıyı ve tekne avında güvenlik ve hız sağlar.

NELER OLMALI:
• Paslanmaz veya kaplamalı kanca sökücü pens.
• Örgü ip kesebilen keskin makas.
• Kilitli kanca çıkarma ucu.

KULLANIM İPUCU:
Tuzlu sudan sonra tatlı suyla durulayıp kurulayın; menteşe noktalarını yağlayın.',
        E'A pliers and scissors kit improves safety and speed on shore or boat sessions.

WHAT TO INCLUDE:
• Stainless or coated hook-removal pliers.
• Sharp scissors that cut braid cleanly.
• A secure hook-out tip.

TIP:
Rinse with fresh water after salt sessions and oil the joints.',
        'Tüm Sular',
        'Başlangıç'
      ),
      (
        'accessories',
        'Fish Grip (Balık Tutucu)',
        'Fish Grip Landing Tool',
        'Dişli veya dikenli balıkları güvenli tutmak için kıskaç tipi tutucu.',
        'Clamp-style tool for safely controlling toothy or spiny fish.',
        E'Fish grip, özellikle iskarpit, trakonya ve dişli yırtıcılarda çıplak elle tutmayı azaltır.

Neden Önemli:
• El yaralanmalarını azaltır.
• Fotoğraf ve kanca çıkarmada kontrol sağlar.
• Ağır balıklarda bile daha güvenli taşıma sunar.

UYARI:
Zehirli dikenli türlerde ek koruma ve dikkat şarttır.',
        E'A fish grip reduces bare-hand handling, especially with scorpionfish, weevers and toothy predators.

WHY IT MATTERS:
• Lowers injury risk.
• Improves control for unhooking and photos.
• Helps handle heavier fish more safely.

WARNING:
Extra care is still required with venomous-spined species.',
        'Tüm Sular',
        'Başlangıç'
      ),
      (
        'accessories',
        'Kepçe (Landing Net)',
        'Landing Net',
        'Balığı sudan güvenli almak için kauçuk veya düğümsüz ağlı kepçe.',
        'Rubber or knotless landing net for safely securing fish.',
        E'Doğru kepçe, balığı yormadan ve zararsız şekilde boşa almayı kolaylaştırır.

SEÇİM:
• Kauçuk / düğümsüz ağ tercih edin.
• Sap uzunluğunu kıyı veya tekneye göre seçin.
• Trofe avlarda geniş ağızlı modeller kullanın.

İPUCU:
Ağı kuru bırakmayın; tuz ve kum birikimini temizleyin.',
        E'The right landing net helps secure fish quickly with less damage.

SELECTION:
• Prefer rubber or knotless mesh.
• Match handle length to shore or boat use.
• Use a wide mouth for trophy fish.

TIP:
Clean salt and sand after sessions and let the net dry.',
        'Tüm Sular',
        'Başlangıç'
      ),
      (
        'accessories',
        'Fırdöndü & Klips Seçimi',
        'Swivels & Snap Clips',
        'Misina bükülmesini azaltan fırdöndüler ve hızlı yem değişimi için klipsler.',
        'Swivels reduce line twist; snaps allow fast lure changes.',
        E'Fırdöndü ve klips, özellikle kaşık ve dönen sahtelerde misina sağlığını korur.

NE ZAMAN:
• Metal kaşık / spinner avlarında fırdöndü kullanın.
• Sık yem değiştiriyorsanız kaliteli snap tercih edin.
• LRF’de mümkün olduğunca küçük ve hafif parçalar seçin.

İPUCU:
Ucuz, açık ağızlı klipslerden kaçının; kapalı ve kilitli modeller daha güvenlidir.',
        E'Swivels and snaps protect line health, especially with spoons and spinning lures.

WHEN TO USE:
• Use swivels for metal spoons and spinners.
• Choose quality snaps if you change lures often.
• Keep components small and light for LRF.

TIP:
Avoid cheap open snaps; locked designs are safer.',
        'Tüm Sular',
        'Başlangıç'
      ),
      (
        'accessories',
        'İğne Türleri (Jighead, Offset, Circle)',
        'Hook Types (Jighead, Offset, Circle)',
        'Yem ve tekniğe göre doğru iğne seçiminin kısa rehberi.',
        'A short guide to choosing the right hook for bait and technique.',
        E'İğne seçimi, yem sunumu ve takılma oranını doğrudan etkiler.

TEMEL TÜRLER:
• Jighead: silikon ve LRF için.
• Offset: Texas / weedless soft plastic için.
• Circle: canlı/ölü yemli dip avında kendi kendine tutunma için.

İPUCU:
Kancayı her seferinde kontrol edin; kör uç kayıp demektir.',
        E'Hook choice directly affects presentation and hook-up ratio.

CORE TYPES:
• Jighead: soft plastics and LRF.
• Offset: Texas / weedless soft plastics.
• Circle: bait fishing with more self-hooking behavior.

TIP:
Check the point often; a dull hook means lost fish.',
        'Tüm Sular',
        'Orta'
      )
  ) AS t(
    category, title_tr, title_en, short_desc_tr, short_desc_en,
    content_tr, content_en, water_type, difficulty_level
  )
)
INSERT INTO public.wiki_articles (
  category, title_tr, title_en, short_desc_tr, short_desc_en,
  content_tr, content_en, image_url, water_type, difficulty_level, is_active
)
SELECT
  na.category, na.title_tr, na.title_en, na.short_desc_tr, na.short_desc_en,
  na.content_tr, na.content_en, NULL, na.water_type, na.difficulty_level, true
FROM new_accessories na
WHERE NOT EXISTS (
  SELECT 1
  FROM public.wiki_articles w
  WHERE lower(trim(w.title_tr)) = lower(trim(na.title_tr))
);

-- 3) Kodda kullanılan sahte mock UUID'ler DB'ye sızdıysa pasifleştir
UPDATE public.wiki_articles
SET is_active = false
WHERE id::text LIKE '00000000-0000-0000-0000-%';

NOTIFY pgrst, 'reload schema';
