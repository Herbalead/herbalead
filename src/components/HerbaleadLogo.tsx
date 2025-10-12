'use client'

import React from 'react';

interface HerbaleadLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
  variant?: 'horizontal' | 'vertical' | 'iconOnly' | 'minimal'
  responsive?: boolean
}

export default function HerbaleadLogo({ 
  size = 'md', 
  showText: _showText = true, 
  className = '',
  variant = 'horizontal',
  responsive = false
}: HerbaleadLogoProps) {
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10', 
    lg: 'h-14',
    xl: 'h-16'
  }
  
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  }

  // Responsive classes
  const responsiveClasses = responsive ? 'h-10 md:h-12 lg:h-14' : sizeClasses[size]

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
      <img
        src={logoPaths.iconOnly}
        alt="HerbaLead"
        className={`${iconSizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoPaths[variant]}
        alt="HerbaLead - Your Lead Accelerator"
        className={`${responsiveClasses} w-auto`}
      />
    </div>
  )
}