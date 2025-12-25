import { Font } from '@react-pdf/renderer';
import { FontFamily } from '../config/schema';

// Registrar fuentes solo una vez
let fontsRegistered = false;

export const registerFonts = () => {
  if (fontsRegistered) return;

  // Sans (Inter)
  Font.register({
    family: 'Sans',
    fonts: [
      { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
      { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
      { src: '/fonts/Inter-Black.ttf', fontWeight: 900 },
    ],
  });

  // Serif (Merriweather)
  Font.register({
    family: 'Serif',
    fonts: [
      { src: '/fonts/Merriweather-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/Merriweather-Bold.ttf', fontWeight: 700 },
    ],
  });

  // Script (Great Vibes)
  Font.register({
    family: 'Script',
    src: '/fonts/GreatVibes-Regular.ttf',
  });

  // Slab (Roboto Slab)
  Font.register({
    family: 'Slab',
    fonts: [
      { src: '/fonts/RobotoSlab-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/RobotoSlab-Bold.ttf', fontWeight: 700 },
    ],
  });

  // Display (alias de Script para títulos decorativos)
  Font.register({
    family: 'Display',
    src: '/fonts/GreatVibes-Regular.ttf',
  });

  // Configurar hyphenation callback para evitar guiones
  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
};

// Mapeo de nombres de fuente a familias registradas
export const fontFamilyMap: Record<FontFamily, string> = {
  serif: 'Serif',
  sans: 'Sans',
  script: 'Script',
  slab: 'Slab',
  display: 'Display',
};

// Mapeo de pesos de fuente
export const fontWeightMap: Record<'normal' | 'medium' | 'bold' | 'black', number> = {
  normal: 400,
  medium: 500,
  bold: 700,
  black: 900,
};
