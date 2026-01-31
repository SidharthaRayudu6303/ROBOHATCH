import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import { PRODUCT_CATEGORIES_META } from '../utils/seo'

export default function JewelryPage() {
  const seoConfig = {
    title: PRODUCT_CATEGORIES_META.jewelry.title,
    description: PRODUCT_CATEGORIES_META.jewelry.description,
    keywords: PRODUCT_CATEGORIES_META.jewelry.keywords,
    url: '/jewelry',
    type: 'website',
    image: '/images/categories/jewelry-og.jpg',
  }

  return (
    <>
      <SEOHead pageConfig={seoConfig} />
      <Navbar />
      <main className="min-h-screen">
        {/* Page content */}
      </main>
      <Footer />
    </>
  )
}
