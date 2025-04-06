
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

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// New hook to simplify conditional rendering based on device
export function useDeviceOptimizer() {
  const isMobile = useIsMobile()
  
  return {
    // Should render heavy animations
    shouldAnimate: !isMobile,
    // Should use interactive effects
    shouldUseEffects: !isMobile,
    // Should use hover effects
    shouldUseHover: !isMobile,
    // Should use complex backgrounds
    shouldUseComplexBG: !isMobile,
    // Current device type
    deviceType: isMobile ? 'mobile' : 'desktop'
  }
}
