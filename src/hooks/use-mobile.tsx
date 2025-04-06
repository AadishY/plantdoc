
import { useState, useEffect } from "react"

// We can adjust this breakpoint based on our design needs
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize as undefined to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Check for mobile devices using both screen size and user agent (more reliable)
    function handleResize() {
      const isMobileBySize = window.innerWidth < MOBILE_BREAKPOINT
      const isMobileByAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Consider it mobile if either check returns true
      setIsMobile(isMobileBySize || isMobileByAgent)
    }
    
    // Set size initially
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures this only runs on mount and unmount

  // Return false during SSR and the correct value after hydration
  return isMobile === undefined ? false : isMobile
}

// Additional utility hook for responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('xs')
      else if (width < 768) setBreakpoint('sm')
      else if (width < 1024) setBreakpoint('md')
      else if (width < 1280) setBreakpoint('lg')
      else if (width < 1536) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }

    // Set size initially
    handleResize()
    
    // Use passive event listeners for better performance
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Enhanced hook to simplify conditional rendering based on device capabilities
export function useDeviceOptimizer() {
  const isMobile = useIsMobile()
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false)
  
  useEffect(() => {
    // Check for low power devices by testing hardware concurrency
    // This is an approximation - low core count often indicates limited GPU/processing power
    const hasLimitedCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    
    // Check for devices with potentially weak GPU
    const userAgent = navigator.userAgent.toLowerCase()
    const isBudgetDevice = /sm-|moto g|redmi|honor|nokia|alcatel|huawei p[1-3]|mediapad/i.test(userAgent)
    
    // Detect older devices
    const isOlderIOS = /iphone os ([1-9]|1[0-2])_/i.test(userAgent) // iOS 12 or below
    const isOlderAndroid = /android [1-7]\./i.test(userAgent) // Android 7 or below
    
    // Set power class based on all factors
    setIsLowPowerDevice(hasLimitedCores || isBudgetDevice || isOlderIOS || isOlderAndroid)
  }, [])
  
  return {
    // Should render heavy animations
    shouldAnimate: !isMobile && !isLowPowerDevice,
    // Should use interactive effects
    shouldUseEffects: !isMobile && !isLowPowerDevice,
    // Should use hover effects
    shouldUseHover: !isMobile,
    // Should use complex backgrounds
    shouldUseComplexBG: !isMobile && !isLowPowerDevice,
    // Current device type
    deviceType: isMobile ? 'mobile' : 'desktop',
    // Is this a low power device
    isLowPower: isLowPowerDevice
  }
}
