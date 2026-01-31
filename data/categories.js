export const defaultCategories = [
  {
    id: 'cat1',
    name: 'Keychains',
    key: 'keychains',
    icon: 'fa-key',
    link: '/keychains',
    items: [
      'Custom Name Keychain',
      'Logo Keychain',
      'Photo Keychain',
      'Designer Keychain',
      'Animal Keychains',
      'Car Brand Keychains',
      'Letter Keychains',
      'Sports Keychains'
    ]
  },
  {
    id: 'cat2',
    name: 'Superhero Models',
    key: 'superhero-models',
    icon: 'fa-mask',
    link: '/superhero-models',
    items: [
      'Iron Man Figure',
      'Spider-Man Model',
      'Batman Statue',
      'Captain America',
      'Wonder Woman',
      'Thor Figure',
      'Hulk Model',
      'Black Panther'
    ]
  },
  {
    id: 'cat3',
    name: 'Devotional Idols',
    key: 'devotional-idols',
    icon: 'fa-om',
    link: '/devotional',
    items: [
      'Ganesha Idol',
      'Buddha Statue',
      'Lakshmi Idol',
      'Hanuman Statue',
      'Krishna Idol',
      'Shiva Linga',
      'Saraswati Idol',
      'Durga Maa'
    ]
  },
  {
    id: 'cat4',
    name: 'Toys & Games',
    key: 'toys-games',
    icon: 'fa-gamepad',
    link: '/toys',
    items: [
      'Puzzle Cube',
      'Action Figure',
      'Educational Toy',
      'Building Blocks',
      'Board Game Pieces',
      'Mini Cars',
      'Dinosaur Models',
      'Robot Toys'
    ]
  },
  {
    id: 'cat5',
    name: 'Home Decor',
    key: 'home-decor',
    icon: 'fa-home',
    link: '/homedecor',
    items: [
      'Wall Art',
      'Decorative Vases',
      'Photo Frames',
      'Lamp Shades',
      'Plant Holders',
      'Clock Designs',
      'Candle Holders',
      'Bookends'
    ]
  },
  {
    id: 'cat6',
    name: 'Jewelry & Accessories',
    key: 'jewelry-accessories',
    icon: 'fa-gem',
    link: '/jewelry',
    items: [
      'Custom Pendants',
      'Earrings',
      'Bracelets',
      'Rings',
      'Brooches',
      'Hair Clips',
      'Cufflinks',
      'Anklets'
    ]
  },
  {
    id: 'cat7',
    name: 'Phone Accessories',
    key: 'phone-accessories',
    icon: 'fa-mobile-alt',
    link: '/phoneaccessories',
    items: [
      'Phone Stands',
      'Custom Cases',
      'Pop Sockets',
      'Cable Organizers',
      'Phone Grips',
      'Charging Docks',
      'Screen Protectors',
      'Camera Lens Covers'
    ]
  },
  {
    id: 'cat8',
    name: 'Office Supplies',
    key: 'office-supplies',
    icon: 'fa-briefcase',
    link: '/office',
    items: [
      'Pen Holders',
      'Business Card Holders',
      'Desk Organizers',
      'Paper Weights',
      'Cable Management',
      'Phone Docks',
      'Name Plates',
      'Letter Trays'
    ]
  },
  {
    id: 'cat9',
    name: 'Lamps',
    key: 'lamps',
    icon: 'fa-lightbulb',
    link: '/lamps',
    items: [
      'Geometric Lamp',
      'Moon Lamp',
      'Star Lamp',
      'Heart Lamp',
      'Cloud Lamp',
      'Cube Lamp',
      'Sphere Lamp',
      'Custom Name Lamp'
    ]
  },
  {
    id: 'cat10',
    name: 'Flower Pots',
    key: 'flower-pots',
    icon: 'fa-leaf',
    link: '/flowerpots',
    items: [
      'Modern Planter',
      'Hanging Planter',
      'Geometric Planter',
      'Mini Succulent Pot',
      'Large Floor Planter',
      'Wall Mount Planter',
      'Self-Watering Pot',
      'Decorative Pot Set'
    ]
  }
];

export function getActiveCategories() {
  if (typeof window === 'undefined') {
    return defaultCategories;
  }
  
  const removedCategories = JSON.parse(localStorage.getItem('removedCategories') || '[]');
  const customCategories = JSON.parse(localStorage.getItem('customCategories') || '[]');
  const categoryEdits = JSON.parse(localStorage.getItem('categoryEdits') || '{}');
  
  // Apply edits to default categories
  const editedCategories = defaultCategories
    .filter(cat => !removedCategories.includes(cat.id))
    .map(cat => ({
      ...cat,
      ...(categoryEdits[cat.id] || {})
    }));
  
  // Add custom categories
  const activeCustomCategories = customCategories
    .filter(cat => !removedCategories.includes(cat.id))
    .map(cat => ({
      ...cat,
      ...(categoryEdits[cat.id] || {})
    }));
  
  return [...editedCategories, ...activeCustomCategories];
}
