
import React from 'react';
import { useDeviceOptimizer } from '@/hooks/use-mobile';

// This component now returns null regardless of device
// If you want to restore it in the future, uncomment the code and implement device-specific rendering
const RotatingLeaf = () => {
  const { shouldUseEffects } = useDeviceOptimizer();
  
  // The component is disabled for all devices
  return null;
  
  // If you want to restore the component in the future:
  /*
  // Only render on desktop for performance
  if (!shouldUseEffects) {
    return null;
  }
  
  return (
    // SVG animation code would go here
  );
  */
};

export default RotatingLeaf;
