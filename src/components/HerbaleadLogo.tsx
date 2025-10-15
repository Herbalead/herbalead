'use client'

import React from 'react';
import Image from 'next/image';

interface HerbaleadLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal'
  responsive?: boolean
}

export default function HerbaleadLogo({ 
  size = 'md', 
  className = '',
  variant = 'horizontal',
  responsive = false
}: HerbaleadLogoProps) {
  
  const sizeClasses = {
    sm: 32,
    md: 40, 
    lg: 56,
    xl: 64
  }
  
  const iconSizeClasses = {
    sm: 32,
    md: 40, 
    lg: 56,
    xl: 64
  }

  // Responsive sizes
  const responsiveSize = responsive ? { width: 0, height: 0 } : { width: sizeClasses[size], height: sizeClasses[size] }

  // Logo paths
  const logoPaths = {
    horizontal: '/logos/herbalead/herbalead-logo-horizontal.png',
    vertical: '/logos/herbalead/herbalead-logo-vertical.png',
    iconOnly: '/logos/herbalead/herbalead-icon-only.png',
    minimal: '/logos/herbalead/herbalead-logo-minimal.png',
  }

  // For icon-only variant, don't show text
  if (variant === 'iconOnly') {
    return (
      <Image
        src={`${logoPaths.iconOnly}?v=2024`}
        alt="HerbaLead"
        width={iconSizeClasses[size]}
        height={iconSizeClasses[size]}
        className={className}
        priority
      />
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={`${logoPaths[variant]}?v=2024`}
        alt="HerbaLead - Your Lead Accelerator"
        width={responsive ? 0 : sizeClasses[size]}
        height={responsive ? 0 : sizeClasses[size]}
        className={responsive ? 'h-10 md:h-12 lg:h-14 w-auto' : 'w-auto'}
        priority
      />
    </div>
  )
}