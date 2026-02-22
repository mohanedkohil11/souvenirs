"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56,
  })
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        // Calculate progress (assuming 24 hours total)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        const totalInitialSeconds = 24 * 3600
        const newProgress = (totalSeconds / totalInitialSeconds) * 100

        setProgress(newProgress)

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const scrollToFlashSale = () => {
    const flashSaleSection = document.getElementById("flash-sale-section")
    if (flashSaleSection) {
      flashSaleSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2 md:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Flash Sale Text */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">Flash Sale!</h2>
              <p className="text-[10px] md:text-xs text-white/90">Up to 50% OFF on Selected Items</p>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 min-w-[40px] md:min-w-[50px]">
              <div className="text-lg md:text-xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-wider">Hours</div>
            </div>
            <div className="text-lg md:text-xl font-bold">:</div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 min-w-[40px] md:min-w-[50px]">
              <div className="text-lg md:text-xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-wider">Minutes</div>
            </div>
            <div className="text-lg md:text-xl font-bold">:</div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 min-w-[40px] md:min-w-[50px]">
              <div className="text-lg md:text-xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-wider">Seconds</div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <Button
            onClick={scrollToFlashSale}
            size="sm"
            className="bg-white text-red-600 hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Shop Now
          </Button>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-2 md:mt-3">
          <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-center text-[10px] md:text-xs mt-1 text-white/80">Hurry! Sale ends soon</p>
        </div>
      </div>
    </div>
  )
}
