import Link from 'next/link';

export default function Services() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-white via-orange-50 to-white" id="services">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Custom 3D Printing Card */}
          <Link href="/custom-printing" className="bg-gradient-to-br from-white to-orange-50/40 rounded-2xl p-5 sm:p-6 md:p-7 lg:p-9 shadow-[0_8px_20px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(242,92,5,0.2)] hover:to-orange-100/50 block group active:scale-95 no-underline">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-print"></i>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dark-brown mb-2 sm:mb-3 md:mb-4">Custom 3D Printing</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed">Bring your ideas to life with our custom 3D printing service. We transform your designs into high-quality 3D printed products.</p>
            <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">Personalized Designs</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">High Quality Materials</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">Fast Turnaround</span>
              </div>
            </div>
            <div className="text-primary-orange font-semibold flex items-center gap-2 group-hover:gap-4 transition-all duration-300 text-sm sm:text-base">
              Get Started <i className="fas fa-arrow-right"></i>
            </div>
          </Link>

          {/* Browse Categories Card */}
          <Link href="/categories" className="bg-gradient-to-br from-white to-orange-50/40 rounded-2xl p-5 sm:p-6 md:p-7 lg:p-9 shadow-[0_8px_20px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(242,92,5,0.2)] hover:to-orange-100/50 block group active:scale-95 no-underline">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary-orange to-hover-orange flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-th-large"></i>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dark-brown mb-2 sm:mb-3 md:mb-4">Browse Categories</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed">Explore our wide range of ready-made 3D printed products across various categories to find exactly what you need.</p>
            <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">8+ Product Categories</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">60+ Product Types</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                <span className="text-gray-700 text-sm sm:text-base">Instant Availability</span>
              </div>
            </div>
            <div className="text-primary-orange font-semibold flex items-center gap-2 group-hover:gap-4 transition-all duration-300 text-sm sm:text-base">
              Explore Categories <i className="fas fa-arrow-right"></i>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
