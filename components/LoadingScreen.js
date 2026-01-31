'use client'
import { useState, useEffect, useRef } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current
    
    // Multiple attempts to play video for iOS
    const attemptPlay = () => {
      if (videoElement) {
        // Set properties directly
        videoElement.muted = true
        videoElement.playsInline = true
        videoElement.setAttribute('playsinline', '')
        videoElement.setAttribute('webkit-playsinline', '')
        videoElement.setAttribute('x5-playsinline', '')
        
        // Try to play
        const playPromise = videoElement.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Retry after delay
            setTimeout(() => {
              videoElement.play().catch(() => {})
            }, 200)
          })
        }
      }
    }

    // Initial play attempt
    attemptPlay()

    // Try again on various events that might enable autoplay
    const events = ['touchstart', 'touchend', 'click', 'scroll', 'mousemove']
    const playOnce = () => {
      attemptPlay()
      events.forEach(event => {
        document.removeEventListener(event, playOnce)
      })
    }
    
    events.forEach(event => {
      document.addEventListener(event, playOnce, { once: true })
    })

    // Progress bar animation (0-4s) - starts immediately
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2.5 // 100 / 40 = 2.5 per 100ms to complete in 4s
      })
    }, 100)

    // Complete and fade out (4s)
    const completeTimer = setTimeout(() => {
      setIsComplete(true)
    }, 4000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(completeTimer)
      events.forEach(event => {
        document.removeEventListener(event, playOnce)
      })
    }
  }, [])

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-[9999] p-4 ${isComplete ? 'opacity-0 transition-opacity duration-500 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center w-full max-w-2xl">
        {/* Video Background */}
        <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl mb-4 sm:mb-6 md:mb-8 pointer-events-none">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-2xl"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            poster=""
            style={{ 
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
          >
            <source src="/loadinganimation.mp4" type="video/mp4" />
          </video>
          {/* Overlay to completely block any interaction */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}></div>
        </div>

        {/* Company Name */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] animate-pulse">
          ROBOHATCH
        </h1>

        {/* Loading Bar */}
        <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-96">
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden shadow-lg">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-orange via-hover-orange to-soft-peach rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(242,92,5,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="block text-center text-white text-lg font-semibold mt-4">{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
