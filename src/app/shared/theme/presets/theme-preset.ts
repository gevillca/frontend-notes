import { definePreset, palette } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

/**
 * Custom Aura preset for PrimeNG v20 + Tailwind v4
 *
 * Features:
 * - Blue/gray color palette consistent with Tailwind
 * - Optimized for automatic light/dark mode
 * - Compatible with Tailwind v4 CSS layers
 * - Based on PrimeNG Aura theme with customizations
 */
const ThemePresent = definePreset(Lara, {
  semantic: {
    // Primary: blue scale for main actions and interactive elements
    primary: palette('{indigo}'),
    // primary: {
    //   50: '{green.50}',
    //   100: '{green.100}',
    //   200: '{green.200}',
    //   300: '{green.300}',
    //   400: '{green.400}',
    //   500: '{green.500}',
    //   600: '{green.600}',
    //   700: '{green.700}',
    //   800: '{green.800}',
    //   900: '{green.900}',
    //   950: '{green.950}',
    // },
    // Surface: gray scale for backgrounds, surfaces, and containers
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
    },
  },
});

export default ThemePresent;
