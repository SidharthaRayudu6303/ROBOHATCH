'use client'
import { useState, useEffect, useRef } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current
    
    // Aggressive autoplay for iOS Safari
    const attemptPlay = async () => {
      if (videoElement) {
        try {
          // Force mute and iOS attributes
          videoElement.muted = true
          videoElement.defaultMuted = true
          videoElement.volume = 0
          videoElement.playsInline = true
          videoElement.setAttribute('playsinline', 'true')
          videoElement.setAttribute('webkit-playsinline', 'true')
          videoElement.setAttribute('x5-playsinline', 'true')
          videoElement.setAttribute('x5-video-player-type', 'h5')
          videoElement.setAttribute('x5-video-player-fullscreen', 'false')
          videoElement.removeAttribute('controls')
          
          // Wait for video to be ready
          if (videoElement.readyState < 3) {
            await new Promise((resolve) => {
              videoElement.addEventListener('canplay', resolve, { once: true })
              videoElement.load()
            })
          }
          
          // Attempt play
          await videoElement.play()
        } catch (error) {
          // Silent fail and retry
          setTimeout(() => {
            videoElement.play().catch(() => {})
          }, 100)
        }
      }
    }

    // Immediate play attempt
    setTimeout(attemptPlay, 0)
    
    // iOS Safari often needs user interaction, so try on first touch/click
    const playOnInteraction = () => {
      attemptPlay()
      document.removeEventListener('touchstart', playOnInteraction)
      document.removeEventListener('click', playOnInteraction)
    }
    
    document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true })
    document.addEventListener('click', playOnInteraction, { once: true })

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
      document.removeEventListener('touchstart', playOnInteraction)
      document.removeEventListener('click', playOnInteraction)
    }
  }, [])

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-[9999] p-4 ${isComplete ? 'opacity-0 transition-opacity duration-500 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center w-full max-w-2xl">
        {/* Video Background */}
        <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl mb-4 sm:mb-6 md:mb-8">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-2xl"
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="false"
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            style={{ 
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src="/loadinganimation.mp4" type="video/mp4" />
          </video>
          {/* Overlay to completely block any interaction */}
          <div 
            className="absolute inset-0" 
            style={{ 
              zIndex: 10, 
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          ></div>
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
