/**
 * Product data with S3 image keys
 * Database stores ONLY the S3 key (e.g., "idols/krishna.jpeg")
 * Backend generates the full S3 URL
 * Frontend receives complete imageUrl from backend
 */

export const productKeys = {
  keychains: [
    { id: 'kc1', name: 'Custom Name Keychain', price: 199, icon: 'fa-key', description: 'Personalized name keychain with custom text', imageKey: 'keychains/custom-name.jpg' },
    { id: 'kc2', name: 'Logo Keychain', price: 249, icon: 'fa-tag', description: 'Custom logo keychain for businesses', imageKey: 'keychains/logo.jpg' },
    { id: 'kc3', name: 'Photo Keychain', price: 299, icon: 'fa-image', description: 'Keychain with your favorite photo', imageKey: 'keychains/photo.jpg' },
    { id: 'kc4', name: 'Designer Keychain', price: 349, icon: 'fa-star', description: 'Stylish designer keychain collection', imageKey: 'keychains/designer.jpg' },
    { id: 'kc4a', name: 'Luxury Designer Keychain', price: 449, icon: 'fa-gem', description: 'Premium luxury designer keychain with crystals', imageKey: 'keychains/luxury.jpg' },
    { id: 'kc4b', name: 'Geometric Designer Keychain', price: 399, icon: 'fa-shapes', description: 'Modern geometric pattern designer keychain', imageKey: 'keychains/geometric.jpg' },
    { id: 'kc4c', name: 'Minimalist Designer Keychain', price: 329, icon: 'fa-minus', description: 'Sleek minimalist designer keychain', imageKey: 'keychains/minimalist.jpg' },
    { id: 'kc4d', name: 'Vintage Designer Keychain', price: 379, icon: 'fa-clock', description: 'Classic vintage style designer keychain', imageKey: 'keychains/vintage.jpg' },
    { id: 'kc5', name: 'Heart Shape Keychain', price: 279, icon: 'fa-heart', description: 'Beautiful heart-shaped keychain', imageKey: 'keychains/heart.jpg' },
    { id: 'kc6', name: 'Car Logo Keychain', price: 399, icon: 'fa-car', description: 'Premium car brand logo keychains', imageKey: 'keychains/car-logo.jpg' },
    { id: 'kc7', name: 'Initial Keychain', price: 229, icon: 'fa-font', description: 'Elegant single letter initial keychain', imageKey: 'keychains/initial.jpg' },
    { id: 'kc8', name: 'Couple Keychain Set', price: 499, icon: 'fa-user-friends', description: 'Matching keychain set for couples', imageKey: 'keychains/couple-set.jpg' },
  ],
  superhero: [
    { id: 'sh1', name: 'Iron Man Figure', price: 1299, icon: 'fa-robot', description: 'Detailed Iron Man action figure', imageKey: 'superhero/ironman.jpg' },
    { id: 'sh2', name: 'Spider-Man Model', price: 1199, icon: 'fa-spider', description: 'Amazing Spider-Man collectible', imageKey: 'superhero/spiderman.jpg' },
    { id: 'sh3', name: 'Batman Statue', price: 1399, icon: 'fa-bat', description: 'Dark Knight premium statue', imageKey: 'superhero/batman.jpg' },
    { id: 'sh4', name: 'Captain America', price: 1499, icon: 'fa-shield-alt', description: 'First Avenger shield included', imageKey: 'superhero/captain-america.jpg' },
    { id: 'sh5', name: 'Thor Figure', price: 1349, icon: 'fa-bolt', description: 'God of Thunder with hammer', imageKey: 'superhero/thor.jpg' },
    { id: 'sh6', name: 'Hulk Model', price: 1449, icon: 'fa-fist-raised', description: 'The Incredible Hulk figure', imageKey: 'superhero/hulk.jpg' },
    { id: 'sh7', name: 'Wonder Woman', price: 1299, icon: 'fa-female', description: 'Amazonian warrior princess', imageKey: 'superhero/wonderwoman.jpg' },
    { id: 'sh8', name: 'Superman Statue', price: 1399, icon: 'fa-s', description: 'Man of Steel collectible', imageKey: 'superhero/superman.jpg' },
  ],
  devotional: [
    { id: 'dv1', name: 'Ganesha Idol', price: 899, icon: 'fa-om', description: 'Lord Ganesha blessing idol', imageKey: 'idols/ganesha.jpg' },
    { id: 'dv2', name: 'Buddha Statue', price: 1099, icon: 'fa-praying-hands', description: 'Peaceful Buddha meditation statue', imageKey: 'idols/buddha.jpg' },
    { id: 'dv3', name: 'Lakshmi Figure', price: 799, icon: 'fa-lotus', description: 'Goddess of wealth and prosperity', imageKey: 'idols/lakshmi.jpg' },
    { id: 'dv4', name: 'Hanuman Idol', price: 949, icon: 'fa-hands-praying', description: 'Powerful Hanuman deity', imageKey: 'idols/hanuman.jpg' },
    { id: 'dv5', name: 'Shiva Lingam', price: 1199, icon: 'fa-om', description: 'Sacred Shiva Lingam statue', imageKey: 'idols/shiva.jpg' },
    { id: 'dv6', name: 'Krishna Idol', price: 799, icon: 'fa-feather', description: 'Lord Krishna with flute', imageKey: 'idols/krishna.jpg' },
    { id: 'dv7', name: 'Durga Maa', price: 1099, icon: 'fa-hand-holding-heart', description: 'Divine Mother Durga', imageKey: 'idols/durga.jpg' },
    { id: 'dv8', name: 'Saraswati Figure', price: 899, icon: 'fa-book', description: 'Goddess of knowledge', imageKey: 'idols/saraswati.jpg' },
  ],
  toys: [
    { id: 'ty1', name: 'Puzzle Cube', price: 399, icon: 'fa-cube', description: '3D printed puzzle cube toy', imageKey: 'toys/puzzle.jpg' },
    { id: 'ty2', name: 'Action Figure', price: 599, icon: 'fa-user-ninja', description: 'Customizable action figure', imageKey: 'toys/action.jpg' },
    { id: 'ty3', name: 'Educational Toy', price: 449, icon: 'fa-graduation-cap', description: 'Learning and fun combined', imageKey: 'toys/educational.jpg' },
    { id: 'ty4', name: 'Building Blocks', price: 699, icon: 'fa-cubes', description: 'Creative building block set', imageKey: 'toys/blocks.jpg' },
    { id: 'ty5', name: 'Racing Car', price: 549, icon: 'fa-car-side', description: 'Fast racing car toy', imageKey: 'toys/car.jpg' },
    { id: 'ty6', name: 'Dinosaur Set', price: 799, icon: 'fa-dragon', description: 'Collection of dinosaur figures', imageKey: 'toys/dinosaur.jpg' },
    { id: 'ty7', name: 'Robot Toy', price: 649, icon: 'fa-robot', description: 'Interactive robot toy', imageKey: 'toys/robot.jpg' },
    { id: 'ty8', name: 'Animal Figures', price: 499, icon: 'fa-paw', description: 'Cute animal figure collection', imageKey: 'toys/animals.jpg' },
  ],
  lamps: [
    { id: 'lamp1', name: 'Geometric Lamp', price: 1299, icon: 'fa-lightbulb', description: 'Modern geometric design lamp', imageKey: 'lamps/geometric.jpg' },
    { id: 'lamp2', name: 'Moon Lamp', price: 999, icon: 'fa-moon', description: 'Beautiful moon-shaped lamp', imageKey: 'lamps/moon.jpg' },
    { id: 'lamp3', name: 'Star Lamp', price: 1199, icon: 'fa-star', description: 'Twinkling star-shaped lamp', imageKey: 'lamps/star.jpg' },
    { id: 'lamp4', name: 'Heart Lamp', price: 899, icon: 'fa-heart', description: 'Romantic heart-shaped lamp', imageKey: 'lamps/heart.jpg' },
    { id: 'lamp5', name: 'Cloud Lamp', price: 1099, icon: 'fa-cloud', description: 'Dreamy cloud-shaped lamp', imageKey: 'lamps/cloud.jpg' },
    { id: 'lamp6', name: 'Crystal Lamp', price: 1499, icon: 'fa-gem', description: 'Elegant crystal design lamp', imageKey: 'lamps/crystal.jpg' },
    { id: 'lamp7', name: 'Desk Lamp', price: 799, icon: 'fa-desktop', description: 'Functional desk lamp', imageKey: 'lamps/desk.jpg' },
    { id: 'lamp8', name: 'Night Lamp', price: 699, icon: 'fa-bed', description: 'Soothing night lamp', imageKey: 'lamps/night.jpg' },
  ],
  flowerpots: [
    { id: 'fp1', name: 'Hanging Planter', price: 599, icon: 'fa-seedling', description: 'Elegant hanging planter', imageKey: 'flowerpots/hanging.jpg' },
    { id: 'fp2', name: 'Desktop Planter', price: 399, icon: 'fa-leaf', description: 'Compact desktop planter', imageKey: 'flowerpots/desktop.jpg' },
    { id: 'fp3', name: 'Large Floor Planter', price: 1299, icon: 'fa-tree', description: 'Spacious floor planter', imageKey: 'flowerpots/floor.jpg' },
    { id: 'fp4', name: 'Geometric Planter', price: 699, icon: 'fa-shapes', description: 'Modern geometric planter', imageKey: 'flowerpots/geometric.jpg' },
    { id: 'fp5', name: 'Decorative Pot Set', price: 899, icon: 'fa-spa', description: 'Beautiful decorative pot set', imageKey: 'flowerpots/decorative-set.jpg' },
    { id: 'fp6', name: 'Minimalist Planter', price: 549, icon: 'fa-minus', description: 'Simple minimalist planter', imageKey: 'flowerpots/minimalist.jpg' },
    { id: 'fp7', name: 'Vintage Planter', price: 799, icon: 'fa-clock', description: 'Classic vintage planter', imageKey: 'flowerpots/vintage.jpg' },
    { id: 'fp8', name: 'Modern Planter', price: 849, icon: 'fa-cube', description: 'Contemporary modern planter', imageKey: 'flowerpots/modern.jpg' },
  ],
  homedecor: [
    { id: 'hd1', name: 'Wall Art', price: 999, icon: 'fa-palette', description: 'Beautiful 3D wall art', imageKey: 'homedecor/wall-art.jpg' },
    { id: 'hd2', name: 'Desk Organizer', price: 599, icon: 'fa-box', description: 'Stylish desk organizer', imageKey: 'homedecor/desk-organizer.jpg' },
    { id: 'hd3', name: 'Photo Frame', price: 499, icon: 'fa-image', description: 'Custom photo frame', imageKey: 'homedecor/photo-frame.jpg' },
    { id: 'hd4', name: 'Clock', price: 1299, icon: 'fa-clock', description: 'Modern wall clock', imageKey: 'homedecor/clock.jpg' },
    { id: 'hd5', name: 'Vase', price: 799, icon: 'fa-wine-bottle', description: 'Decorative vase', imageKey: 'homedecor/vase.jpg' },
    { id: 'hd6', name: 'Candle Holder', price: 699, icon: 'fa-fire', description: 'Elegant candle holder', imageKey: 'homedecor/candle-holder.jpg' },
    { id: 'hd7', name: 'Bookend', price: 899, icon: 'fa-book', description: 'Decorative bookend set', imageKey: 'homedecor/bookend.jpg' },
    { id: 'hd8', name: 'Sculpture', price: 1499, icon: 'fa-monument', description: 'Abstract sculpture', imageKey: 'homedecor/sculpture.jpg' },
  ],
  jewelry: [
    { id: 'jw1', name: 'Custom Pendant', price: 799, icon: 'fa-gem', description: 'Personalized pendant', imageKey: 'jewelry/pendant.jpg' },
    { id: 'jw2', name: 'Ring', price: 999, icon: 'fa-ring', description: 'Custom designed ring', imageKey: 'jewelry/ring.jpg' },
    { id: 'jw3', name: 'Bracelet', price: 699, icon: 'fa-hand-sparkles', description: 'Stylish bracelet', imageKey: 'jewelry/bracelet.jpg' },
    { id: 'jw4', name: 'Earrings', price: 899, icon: 'fa-heart', description: 'Beautiful earrings', imageKey: 'jewelry/earrings.jpg' },
    { id: 'jw5', name: 'Necklace', price: 1299, icon: 'fa-star', description: 'Elegant necklace', imageKey: 'jewelry/necklace.jpg' },
    { id: 'jw6', name: 'Brooch', price: 599, icon: 'fa-gem', description: 'Decorative brooch', imageKey: 'jewelry/brooch.jpg' },
    { id: 'jw7', name: 'Cufflinks', price: 799, icon: 'fa-link', description: 'Premium cufflinks', imageKey: 'jewelry/cufflinks.jpg' },
    { id: 'jw8', name: 'Anklet', price: 699, icon: 'fa-shoe-prints', description: 'Delicate anklet', imageKey: 'jewelry/anklet.jpg' },
  ],
  phoneaccessories: [
    { id: 'ph1', name: 'Phone Stand', price: 399, icon: 'fa-mobile-alt', description: 'Adjustable phone stand', imageKey: 'phone-accessories/stand.jpg' },
    { id: 'ph2', name: 'Custom Case', price: 699, icon: 'fa-mobile', description: 'Personalized phone case', imageKey: 'phone-accessories/case.jpg' },
    { id: 'ph3', name: 'Pop Socket', price: 249, icon: 'fa-circle', description: 'Custom pop socket', imageKey: 'phone-accessories/pop-socket.jpg' },
    { id: 'ph4', name: 'Cable Organizer', price: 299, icon: 'fa-plug', description: 'Cable management holder', imageKey: 'phone-accessories/cable-organizer.jpg' },
    { id: 'ph5', name: 'Wireless Charger Stand', price: 999, icon: 'fa-charging-station', description: 'Wireless charging stand', imageKey: 'phone-accessories/wireless-charger.jpg' },
    { id: 'ph6', name: 'Ring Holder', price: 349, icon: 'fa-hand-pointer', description: 'Phone ring holder', imageKey: 'phone-accessories/ring-holder.jpg' },
    { id: 'ph7', name: 'Grip Handle', price: 449, icon: 'fa-hand-rock', description: 'Comfortable grip handle', imageKey: 'phone-accessories/grip.jpg' },
    { id: 'ph8', name: 'Card Holder', price: 399, icon: 'fa-credit-card', description: 'Phone card holder', imageKey: 'phone-accessories/card-holder.jpg' },
  ],
  office: [
    { id: 'of1', name: 'Pen Holder', price: 499, icon: 'fa-pen', description: 'Organized pen holder', imageKey: 'office/pen-holder.jpg' },
    { id: 'of2', name: 'Business Card Holder', price: 399, icon: 'fa-id-card', description: 'Professional card holder', imageKey: 'office/card-holder.jpg' },
    { id: 'of3', name: 'Desk Calendar', price: 699, icon: 'fa-calendar', description: 'Custom desk calendar', imageKey: 'office/calendar.jpg' },
    { id: 'of4', name: 'Paper Weight', price: 599, icon: 'fa-weight', description: 'Decorative paper weight', imageKey: 'office/paperweight.jpg' },
    { id: 'of5', name: 'Laptop Stand', price: 1299, icon: 'fa-laptop', description: 'Ergonomic laptop stand', imageKey: 'office/laptop-stand.jpg' },
    { id: 'of6', name: 'Monitor Stand', price: 1499, icon: 'fa-desktop', description: 'Monitor riser stand', imageKey: 'office/monitor-stand.jpg' },
    { id: 'of7', name: 'Cable Clips', price: 299, icon: 'fa-paperclip', description: 'Cable management clips', imageKey: 'office/cable-clips.jpg' },
    { id: 'of8', name: 'Name Plate', price: 799, icon: 'fa-user-tag', description: 'Professional name plate', imageKey: 'office/nameplate.jpg' },
  ],
};

/**
 * Simulates backend S3 URL generation
 * In production, this happens on the backend
 * Backend code: 
 * const imageUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${imageKey}`;
 */
const S3_BUCKET = 'robohatch-product-images';
const S3_REGION = 'eu-north-1';

export function generateS3Url(imageKey) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${imageKey}`;
}

/**
 * Transform product keys to include imageUrl (simulates backend response)
 * In production, backend does this transformation
 */
export function transformProductsWithUrls(products) {
  return products.map(product => ({
    ...product,
    imageUrl: generateS3Url(product.imageKey),
  }));
}

export default productKeys;
