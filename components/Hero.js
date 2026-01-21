export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-6 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white via-[#fff5f0] to-[#ffe8dc] min-h-0 flex items-center" id="home">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        {/* Animated ROBOHATCH with rotating lights */}
        <div className="relative w-full h-[120px] sm:h-[150px] md:h-[200px] lg:h-[250px] xl:h-[300px] flex items-center justify-center mb-0 sm:mb-2 md:mb-4">
          <div className="absolute w-[200px] sm:w-[280px] md:w-[420px] lg:w-[550px] xl:w-[650px] h-[200px] sm:h-[280px] md:h-[420px] lg:h-[550px] xl:h-[650px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [perspective:1000px]">
            <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F25C05] border-r-[rgba(242,92,5,0.5)] [animation-duration:3s] [filter:drop-shadow(0_0_15px_#F25C05)_drop-shadow(0_0_30px_rgba(242,92,5,0.8))_sm:drop-shadow(0_0_20px_#F25C05)_sm:drop-shadow(0_0_40px_rgba(242,92,5,0.8))]"></div>
            <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F27405] border-r-[rgba(242,116,5,0.5)] [animation-duration:2.5s] [animation-direction:reverse] [transform:rotateY(60deg)] [filter:drop-shadow(0_0_12px_#F27405)_drop-shadow(0_0_25px_rgba(242,116,5,0.7))_sm:drop-shadow(0_0_18px_#F27405)_sm:drop-shadow(0_0_35px_rgba(242,116,5,0.7))]"></div>
            <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F2935C] border-r-[rgba(242,147,92,0.5)] [animation-duration:3.5s] [transform:rotateY(-60deg)] [filter:drop-shadow(0_0_18px_#F2935C)_drop-shadow(0_0_35px_rgba(242,147,92,0.6))_sm:drop-shadow(0_0_25px_#F2935C)_sm:drop-shadow(0_0_50px_rgba(242,147,92,0.6))]"></div>
             <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F25C05] border-r-[rgba(242,92,5,0.5)] [animation-duration:3s] [filter:drop-shadow(0_0_15px_#F25C05)_drop-shadow(0_0_30px_rgba(242,92,5,0.8))_sm:drop-shadow(0_0_20px_#F25C05)_sm:drop-shadow(0_0_40px_rgba(242,92,5,0.8))]"></div>
            <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F27405] border-r-[rgba(242,116,5,0.5)] [animation-duration:2.5s] [animation-direction:reverse] [transform:rotateY(60deg)] [filter:drop-shadow(0_0_12px_#F27405)_drop-shadow(0_0_25px_rgba(242,116,5,0.7))_sm:drop-shadow(0_0_18px_#F27405)_sm:drop-shadow(0_0_35px_rgba(242,116,5,0.7))]"></div>
            <div className="absolute w-full h-full rounded-full border-[2px] sm:border-[3px] md:border-[4px] lg:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F2935C] border-r-[rgba(242,147,92,0.5)] [animation-duration:3.5s] [transform:rotateY(-60deg)] [filter:drop-shadow(0_0_18px_#F2935C)_drop-shadow(0_0_35px_rgba(242,147,92,0.6))_sm:drop-shadow(0_0_25px_#F2935C)_sm:drop-shadow(0_0_50px_rgba(242,147,92,0.6))]"></div>
          </div>
          
          <h1 className="text-[1.8rem] sm:text-[2.8rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] font-black tracking-[0.1rem] sm:tracking-[0.15rem] md:tracking-[0.25rem] text-black relative z-10 animate-title-glow flex gap-0.5 sm:gap-1 justify-center [text-shadow:0_4px_10px_rgba(0,0,0,0.2)]">
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-1">R</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-2">O</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-3">B</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-4">O</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-5">H</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-6">A</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-7">T</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-8">C</span>
            <span className="inline-block animate-letter-float [transform-style:preserve-3d] letter-9">H</span>
          </h1>
          
          <div className="absolute w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(242,92,5,0.4)_0%,rgba(242,116,5,0.3)_40%,transparent_70%)] rounded-full animate-pulse-custom -z-10"></div>
        </div>

        <div className="text-center md:text-left md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
          <div className="px-2 sm:px-3 md:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-dark-brown fade-in">
              Custom 3D Printed
              <span className="text-primary-orange block mt-1">Products for Your Life</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-brown mb-5 sm:mb-6 md:mb-7 lg:mb-8 leading-relaxed fade-in delay-1">
              Discover unique, handcrafted 3D-printed lamps, idols, accessories, and more.
              <span className="hidden sm:inline"><br />Premium quality, sustainable materials, endless creativity.</span>
            </p>
            <button className="bg-gradient-to-r from-primary-orange to-hover-orange text-white border-none w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold rounded-full cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-[0_6px_20px_rgba(242,92,5,0.4)] hover:bg-hover-orange hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(242,92,5,0.5)] active:scale-95 [&>i]:transition-transform [&>i]:duration-300 [&:hover>i]:translate-x-1 fade-in delay-2" onClick={scrollToProducts}>
              <i className="fas fa-shopping-bag text-lg sm:text-xl"></i>
              Shop Now
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="hidden md:block fade-in delay-1">
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-gradient-to-br from-white to-orange-50/40 py-8 md:py-10 lg:py-12 px-6 md:px-7 lg:px-8 rounded-[20px] text-center shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 [&>i]:text-[3rem] md:[&>i]:text-[3.5rem] lg:[&>i]:text-[4rem] [&>i]:text-primary-orange [&>i]:mb-3 md:[&>i]:mb-4 [&>p]:font-semibold [&>p]:text-dark-brown [&>p]:text-sm md:[&>p]:text-base">
                <i className="fas fa-lightbulb"></i>
                <p>3D Printed Lamps</p>
              </div>
              <div className="bg-gradient-to-br from-white to-orange-50/40 py-8 md:py-10 lg:py-12 px-6 md:px-7 lg:px-8 rounded-[20px] text-center shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 [&>i]:text-[3rem] md:[&>i]:text-[3.5rem] lg:[&>i]:text-[4rem] [&>i]:text-primary-orange [&>i]:mb-3 md:[&>i]:mb-4 [&>p]:font-semibold [&>p]:text-dark-brown [&>p]:text-sm md:[&>p]:text-base">
                <i className="fas fa-om"></i>
                <p>Devotional Idols</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
