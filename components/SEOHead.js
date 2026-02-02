import Head from 'next/head'
import { generateMetaTags } from '../utils/seo'
import { sanitizeUrl, escapeJsonForHtml } from '../utils/security'

/**
 * SEO Head Component with XSS Protection
 * ✅ SECURITY: Sanitizes all URLs and escapes JSON-LD data
 */
export default function SEOHead({ pageConfig = {} }) {
  const meta = generateMetaTags(pageConfig)
  
  // 🔒 SECURITY: Sanitize canonical URL to prevent XSS
  const safeCanonical = sanitizeUrl(meta.canonical)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robohatch.com'
  
  // 🔒 SECURITY: Create structured data with sanitized URLs
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ROBOHATCH',
    url: sanitizeUrl(safeCanonical),
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXX-XXX-XXXX',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: 'en',
    },
    sameAs: [
      'https://facebook.com/robohatch',
      'https://instagram.com/robohatch',
      'https://twitter.com/robohatch',
    ],
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={safeCanonical} />

      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:url" content={sanitizeUrl(meta.openGraph.url)} />
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:site_name" content={meta.openGraph.site_name} />
      {meta.openGraph.images.map((image, index) => (
        <meta key={index} property="og:image" content={sanitizeUrl(image.url)} />
      ))}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content={meta.twitter.cardType} />
      <meta name="twitter:site" content={meta.twitter.site} />
      <meta name="twitter:creator" content={meta.twitter.handle} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={sanitizeUrl(meta.twitter.image)} />

      {meta.additionalMetaTags.map((tag, index) => (
        <meta key={`meta-${index}`} name={tag.name} content={tag.content} />
      ))}

      {meta.additionalLinkTags.map((tag, index) => (
        <link key={`link-${index}`} rel={tag.rel} href={sanitizeUrl(tag.href)} sizes={tag.sizes} />
      ))}

      {/* 🔒 SECURITY: Escape JSON-LD to prevent </script> injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonForHtml(structuredData),
        }}
      />
    </Head>
  )
}
