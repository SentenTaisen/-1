export interface CoffeeItem {
  id: string;
  name: string;
  subname: string;
  tag: string;
  category: 'FLASH_CHILL' | 'SINGLE_ORIGIN' | 'AEROPRESS' | 'SIGNATURE_TONIC' | 'WHOLE_BEAN';
  price: number;
  rating: number;
  reviewsCount: number;
  roastIntensity: number; // 1 to 5
  process: string;
  origin: string;
  altitude: string;
  varietal: string;
  tastingNotes: string[];
  description: string;
  defaultTemp: 'Nitro Chilled (2°C)' | 'Precision Extract (93.5°C)' | 'Ambient (8°C)';
  image: string;
  isSpecialty?: boolean;
  specialtyGradient?: string;
  badge?: string;
  telemetry: {
    extractionTime: string;
    ratio: string;
    tds: string;
    pressure: string;
    grindMicrons: number;
  };
  flavorProfile: {
    acidity: number; // 0-100
    sweetness: number;
    body: number;
    floral: number;
    clarity: number;
  };
}

export const COFFEE_MENU: CoffeeItem[] = [
  {
    id: 'nitro-black-obsidian',
    name: 'Obsidian Nitro Cold Brew',
    subname: 'Cryogenic Flash-Chill & 24hr Slow Drip',
    tag: 'FLASH CHILL',
    category: 'FLASH_CHILL',
    price: 6.85,
    rating: 4.96,
    reviewsCount: 312,
    roastIntensity: 3,
    process: 'Cryo-Macerated Anaerobic',
    origin: 'Tarrazú, Costa Rica',
    altitude: '1,950m MASL',
    varietal: 'Geisha & Caturra',
    tastingNotes: ['Black Cherry', 'Dark Cacao', 'Velvet Molasses', 'Sweet Tobacco'],
    description: 'Extracted using a 24-hour chilled drip towers in our climate-sealed lab, charged with micro-nitrogen bubbles for a Guinness-like cascading crema foam.',
    defaultTemp: 'Nitro Chilled (2°C)',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    badge: 'SIGNATURE NITRO',
    telemetry: {
      extractionTime: '24 Hours',
      ratio: '1:8.5 Concentrate',
      tds: '2.15%',
      pressure: '3.4 Bar Nitrogen',
      grindMicrons: 520,
    },
    flavorProfile: {
      acidity: 45,
      sweetness: 88,
      body: 92,
      floral: 40,
      clarity: 82,
    },
  },
  {
    id: 'yirgacheffe-bloom',
    name: 'Ethiopian Yirgacheffe G1',
    subname: 'Gedeb Chelchele Micro-Lot',
    tag: 'LIGHT ETHIOPIAN',
    category: 'SINGLE_ORIGIN',
    price: 7.50,
    rating: 4.98,
    reviewsCount: 189,
    roastIntensity: 1,
    process: 'Double Washed & Sun Dried on Raised Beds',
    origin: 'Gedeb, Yirgacheffe, Ethiopia',
    altitude: '2,200m MASL',
    varietal: 'Heirloom Indigenous',
    tastingNotes: ['Bergamot Blossom', 'White Peach', 'Wild Jasmine', 'Meyer Lemon'],
    description: 'Delicate, tea-like clarity with intoxicating floral aromatics. Hand-poured using our Kalita Wave 185 brass dripper at exactly 93.8°C with remineralized magnesium water.',
    defaultTemp: 'Precision Extract (93.5°C)',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    isSpecialty: true,
    specialtyGradient: 'from-[#ff9f43]/20 via-[#a78bfa]/15 to-[#141721]',
    badge: '94.2 PTS SQA',
    telemetry: {
      extractionTime: '3m 15s',
      ratio: '1:16.2',
      tds: '1.41%',
      pressure: 'Gravity Pour',
      grindMicrons: 420,
    },
    flavorProfile: {
      acidity: 92,
      sweetness: 78,
      body: 55,
      floral: 98,
      clarity: 96,
    },
  },
  {
    id: 'pink-bourbon-aeropress',
    name: 'Huila Pink Bourbon',
    subname: 'Thermal Shock Anaerobic Fermentation',
    tag: 'AEROPRESS',
    category: 'AEROPRESS',
    price: 8.20,
    rating: 4.95,
    reviewsCount: 94,
    roastIntensity: 2,
    process: 'Thermal Shock 72hr Ferment',
    origin: 'San Adolfo, Huila, Colombia',
    altitude: '1,820m MASL',
    varietal: 'Pink Bourbon Elite',
    tastingNotes: ['Papaya', 'Pink Grapefruit', 'Cardamom', 'Cane Sugar'],
    description: 'Inverted Aeropress chamber brew with ultra-fine metal mesh. Captures high fruit brightness and sparkling acidity with a silky, syrupy mouthfeel.',
    defaultTemp: 'Precision Extract (93.5°C)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isSpecialty: true,
    specialtyGradient: 'from-[#f43f5e]/20 via-[#ff9f43]/20 to-[#141721]',
    badge: 'CUP OF EXCELLENCE #4',
    telemetry: {
      extractionTime: '2m 10s',
      ratio: '1:14.5',
      tds: '1.58%',
      pressure: 'Manual 1.5 Bar',
      grindMicrons: 360,
    },
    flavorProfile: {
      acidity: 88,
      sweetness: 90,
      body: 74,
      floral: 85,
      clarity: 90,
    },
  },
  {
    id: 'geisha-zenith-reserve',
    name: 'Panama Hacienda La Esmeralda',
    subname: 'Mario Geisha Micro-Lot Reserve',
    tag: 'RESERVE GEISHA',
    category: 'WHOLE_BEAN',
    price: 18.00,
    rating: 5.0,
    reviewsCount: 78,
    roastIntensity: 2,
    process: 'Natural Anaerobic Slow Dried',
    origin: 'Boquete, Chiriquí, Panama',
    altitude: '1,850m MASL',
    varietal: 'Green Tip Geisha',
    tastingNotes: ['Mandarin Blossom', 'Apricot Jam', 'Lemongrass', 'Earl Grey'],
    description: 'The pinnacle of world specialty coffee. Harvested exclusively from single sun-drenched terraced slopes, packed in inert nitrogen-flushed matte obsidian tins.',
    defaultTemp: 'Precision Extract (93.5°C)',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    isSpecialty: true,
    specialtyGradient: 'from-[#a78bfa]/25 via-[#00f2fe]/15 to-[#141721]',
    badge: 'ONLY 80 TINS MINTED',
    telemetry: {
      extractionTime: '3m 30s',
      ratio: '1:16.8',
      tds: '1.38%',
      pressure: 'Precision Cone',
      grindMicrons: 450,
    },
    flavorProfile: {
      acidity: 95,
      sweetness: 94,
      body: 62,
      floral: 100,
      clarity: 98,
    },
  },
  {
    id: 'electric-espresso-tonic',
    name: 'Electric Nitrogen Tonic',
    subname: 'Double Shot Over Artisanal Botanical Tonic',
    tag: 'SIGNATURE TONIC',
    category: 'SIGNATURE_TONIC',
    price: 7.20,
    rating: 4.91,
    reviewsCount: 165,
    roastIntensity: 2,
    process: 'Double Ristretto + Quinine & Kaffir Lime',
    origin: 'Sidama, Ethiopia + Rwanda Nyamagabe',
    altitude: '2,050m MASL',
    varietal: 'Blend 70/30',
    tastingNotes: ['Candied Citrus', 'Chilled Juniper', 'Caramelized Crema', 'Sparkling Quinine'],
    description: 'A layered nocturnal visual spectacle. Crystal-clear ice pillar, chilled botanical tonic water, topped with a dense crema pour of pressurized Sidama ristretto.',
    defaultTemp: 'Nitro Chilled (2°C)',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    badge: 'BARISTA SPEC 04',
    telemetry: {
      extractionTime: '24s Ristretto',
      ratio: '1:1.8',
      tds: '9.4% (Espresso)',
      pressure: '9.3 Bar',
      grindMicrons: 210,
    },
    flavorProfile: {
      acidity: 86,
      sweetness: 82,
      body: 68,
      floral: 80,
      clarity: 88,
    },
  },
  {
    id: 'obsidian-velvet-flat-white',
    name: 'Velvet Flat White (9 Bar)',
    subname: 'Microfoam Textured to 62°C',
    tag: 'CRAFT ESPRESSO',
    category: 'SIGNATURE_TONIC',
    price: 6.25,
    rating: 4.94,
    reviewsCount: 420,
    roastIntensity: 3,
    process: 'Honey Processed Brazil + Colombia',
    origin: 'Cerrado Mineiro & Huila',
    altitude: '1,400m MASL',
    varietal: 'Yellow Catuai / Bourbon',
    tastingNotes: ['Roasted Hazelnut', 'Salted Toffee', 'Milk Chocolate', 'Pecan'],
    description: 'Double ristretto extracted at 9.2 Bar with a 6-second pre-infusion, harmonized with silky microfoam poured with minimalist geometric latte art.',
    defaultTemp: 'Precision Extract (93.5°C)',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    badge: 'POPULAR DAILY',
    telemetry: {
      extractionTime: '27s',
      ratio: '1:2.0',
      tds: '8.8%',
      pressure: '9.2 Bar',
      grindMicrons: 225,
    },
    flavorProfile: {
      acidity: 48,
      sweetness: 85,
      body: 90,
      floral: 35,
      clarity: 70,
    },
  },
  {
    id: 'kyoto-slow-drip-spirit',
    name: 'Kyoto 18hr Ice Tower',
    subname: 'Single Drop per Second Cold Extraction',
    tag: 'FLASH CHILL',
    category: 'FLASH_CHILL',
    price: 8.50,
    rating: 4.97,
    reviewsCount: 142,
    roastIntensity: 4,
    process: 'Extended Slow Gravity Pyrex Drip',
    origin: 'Antigua, Guatemala',
    altitude: '1,700m MASL',
    varietal: 'Bourbon & Typica',
    tastingNotes: ['Bourbon Oak', 'Dark Plum', 'Dark Chocolate Truffle', 'Cinnamon Bark'],
    description: 'Extracted drop-by-drop through volcanic stone filtered water over 18 hours in our open-view laboratory glass towers. Ultra smooth with zero bitterness.',
    defaultTemp: 'Nitro Chilled (2°C)',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED 20 BOTTLES/DAY',
    telemetry: {
      extractionTime: '18h 00m',
      ratio: '1:10.0',
      tds: '1.92%',
      pressure: 'Gravity Droplet',
      grindMicrons: 480,
    },
    flavorProfile: {
      acidity: 52,
      sweetness: 90,
      body: 88,
      floral: 45,
      clarity: 84,
    },
  },
  {
    id: 'guatemala-geisha-tin',
    name: 'Acatenango Volcanic Beans (250g)',
    subname: 'Whole Bean Nitrogen-Sealed Tin',
    tag: 'WHOLE BEAN',
    category: 'WHOLE_BEAN',
    price: 24.00,
    rating: 4.99,
    reviewsCount: 110,
    roastIntensity: 2,
    process: 'Washed Extended Ferment',
    origin: 'Acatenango Valley, Guatemala',
    altitude: '2,000m MASL',
    varietal: 'San Ramon & Typica',
    tastingNotes: ['Green Apple Crisp', 'Red Currant', 'Raw Cocoa', 'Orange Blossom'],
    description: 'Whole roasted beans sealed inside our recyclable matte obsidian tin with a one-way aroma preservation valve. Roasted on our Loring S15 Kestrel.',
    defaultTemp: 'Ambient (8°C)',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    badge: 'ROASTED 48H AGO',
    telemetry: {
      extractionTime: 'Roast Dev 12.8%',
      ratio: 'Agtron 74/88',
      tds: 'Moisture 10.4%',
      pressure: 'Nitrogen Sealed',
      grindMicrons: 0,
    },
    flavorProfile: {
      acidity: 82,
      sweetness: 86,
      body: 70,
      floral: 76,
      clarity: 92,
    },
  },
];

export interface BrewCustomization {
  grind: 'Whole Bean' | 'Coarse (French/Chemex)' | 'Espresso Fine (9 Bar)' | 'Cold Extraction Ultra-Fine';
  milk: 'None (Black Terroir)' | 'Oat M*lk Microfoam' | 'Macadamia Silken Cream' | 'Whole Jersey Farm Milk';
  sweetener: 'None / Pure' | 'Vanilla Infused Panela' | 'Lavender Honey Nectar';
  temperature: 'Nitro Chilled (2°C)' | 'Ambient (8°C)' | 'Precision Extract (93.5°C)';
  extraShots: number;
  nitrogenBoost: boolean;
  notes: string;
  quantity: number;
}

export interface CartItem {
  cartItemId: string;
  coffee: CoffeeItem;
  customization: BrewCustomization;
  calculatedPrice: number;
}
