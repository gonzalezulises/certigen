import { Font } from '@alexandernanberg/react-pdf-renderer';
import { FontFamily } from '../config/schema';

// Track if fonts have been registered
let fontsRegistered = false;

export const registerFonts = (baseUrl?: string) => {
  // Only register once to avoid internal state issues
  if (fontsRegistered) return;

  // Use provided baseUrl or fallback to window.location.origin or env variable
  const fontBaseUrl = baseUrl
    || (typeof window !== 'undefined' ? window.location.origin : '')
    || process.env.NEXT_PUBLIC_BASE_URL
    || 'http://localhost:3000';

  console.log('Registering fonts with baseUrl:', fontBaseUrl);

  // Sans (Inter)
  Font.register({
    family: 'Sans',
    fonts: [
      { src: `${fontBaseUrl}/fonts/Inter-Regular.ttf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/fonts/Inter-Medium.ttf`, fontWeight: 500 },
      { src: `${fontBaseUrl}/fonts/Inter-Bold.ttf`, fontWeight: 700 },
      { src: `${fontBaseUrl}/fonts/Inter-Black.ttf`, fontWeight: 900 },
    ],
  });

  // Serif (Merriweather)
  Font.register({
    family: 'Serif',
    fonts: [
      { src: `${fontBaseUrl}/fonts/Merriweather-Regular.ttf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/fonts/Merriweather-Bold.ttf`, fontWeight: 700 },
    ],
  });

  // Script (Great Vibes)
  Font.register({
    family: 'Script',
    src: `${fontBaseUrl}/fonts/GreatVibes-Regular.ttf`,
  });

  // Slab (Roboto Slab)
  Font.register({
    family: 'Slab',
    fonts: [
      { src: `${fontBaseUrl}/fonts/RobotoSlab-Regular.ttf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/fonts/RobotoSlab-Bold.ttf`, fontWeight: 700 },
    ],
  });

  // Display (alias de Script para títulos decorativos)
  Font.register({
    family: 'Display',
    src: `${fontBaseUrl}/fonts/GreatVibes-Regular.ttf`,
  });

  // Configurar hyphenation callback para evitar guiones
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
};

/**
 * Ensure fonts are registered and loaded before PDF generation
 */
export const loadFonts = async (): Promise<void> => {
  // Register fonts if not already done
  if (!fontsRegistered) {
    registerFonts();
  }

  // Preload all font families to avoid encoding errors
  try {
    await Promise.all([
      Font.load({ fontFamily: 'Sans' }),
      Font.load({ fontFamily: 'Serif' }),
      Font.load({ fontFamily: 'Script' }),
      Font.load({ fontFamily: 'Slab' }),
      Font.load({ fontFamily: 'Display' }),
    ]);
    console.log('All fonts preloaded successfully');
  } catch (error) {
    console.error('Font preloading error:', error);
    // Continue anyway - fonts may still load on-demand
  }
};

// Mapeo de nombres de fuente a familias registradas
// Using built-in PDF fonts for testing
export const fontFamilyMap: Record<FontFamily, string> = {
  serif: 'Times-Roman',
  sans: 'Helvetica',
  script: 'Helvetica',
  slab: 'Courier',
  display: 'Helvetica',
};

// Mapeo de pesos de fuente
export const fontWeightMap: Record<'normal' | 'medium' | 'bold' | 'black', number> = {
  normal: 400,
  medium: 500,
  bold: 700,
  black: 900,
};
