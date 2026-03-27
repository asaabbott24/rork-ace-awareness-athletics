export interface ArsenalItem {
  id: string;
  name: string;
  brand: string;
  category: 'RECOVERY' | 'TECH' | 'COURT' | 'BODY' | 'FUEL';
  image: string;
  price: string;
  affiliateLink: string;
  coachsTake: string;
}

export const OFFICIAL_ARSENAL: ArsenalItem[] = [
  // --- RECOVERY (The "1% Edge") ---
  {
    id: 'normatec_boots',
    name: 'Normatec 3 Legs',
    brand: 'Hyperice',
    category: 'RECOVERY',
    image: 'https://m.media-amazon.com/images/I/71X8NdnCsvL._AC_SX679_.jpg',
    price: '$799',
    affiliateLink: 'https://hyperice.com/products/normatec-3-legs',
    coachsTake: 'Flush the lactic acid immediately after a heavy leg day. Essential for two-a-days.'
  },
  {
    id: 'vktry_insoles',
    name: 'Carbon Fiber Insoles',
    brand: 'VKTRY',
    category: 'RECOVERY',
    image: 'https://cdn.shopify.com/s/files/1/1734/9605/products/Gold_Insoles_Top_Bottom_2048x.jpg',
    price: '$149',
    affiliateLink: 'https://vktrygear.com/',
    coachsTake: 'Proven to increase vertical by 1.6 inches. It returns energy to your foot instead of absorbing it.'
  },
  {
    id: 'larq_bottle',
    name: 'PureVis Self-Cleaning Bottle',
    brand: 'LARQ',
    category: 'RECOVERY',
    image: 'https://m.media-amazon.com/images/I/61y+1k+J9iL._AC_SL1500_.jpg',
    price: '$99',
    affiliateLink: 'https://www.livelarq.com/',
    coachsTake: 'Hydration is mental focus. This bottle uses UV light to kill bacteria, so your water is always lab-grade pure.'
  },
  {
    id: 'theragun_mini',
    name: 'Theragun Mini',
    brand: 'Therabody',
    category: 'RECOVERY',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    price: '$199',
    affiliateLink: 'https://www.therabody.com/us/en-us/theragun-mini.html',
    coachsTake: 'Fits in the gym bag. Essential for hip flexors and IT band work between sessions.'
  },

  // --- TECH (Lab Equipment) ---
  {
    id: 'blazepod',
    name: 'Flash Reflex Lights',
    brand: 'BlazePod',
    category: 'TECH',
    image: 'https://m.media-amazon.com/images/I/51+JgM-8+dL._AC_SL1000_.jpg',
    price: '$299',
    affiliateLink: 'https://www.blazepod.com/',
    coachsTake: "Train your reaction time, not just your body. If you can't react, you can't guard."
  },
  {
    id: 'whoop_band',
    name: '4.0 Recovery Tracker',
    brand: 'WHOOP',
    category: 'TECH',
    image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&q=80',
    price: 'Subscription',
    affiliateLink: 'https://www.whoop.com/',
    coachsTake: "It doesn't track steps; it tracks Strain and Sleep. Know exactly how hard to push today."
  },
  {
    id: 'dribbleup_ball',
    name: 'Smart Basketball',
    brand: 'DribbleUp',
    category: 'TECH',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    price: '$99',
    affiliateLink: 'https://dribbleup.com/',
    coachsTake: 'Gamify your handle. The camera tracks the ball speed and crossover rep count in real-time.'
  },
  {
    id: 'sony_xm5',
    name: 'WH-1000XM5',
    brand: 'Sony',
    category: 'TECH',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    price: '$398',
    affiliateLink: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
    coachsTake: 'Required hardware for the Frequencies section. Best-in-class noise cancellation for deep focus.'
  },

  // --- COURT (Tactical Gear) ---
  {
    id: 'grip_spritz',
    name: 'Traction Spray',
    brand: 'Grip Spritz',
    category: 'COURT',
    image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80',
    price: '$19',
    affiliateLink: 'https://gripspritz.com/',
    coachsTake: 'Dusty courts cause injuries. One spray gives you "Game 7" traction on any gym floor.'
  },
  {
    id: 'wilson_evo',
    name: 'Evolution Game Ball',
    brand: 'Wilson',
    category: 'COURT',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    price: '$79',
    affiliateLink: 'https://www.wilson.com/',
    coachsTake: 'The industry standard. If you bring a ball to the gym, make sure it is this one.'
  },
  {
    id: 'sklz_ladder',
    name: 'Quick Ladder Pro',
    brand: 'SKLZ',
    category: 'COURT',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    price: '$35',
    affiliateLink: 'https://www.sklz.com/',
    coachsTake: 'Footwork wins games. 10 minutes of ladder drills daily transforms your first step.'
  },

  // --- BODY (Strength & Armor) ---
  {
    id: 'weight_vest',
    name: 'Hyper Vest PRO',
    brand: 'Hyperwear',
    category: 'BODY',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    price: '$199',
    affiliateLink: 'https://hyperwear.com/',
    coachsTake: 'Thin enough to wear *under* your jersey during practice. Train heavy, play light.'
  },
  {
    id: 'mcdavid_kneepad',
    name: 'HEX Knee Pads',
    brand: 'McDavid',
    category: 'BODY',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80',
    price: '$35',
    affiliateLink: 'https://www.mcdavidusa.com/',
    coachsTake: 'Confidence is key. Dive for loose balls without hesitation.'
  },
  {
    id: 'resistance_bands',
    name: 'X-Over Resistance Bands',
    brand: 'WODFitters',
    category: 'BODY',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',
    price: '$45',
    affiliateLink: 'https://wodfitters.com/',
    coachsTake: 'Activate your glutes before every session. Cold muscles are injured muscles.'
  },

  // --- FUEL (Internal Performance) ---
  {
    id: 'thorne_creatine',
    name: 'Creatine Monohydrate',
    brand: 'Thorne',
    category: 'FUEL',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80',
    price: '$40',
    affiliateLink: 'https://www.thorne.com/products/dp/creatine',
    coachsTake: 'The only supplement proven to increase explosive power. NSF Certified, so it is safe for pros.'
  },
  {
    id: 'momentous_whey',
    name: 'Essential Grass-Fed Whey',
    brand: 'Momentous',
    category: 'FUEL',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
    price: '$60',
    affiliateLink: 'https://www.livemomentous.com/products/essential-grass-fed-whey-protein',
    coachsTake: 'Absorption is everything. This is the cleanest isolate on the market. No bloating, just recovery.'
  },
  {
    id: 'cheribundi_concentrate',
    name: 'Tart Cherry Concentrate',
    brand: 'Cheribundi',
    category: 'FUEL',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&q=80',
    price: '$35',
    affiliateLink: 'https://cheribundi.com/products/pure-concentrate',
    coachsTake: 'The secret weapon of 30+ pro teams. Drastically reduces inflammation and improves sleep quality.'
  },
  {
    id: 'magnesium_bisglycinate',
    name: 'Magnesium Bisglycinate',
    brand: 'Thorne',
    category: 'FUEL',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
    price: '$45',
    affiliateLink: 'https://www.thorne.com/products/dp/magnesium-bisglycinate',
    coachsTake: 'If you cramp, you are deficient. This form relaxes the nervous system for deep restorative sleep.'
  }
];
