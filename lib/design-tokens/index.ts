/**
 * DESIGN TOKEN SYSTEM
 * Figma-first design tokens for visual consistency across the app.
 * Follows 4px/8px grid system. All values are derived from this base.
 */

export const tokens = {
  /** 4px base grid - spacing scale (4, 8, 12, 16, 24, 32, 40, 48, 64) */
  spacing: {
    0: 0,
    1: 4,      // 0.25rem
    2: 8,      // 0.5rem
    3: 12,     // 0.75rem
    4: 16,     // 1rem
    5: 20,     // 1.25rem
    6: 24,     // 1.5rem
    8: 32,     // 2rem
    10: 40,    // 2.5rem
    12: 48,    // 3rem
    16: 64,    // 4rem
    20: 80,    // 5rem
    24: 96,    // 6rem
  } as const,

  /** Border radius scale */
  radius: {
    none: 0,
    sm: 4,     // subtle rounding
    DEFAULT: 8,
    md: 12,    // cards, inputs
    lg: 16,    // modals, large cards
    xl: 20,
    '2xl': 24,
    full: 9999,
  } as const,

  /** Typography scale - mobile-first */
  fontSize: {
    xs: ['10px', { lineHeight: '14px' }],
    sm: ['12px', { lineHeight: '16px' }],
    base: ['14px', { lineHeight: '20px' }],
    md: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['20px', { lineHeight: '28px' }],
    '2xl': ['24px', { lineHeight: '32px' }],
    '3xl': ['30px', { lineHeight: '36px' }],
  } as const,

  /** Font weights */
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  } as const,

  /** Shadow scale - for elevation hierarchy */
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  } as const,

  /** Brand colors - Airtel palette */
  colors: {
    primary: {
      DEFAULT: '#E40000',
      light: '#FF1A1A',
      dark: '#B30000',
      muted: 'rgba(228, 0, 0, 0.15)',
    },
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  } as const,
} as const;

export type Spacing = keyof typeof tokens.spacing;
export type Radius = keyof typeof tokens.radius;
