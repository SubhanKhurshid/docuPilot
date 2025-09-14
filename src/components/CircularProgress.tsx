"use client"

import { useState, useEffect } from "react"

const steps = [
  { id: 1, title: "Seek Immediate Medical Treatment", description: "Get proper medical care and documentation" },
  { id: 2, title: "Gather and Organize Evidence", description: "Collect photos, reports, and witness information" },
  { id: 3, title: "Calculate Your Damages", description: "Document all financial losses and expenses" },
  { id: 4, title: "Establish Liability", description: "Determine fault and responsibility" },
  { id: 5, title: "Draft a Demand Letter", description: "Create formal compensation request" },
  { id: 6, title: "Send and Track Your Demand", description: "Submit and monitor your claim" },
  { id: 7, title: "Prepare for Negotiation", description: "Ready your case for discussions" },
  { id: 8, title: "Respond to Insurance Adjusters", description: "Handle insurance company communications" },
  { id: 9, title: "Evaluate Counteroffers and Settlement Tools", description: "Review and assess settlement options" },
  { id: 10, title: "Finalize Settlement", description: "Complete the legal resolution process" },
]

export function CircularProgress() {
  const [currentStep, setCurrentStep] = useState(0)
  const [innerDotsStep, setInnerDotsStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 3000) // Change step every 3 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setInnerDotsStep((prev) => (prev + 1) % 12)
    }, 1500) // Move to next position every 1.5 seconds (includes 0.5s pause)

    return () => clearInterval(interval)
  }, [])


  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Background animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-[500px] md:min-h-[700px] px-4">
        {/* Title section */}
        <div className="text-center mb-6 md:mb-12">
          <p className="text-[#8dff2d] text-xs md:text-sm mb-2">Personal Injury Process</p>
          <h1 className="text-white text-2xl md:text-4xl font-bold mb-2">Legal Process</h1>
          
        </div>

        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] mb-4 md:mb-8">
          {/* Inner rotating dots */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12 - 90
              const x = 50 + 35 * Math.cos((angle * Math.PI) / 180) // Reduced from 40 to 35
              const y = 50 + 35 * Math.sin((angle * Math.PI) / 180) // Reduced from 40 to 35
              const isHighlighted = i === innerDotsStep

              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 md:w-1.5 md:h-1.5 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-full transition-all duration-500 ${
                      isHighlighted ? "bg-[#8dff2d] scale-125 shadow-lg shadow-[#8dff2d]/50" : "bg-white/40"
                    }`}
                    style={{
                      boxShadow: isHighlighted ? "0 0 4px rgba(141, 255, 45, 0.8)" : undefined,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Progress circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${currentStep * (283 / steps.length)} 283`}
              className="transition-all duration-1000 ease-in-out drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 8px rgba(141, 255, 45, 0.6))",
              }}
            />

            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8dff2d" />
                <stop offset="50%" stopColor="#7be525" />
                <stop offset="100%" stopColor="#6bd61f" />
              </linearGradient>
            </defs>
          </svg>

          {/* Step markers */}
          {steps.map((step, index) => {
            const angle = (index * 360) / steps.length - 90 // Start from top
            const x = 50 + 45 * Math.cos((angle * Math.PI) / 180)
            const y = 50 + 45 * Math.sin((angle * Math.PI) / 180)
            const isActive = index <= currentStep
            const isCurrent = index === currentStep

            return (
              <div
                key={step.id}
                className="absolute w-3 h-3 md:w-4 md:h-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div
                  className={`w-full h-full rounded-full border-2 transition-all duration-500 ${
                    isActive
                      ? "bg-[#8dff2d] border-[#7be525] shadow-lg shadow-[#8dff2d]/50"
                      : "bg-white/10 border-white/30"
                    } ${isCurrent ? "scale-125 md:scale-150 animate-pulse bg-[#8dff2d] border-[#7be525] shadow-xl shadow-[#8dff2d]/70" : ""}`}
                  style={{
                    boxShadow: isCurrent
                      ? "0 0 15px rgba(141, 255, 45, 0.9), 0 0 30px rgba(141, 255, 45, 0.5)"
                      : undefined,
                  }}
                />
              </div>
            )
          })}

          {/* Current step indicator */}
          <div
            className="absolute w-4 h-4 md:w-6 md:h-6 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
            style={{
              left: `${50 + 45 * Math.cos((((currentStep * 360) / steps.length - 90) * Math.PI) / 180)}%`,
              top: `${50 + 45 * Math.sin((((currentStep * 360) / steps.length - 90) * Math.PI) / 180)}%`,
            }}
          >
            <div
              className="w-full h-full rounded-full bg-[#8dff2d] border-2 border-white shadow-lg animate-pulse"
              style={{
                boxShadow: "0 0 10px rgba(141, 255, 45, 0.9), 0 0 20px rgba(141, 255, 45, 0.5)",
              }}
            />
          </div>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12">
            <div className="text-white/60 text-xs md:text-sm mb-1 md:mb-2">
              Step {currentStep + 1} of {steps.length}
            </div>
            <h3 className="text-white text-sm md:text-lg font-semibold mb-1 md:mb-2 text-balance leading-tight">{steps[currentStep].title}</h3>
            <p className="text-white/80 text-xs md:text-sm text-balance leading-tight">{steps[currentStep].description}</p>
          </div>
        </div>


      </div>
    </div>
  )
}
