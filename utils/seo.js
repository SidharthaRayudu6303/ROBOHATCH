const SEO_CONFIG = {
  defaultTitle: 'ROBOHATCH - Premium 3D Printed Products',
  titleTemplate: '%s | ROBOHATCH',
  description: 'Discover premium 3D printed products including custom gifts, home decor, jewelry, and personalized items. Fast shipping across India.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://robohatch.com',
    site_name: 'ROBOHATCH',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ROBOHATCH - Premium 3D Printed Products',
      },
    ],
  },
  twitter: {
    handle: '@robohatch',
    site: '@robohatch',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#FF6B35',
    },
    {
      name: 'keywords',
      content: '3D printing, custom gifts, personalized products, home decor, jewelry, India',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
}

export const generateMetaTags = (pageConfig = {}) => {
  const {
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.description,
    image = SEO_CONFIG.openGraph.images[0].url,
    url,
    type = 'website',
    keywords,
    noindex = false,
  } = pageConfig

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robohatch.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return {
    title,
    description,
    canonical: fullUrl,
    openGraph: {
      type,
      url: fullUrl,
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      site_name: SEO_CONFIG.openGraph.site_name,
    },
    twitter: {
      handle: SEO_CONFIG.twitter.handle,
      site: SEO_CONFIG.twitter.site,
      cardType: SEO_CONFIG.twitter.cardType,
      title,
      description,
      image: fullImageUrl,
    },
    additionalMetaTags: [
      ...SEO_CONFIG.additionalMetaTags,
      ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
      ...(noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    ],
    additionalLinkTags: SEO_CONFIG.additionalLinkTags,
  }
}

export const PRODUCT_CATEGORIES_META = {
  devotional: {
    title: 'Devotional Idols & Religious Items',
    description: 'Premium 3D printed devotional idols, religious statues, and spiritual items. Customizable designs for home temples and gifting.',
    keywords: 'devotional idols, religious items, 3D printed statues, Hindu gods, spiritual gifts',
  },
  jewelry: {
    title: 'Custom 3D Printed Jewelry',
    description: 'Unique 3D printed jewelry including necklaces, earrings, bracelets, and custom designs. Personalized jewelry for every occasion.',
    keywords: '3D printed jewelry, custom jewelry, personalized accessories, unique jewelry designs',
  },
  homedecor: {
    title: 'Home Decor & Interior Design',
    description: 'Transform your space with premium 3D printed home decor items. Wall art, sculptures, vases, and custom interior design pieces.',
    keywords: 'home decor, 3D printed decor, wall art, sculptures, interior design, custom decor',
  },
  toys: {
    title: 'Custom 3D Printed Toys & Models',
    description: 'Safe and durable 3D printed toys, action figures, and educational models. Perfect gifts for kids and collectors.',
    keywords: '3D printed toys, custom toys, action figures, educational models, kids gifts',
  },
  office: {
    title: 'Office Supplies & Desk Accessories',
    description: '3D printed office supplies, desk organizers, pen holders, and professional accessories. Upgrade your workspace.',
    keywords: 'office supplies, desk accessories, 3D printed organizers, workspace decor',
  },
  keychains: {
    title: 'Personalized Keychains & Accessories',
    description: 'Custom 3D printed keychains with names, logos, and unique designs. Perfect corporate gifts and personalized accessories.',
    keywords: 'custom keychains, personalized keychains, 3D printed accessories, corporate gifts',
  },
  lamps: {
    title: '3D Printed Lamps & Lighting',
    description: 'Unique 3D printed lamps and lighting solutions. Modern designs, customizable LED lamps, and decorative lighting.',
    keywords: '3D printed lamps, custom lighting, LED lamps, decorative lights, modern lamps',
  },
  flowerpots: {
    title: 'Designer Flower Pots & Planters',
    description: '3D printed flower pots, planters, and garden accessories. Modern designs for indoor and outdoor plants.',
    keywords: 'flower pots, planters, 3D printed pots, garden accessories, indoor plants',
  },
}

export default SEO_CONFIG
