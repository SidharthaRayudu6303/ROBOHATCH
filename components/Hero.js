export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector('#products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 pb-10 sm:pb-15 bg-gradient-to-br from-white via-[#fff5f0] to-[#ffe8dc] min-h-0 flex items-center" id="home">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 flex flex-col gap-8 sm:gap-12">
        {/* Animated ROBOHATCH with rotating lights */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[280px] flex items-center justify-center mb-4 sm:mb-6">
          <div className="absolute w-[400px] sm:w-[550px] md:w-[700px] h-[400px] sm:h-[550px] md:h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [perspective:1000px]">
            <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F25C05] border-r-[rgba(242,92,5,0.5)] [animation-duration:3s] [filter:drop-shadow(0_0_20px_#F25C05)_drop-shadow(0_0_40px_rgba(242,92,5,0.8))_sm:drop-shadow(0_0_30px_#F25C05)_sm:drop-shadow(0_0_60px_rgba(242,92,5,0.8))]"></div>
            <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F27405] border-r-[rgba(242,116,5,0.5)] [animation-duration:2.5s] [animation-direction:reverse] [transform:rotateY(60deg)] [filter:drop-shadow(0_0_18px_#F27405)_drop-shadow(0_0_35px_rgba(242,116,5,0.7))_sm:drop-shadow(0_0_25px_#F27405)_sm:drop-shadow(0_0_50px_rgba(242,116,5,0.7))]"></div>
            <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F2935C] border-r-[rgba(242,147,92,0.5)] [animation-duration:3.5s] [transform:rotateY(-60deg)] [filter:drop-shadow(0_0_25px_#F2935C)_drop-shadow(0_0_50px_rgba(242,147,92,0.6))_sm:drop-shadow(0_0_35px_#F2935C)_sm:drop-shadow(0_0_70px_rgba(242,147,92,0.6))]"></div>
             <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F25C05] border-r-[rgba(242,92,5,0.5)] [animation-duration:3s] [filter:drop-shadow(0_0_20px_#F25C05)_drop-shadow(0_0_40px_rgba(242,92,5,0.8))_sm:drop-shadow(0_0_30px_#F25C05)_sm:drop-shadow(0_0_60px_rgba(242,92,5,0.8))]"></div>
            <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F27405] border-r-[rgba(242,116,5,0.5)] [animation-duration:2.5s] [animation-direction:reverse] [transform:rotateY(60deg)] [filter:drop-shadow(0_0_18px_#F27405)_drop-shadow(0_0_35px_rgba(242,116,5,0.7))_sm:drop-shadow(0_0_25px_#F27405)_sm:drop-shadow(0_0_50px_rgba(242,116,5,0.7))]"></div>
            <div className="absolute w-full h-full rounded-full border-[3px] sm:border-[4px] md:border-[5px] border-transparent animate-rotate-arc [transform-style:preserve-3d] border-t-[#F2935C] border-r-[rgba(242,147,92,0.5)] [animation-duration:3.5s] [transform:rotateY(-60deg)] [filter:drop-shadow(0_0_25px_#F2935C)_drop-shadow(0_0_50px_rgba(242,147,92,0.6))_sm:drop-shadow(0_0_35px_#F2935C)_sm:drop-shadow(0_0_70px_rgba(242,147,92,0.6))]"></div>
          </div>
          
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-black tracking-[0.15rem] sm:tracking-[0.2rem] md:tracking-[0.3rem] text-black relative z-10 animate-title-glow flex gap-0.5 sm:gap-1 justify-center [text-shadow:0_4px_10px_rgba(0,0,0,0.2)]">
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

        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-extrabold leading-tight mb-6 text-dark-brown fade-in">
              Custom 3D Printed
              <span className="text-primary-orange block">Products for Your Life</span>
            </h2>
            <p className="text-lg text-muted-brown mb-8 leading-relaxed fade-in delay-1">
              Discover unique, handcrafted 3D-printed lamps, idols, accessories, and more.
              <br />Premium quality, sustainable materials, endless creativity.
            </p>
            <button className="bg-primary-orange text-white border-none px-10 py-4 text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(242,92,5,0.3)] hover:bg-hover-orange hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(242,92,5,0.4)] [&>i]:transition-transform [&>i]:duration-300 [&:hover>i]:translate-x-1 fade-in delay-2" onClick={scrollToProducts}>
              Shop Now <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="fade-in delay-1">
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white to-orange-50/40 py-12 px-8 rounded-[20px] text-center shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 [&>i]:text-[4rem] [&>i]:text-primary-orange [&>i]:mb-4 [&>p]:font-semibold [&>p]:text-dark-brown">
                <i className="fas fa-lightbulb"></i>
                <p>3D Printed Lamps</p>
              </div>
              <div className="bg-gradient-to-br from-white to-orange-50/40 py-12 px-8 rounded-[20px] text-center shadow-[0_10px_30px_rgba(242,92,5,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(242,92,5,0.2)] hover:to-orange-100/50 [&>i]:text-[4rem] [&>i]:text-primary-orange [&>i]:mb-4 [&>p]:font-semibold [&>p]:text-dark-brown">
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
