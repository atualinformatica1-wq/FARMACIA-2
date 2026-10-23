export type ThemeColorPreset = 'emerald' | 'blue' | 'red' | 'cyan' | 'purple' | 'orange';

export interface ThemePresetOption {
  id: ThemeColorPreset;
  name: string;
  description: string;
  primaryHex: string;
  palette: Record<number, string>;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'emerald',
    name: 'Verde Farmácia',
    description: 'Tradicional, saúde e bem-estar (Padrão)',
    primaryHex: '#059669',
    palette: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
  },
  {
    id: 'blue',
    name: 'Azul Confiança',
    description: 'Estilo Drogarias Pacheco, Pague Menos',
    primaryHex: '#2563eb',
    palette: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
  {
    id: 'red',
    name: 'Vermelho Drogaria',
    description: 'Estilo Drogasil, Droga Raia',
    primaryHex: '#dc2626',
    palette: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
  },
  {
    id: 'cyan',
    name: 'Ciano & Menta',
    description: 'Farmácia moderna e manipulados',
    primaryHex: '#0891b2',
    palette: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
  },
  {
    id: 'purple',
    name: 'Roxo Bem-Estar',
    description: 'Dermocosméticos e cuidados pessoais',
    primaryHex: '#7c3aed',
    palette: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
    },
  },
  {
    id: 'orange',
    name: 'Laranja Vitalidade',
    description: 'Energia, suplementos e vitaminas',
    primaryHex: '#ea580c',
    palette: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
  },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

function mix(
  rgb: { r: number; g: number; b: number },
  target: { r: number; g: number; b: number },
  weight: number
): string {
  const r = Math.round(rgb.r * (1 - weight) + target.r * weight);
  const g = Math.round(rgb.g * (1 - weight) + target.g * weight);
  const b = Math.round(rgb.b * (1 - weight) + target.b * weight);
  return `rgb(${r}, ${g}, ${b})`;
}

export function applyTheme(presetId?: ThemeColorPreset, customHex?: string) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  let palette: Record<number, string>;

  if (customHex && customHex.trim().length >= 4) {
    const rgb = hexToRgb(customHex);
    if (rgb) {
      const white = { r: 255, g: 255, b: 255 };
      const black = { r: 0, g: 0, b: 0 };
      palette = {
        50: mix(rgb, white, 0.92),
        100: mix(rgb, white, 0.82),
        200: mix(rgb, white, 0.65),
        300: mix(rgb, white, 0.45),
        400: mix(rgb, white, 0.25),
        500: customHex,
        600: customHex,
        700: mix(rgb, black, 0.15),
        800: mix(rgb, black, 0.35),
        900: mix(rgb, black, 0.55),
        950: mix(rgb, black, 0.75),
      };
    } else {
      const matched = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
      palette = matched.palette;
    }
  } else {
    const matched = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
    palette = matched.palette;
  }

  // Set the CSS variables for emerald (the default brand color) and brand
  for (const [shade, color] of Object.entries(palette)) {
    root.style.setProperty(`--color-emerald-${shade}`, color);
    root.style.setProperty(`--brand-${shade}`, color);
  }
}
