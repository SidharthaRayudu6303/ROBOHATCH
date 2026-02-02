/**
 * Product Categories Configuration
 * Central source of truth for all product categories
 */

const CATEGORIES = [
  {
    id: 'devotional-idols',
    name: 'Devotional Idols',
    description: '3D printed spiritual idols and deities',
    icon: 'fa-om',
    active: true,
    featured: true,
    products: [
      { id: 'ganesha-idol', name: 'Ganesha Idol', price: 299 },
      { id: 'krishna-idol', name: 'Krishna Idol', price: 349 },
      { id: 'buddha-statue', name: 'Buddha Statue', price: 399 },
      { id: 'shiva-linga', name: 'Shiva Linga', price: 249 },
      { id: 'durga-maa', name: 'Durga Maa', price: 449 },
      { id: 'lakshmi-idol', name: 'Lakshmi Idol', price: 349 },
      { id: 'saraswati-idol', name: 'Saraswati Idol', price: 349 },
      { id: 'hanuman-statue', name: 'Hanuman Statue', price: 399 }
    ]
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    description: 'Modern 3D printed planters',
    icon: 'fa-seedling',
    active: true,
    featured: true,
    products: [
      { id: 'geometric-planter', name: 'Geometric Planter', price: 199 },
      { id: 'hanging-planter', name: 'Hanging Planter', price: 249 },
      { id: 'decorative-pot-set', name: 'Decorative Pot Set', price: 499 },
      { id: 'large-floor-planter', name: 'Large Floor Planter', price: 599 }
    ]
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    description: 'Stylish home decoration items',
    icon: 'fa-home',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'jewelry-accessories',
    name: 'Jewelry & Accessories',
    description: 'Custom 3D printed jewelry',
    icon: 'fa-gem',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'keychains',
    name: 'Keychains',
    description: 'Personalized keychains',
    icon: 'fa-key',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'lamps',
    name: 'Lamps',
    description: '3D printed lighting solutions',
    icon: 'fa-lightbulb',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'office-supplies',
    name: 'Office Supplies',
    description: 'Professional desk accessories',
    icon: 'fa-briefcase',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'phone-accessories',
    name: 'Phone Accessories',
    description: 'Custom phone cases and stands',
    icon: 'fa-mobile-alt',
    active: true,
    featured: false,
    products: []
  },
  {
    id: 'superhero-models',
    name: 'Superhero Models',
    description: 'Collectible superhero figurines',
    icon: 'fa-mask',
    active: true,
    featured: true,
    products: []
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    description: 'Fun 3D printed toys',
    icon: 'fa-gamepad',
    active: true,
    featured: false,
    products: []
  }
]

/**
 * Get all active categories
 */
export function getActiveCategories() {
  return CATEGORIES.filter(cat => cat.active)
}

/**
 * Get featured categories
 */
export function getFeaturedCategories() {
  return CATEGORIES.filter(cat => cat.active && cat.featured)
}

/**
 * Get category by ID
 */
export function getCategoryById(id) {
  return CATEGORIES.find(cat => cat.id === id)
}

/**
 * Get all categories
 */
export function getAllCategories() {
  return CATEGORIES
}

export default CATEGORIES
