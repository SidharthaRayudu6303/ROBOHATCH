import Link from 'next/link';

export default function Services() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-orange-50 to-white" id="services">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-brown text-center mb-8 sm:mb-12 md:mb-16">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Custom 3D Printing Card */}
          <Link href="/custom-printing" className="bg-gradient-to-br from-white to-orange-50/40 rounded-[20px] p-8 shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 block group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-print"></i>
            </div>
            <h3 className="text-2xl font-bold text-dark-brown mb-4">Custom 3D Printing</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Bring your ideas to life with our custom 3D printing service. We transform your designs into high-quality 3D printed products.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">Personalized Designs</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">High Quality Materials</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">Fast Turnaround</span>
              </div>
            </div>
            <div className="text-primary-orange font-semibold flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
              Get Started <i className="fas fa-arrow-right"></i>
            </div>
          </Link>

          {/* Browse Categories Card */}
          <Link href="/categories" className="bg-gradient-to-br from-white to-orange-50/40 rounded-[20px] p-8 shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 block group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-th-large"></i>
            </div>
            <h3 className="text-2xl font-bold text-dark-brown mb-4">Browse Categories</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Explore our wide range of ready-made 3D printed products across various categories to find exactly what you need.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">8+ Product Categories</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">60+ Product Types</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-gray-700">Instant Availability</span>
              </div>
            </div>
            <div className="text-primary-orange font-semibold flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
              Explore Categories <i className="fas fa-arrow-right"></i>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
