// HerbaLead Logo Configuration
// Centralized configuration for all logo assets

export const herbaleadLogos = {
  // Main Logos
  horizontal: '/logos/herbalead/herbalead-logo-horizontal.png',
  vertical: '/logos/herbalead/herbalead-logo-vertical.png',
  minimal: '/logos/herbalead/herbalead-logo-minimal.png',
  
  // Color Variations
  light: '/logos/herbalead/herbalead-logo-light.png',
  dark: '/logos/herbalead/herbalead-logo-dark.png',
  reverse: '/logos/herbalead/herbalead-logo-reverse.png',
  monochrome: '/logos/herbalead/herbalead-logo-monochrome.png',
  
  // Icons
  iconOnly: '/logos/herbalead/herbalead-icon-only.png',
  iconSquare: '/logos/herbalead/herbalead-icon-square.png',
  favicon: '/logos/herbalead/herbalead-favicon.png',
} as const;

// Brand Colors
export const herbaleadColors = {
  green: {
    primary: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  blue: {
    primary: '#1E40AF',
    light: '#3B82F6',
    dark: '#1E3A8A',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    500: '#6B7280',
    900: '#111827',
  },
} as const;

// Logo Usage Helper
export const getLogoForTheme = (theme: 'light' | 'dark' | 'auto' = 'auto') => {
  switch (theme) {
    case 'light':
      return herbaleadLogos.light;
    case 'dark':
      return herbaleadLogos.dark;
    case 'auto':
    default:
      return herbaleadLogos.horizontal;
  }
};

// Logo Component Props
export interface LogoProps {
  variant?: keyof typeof herbaleadLogos;
  className?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

// Default Logo Component Configuration
export const defaultLogoProps: Partial<LogoProps> = {
  variant: 'horizontal',
  alt: 'HerbaLead - Your Lead Accelerator',
  className: 'h-8 w-auto',
};
