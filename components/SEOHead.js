import Head from 'next/head'
import { generateMetaTags } from '../utils/seo'

export default function SEOHead({ pageConfig = {} }) {
  const meta = generateMetaTags(pageConfig)

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:site_name" content={meta.openGraph.site_name} />
      {meta.openGraph.images.map((image, index) => (
        <meta key={index} property="og:image" content={image.url} />
      ))}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content={meta.twitter.cardType} />
      <meta name="twitter:site" content={meta.twitter.site} />
      <meta name="twitter:creator" content={meta.twitter.handle} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />

      {meta.additionalMetaTags.map((tag, index) => (
        <meta key={`meta-${index}`} name={tag.name} content={tag.content} />
      ))}

      {meta.additionalLinkTags.map((tag, index) => (
        <link key={`link-${index}`} rel={tag.rel} href={tag.href} sizes={tag.sizes} />
      ))}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ROBOHATCH',
            url: meta.canonical,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://robohatch.com'}/logo.png`,
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
          }),
        }}
      />
    </Head>
  )
}
