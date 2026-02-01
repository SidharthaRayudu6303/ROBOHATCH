# Fix All localStorage Cart Operations
# This script replaces localStorage cart operations with backend API calls

$files = @(
    'pages\product-category\devotional-idols\buddha-statue.js',
    'pages\product-category\devotional-idols\durga-maa.js',
    'pages\product-category\devotional-idols\ganesha-idol.js',
    'pages\product-category\devotional-idols\hanuman-statue.js',
    'pages\product-category\devotional-idols\krishna-idol.js',
    'pages\product-category\devotional-idols\lakshmi-idol.js',
    'pages\product-category\devotional-idols\saraswati-idol.js',
    'pages\product-category\devotional-idols\shiva-linga.js',
    'pages\product-category\flower-pots\decorative-pot-set.js',
    'pages\product-category\flower-pots\geometric-planter.js',
    'pages\product-category\flower-pots\hanging-planter.js',
    'pages\product-category\flower-pots\large-floor-planter.js',
    'pages\product-category\flower-pots\mini-succulent-pot.js',
    'pages\product-category\flower-pots\modern-planter.js',
    'pages\product-category\flower-pots\self-watering-pot.js',
    'pages\product-category\flower-pots\wall-mount-planter.js',
    'pages\product-category\home-decor\bookends.js',
    'pages\product-category\home-decor\candle-holders.js',
    'pages\product-category\home-decor\clock-designs.js',
    'pages\product-category\home-decor\decorative-vases.js',
    'pages\product-category\home-decor\lamp-shades.js',
    'pages\product-category\home-decor\photo-frames.js',
    'pages\product-category\home-decor\plant-holders.js',
    'pages\product-category\home-decor\wall-art.js',
    'pages\product-category\jewelry-accessories\anklets.js',
    'pages\product-category\jewelry-accessories\bracelets.js',
    'pages\product-category\jewelry-accessories\brooches.js',
    'pages\product-category\jewelry-accessories\cufflinks.js',
    'pages\product-category\jewelry-accessories\custom-pendants.js',
    'pages\product-category\jewelry-accessories\earrings.js',
    'pages\product-category\jewelry-accessories\hair-clips.js',
    'pages\product-category\jewelry-accessories\rings.js',
    'pages\product-category\keychains\animal-keychains.js',
    'pages\product-category\keychains\car-brand-keychains.js',
    'pages\product-category\keychains\custom-name-keychain.js',
    'pages\product-category\keychains\designer-keychain.js',
    'pages\product-category\keychains\letter-keychains.js',
    'pages\product-category\keychains\logo-keychain.js',
    'pages\product-category\keychains\photo-keychain.js',
    'pages\product-category\keychains\sports-keychains.js',
    'pages\product-category\lamps\cloud-lamp.js',
    'pages\product-category\lamps\cube-lamp.js',
    'pages\product-category\lamps\custom-name-lamp.js',
    'pages\product-category\lamps\geometric-lamp.js',
    'pages\product-category\lamps\heart-lamp.js',
    'pages\product-category\lamps\moon-lamp.js',
    'pages\product-category\lamps\sphere-lamp.js',
    'pages\product-category\lamps\star-lamp.js',
    'pages\product-category\office-supplies\business-card-holders.js',
    'pages\product-category\office-supplies\cable-management.js',
    'pages\product-category\office-supplies\desk-organizers.js',
    'pages\product-category\office-supplies\letter-trays.js',
    'pages\product-category\office-supplies\name-plates.js',
    'pages\product-category\office-supplies\paper-weights.js',
    'pages\product-category\office-supplies\pen-holders.js',
    'pages\product-category\office-supplies\phone-docks.js',
    'pages\product-category\phone-accessories\cable-organizers.js',
    'pages\product-category\phone-accessories\camera-lens-covers.js',
    'pages\product-category\phone-accessories\charging-docks.js',
    'pages\product-category\phone-accessories\custom-cases.js',
    'pages\product-category\phone-accessories\phone-grips.js',
    'pages\product-category\phone-accessories\phone-stands.js',
    'pages\product-category\phone-accessories\pop-sockets.js',
    'pages\product-category\phone-accessories\screen-protectors.js',
    'pages\product-category\superhero-models\batman-statue.js',
    'pages\product-category\superhero-models\black-panther.js',
    'pages\product-category\superhero-models\captain-america.js',
    'pages\product-category\superhero-models\hulk-model.js',
    'pages\product-category\superhero-models\iron-man-figure.js',
    'pages\product-category\superhero-models\spider-man-model.js',
    'pages\product-category\superhero-models\thor-figure.js',
    'pages\product-category\superhero-models\wonder-woman.js',
    'pages\product-category\toys-games\action-figure.js',
    'pages\product-category\toys-games\board-game-pieces.js',
    'pages\product-category\toys-games\building-blocks.js',
    'pages\product-category\toys-games\dinosaur-models.js',
    'pages\product-category\toys-games\educational-toy.js',
    'pages\product-category\toys-games\mini-cars.js',
    'pages\product-category\toys-games\puzzle-cube.js',
    'pages\product-category\toys-games\robot-toys.js'
)

$oldPattern = @'
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = cart.findIndex(item => item.id === product.id)
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(''), 3000)
    window.dispatchEvent(new Event('cartUpdated'))
  }
'@

$newPattern = @'
  const addToCart = async (product) => {
    try {
      // Import API function dynamically
      const { addToCart: apiAddToCart } = await import('../../../lib/api')
      await apiAddToCart(product.id, 1)
      setNotification(`${product.name} added to cart!`)
      setTimeout(() => setNotification(''), 3000)
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Failed to add to cart:', error)
      if (error.statusCode === 401) {
        setNotification('Please login to add items to cart')
      } else {
        setNotification('Failed to add to cart. Please try again.')
      }
      setTimeout(() => setNotification(''), 3000)
    }
  }
'@

$count = 0
$failed = @()

foreach ($file in $files) {
    $fullPath = "C:\Users\Sidhartha\Documents\Robohatch\$file"
    
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw
            $newContent = $content -replace [regex]::Escape($oldPattern), $newPattern
            
            if ($content -ne $newContent) {
                Set-Content $fullPath -Value $newContent -NoNewline
                $count++
                Write-Host "✅ Fixed: $file" -ForegroundColor Green
            } else {
                Write-Host "⚠️  No match: $file" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ Failed: $file - $($_.Exception.Message)" -ForegroundColor Red
            $failed += $file
        }
    } else {
        Write-Host "❌ Not found: $file" -ForegroundColor Red
        $failed += $file
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Successfully fixed: $count files" -ForegroundColor Green
if ($failed.Count -gt 0) {
    Write-Host "❌ Failed: $($failed.Count) files" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}
Write-Host "========================================`n" -ForegroundColor Cyan
