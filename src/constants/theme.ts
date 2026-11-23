/**
 * Sweet Candy Bonbon — CANDY_SWEET preset, CLAYMORPHISM surfaces.
 * Every colour / radius / shadow used by the app comes from here.
 */

export const theme = {
  name: 'candy-sweet',

  colors: {
    bg: {
      primary: '#FFF0F5',
      surface: '#FFFFFF',
      sunken: '#F8E8F0',
      alt: '#FFE0EB',
      locked: '#F3E6EE',
    },
    primary: '#FF2E86',
    primarySoft: '#FF6BB0',
    secondary: '#9B59B6',
    secondarySoft: '#C27BDE',
    gold: '#FFB300',
    goldSoft: '#FFD36B',
    mint: '#3FD0A6',
    caramel: '#FF8A3D',
    info: '#5B8DEF',
    text: {
      primary: '#4A2040',
      secondary: '#8A5E7E',
      tertiary: '#B38AA4',
      inverse: '#FFFFFF',
    },
    border: '#FFE0EB',
    borderWarm: '#FFD28A',
    borderSoft: '#FFD9EC',
    loader: {
      from: '#3A1630',
      mid: '#6E2458',
      to: '#A8347F',
      plate: '#5A2048',
      text: '#FFFFFF',
      sub: '#FFC2E2',
      caption: '#F7D4E8',
    },
  },

  /** Five ingredient candies — distinguishable hues, matching sprite_1..sprite_5. */
  ingredients: [
    { key: 'strawberry', name: 'STRAWBERRY', color: '#FF4F7B', soft: '#FF88A4', glyph: 'circle' },
    { key: 'lemon', name: 'LEMON', color: '#FFC531', soft: '#FFDE86', glyph: 'triangle' },
    { key: 'grape', name: 'GRAPE', color: '#9B59B6', soft: '#C390DA', glyph: 'square' },
    { key: 'mint', name: 'MINT', color: '#3FD0A6', soft: '#8AE6CE', glyph: 'drop' },
    { key: 'caramel', name: 'CARAMEL', color: '#FF8A3D', soft: '#FFB688', glyph: 'star' },
  ] as const,

  gradients: {
    menu: ['rgba(255,227,241,0.92)', 'rgba(255,217,236,0.90)', 'rgba(246,230,255,0.94)'],
    game: ['rgba(255,240,247,0.95)', 'rgba(255,233,245,0.93)', 'rgba(252,240,255,0.96)'],
    library: ['rgba(244,232,255,0.93)', 'rgba(255,226,243,0.92)', 'rgba(246,230,255,0.95)'],
    loader: ['#3A1630', '#6E2458', '#A8347F'],
    win: ['rgba(255,214,236,0.92)', 'rgba(255,243,214,0.92)'],
    lose: ['rgba(240,226,238,0.94)', 'rgba(226,214,238,0.94)'],
    pink: ['#FF2E86', '#FF6BB0'],
    grape: ['#9B59B6', '#C27BDE'],
    gold: ['#FFB300', '#FFD36B'],
    caramel: ['#FF8A3D', '#FFB06B'],
    muted: ['#C9B3C2', '#DCCBD6'],
  },

  radius: { sm: 12, md: 18, lg: 24, xl: 28, xxl: 32, pill: 100 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  type: {
    hero: { fontSize: 42, fontWeight: '900' as const, letterSpacing: 1.2 },
    outcome: { fontSize: 30, fontWeight: '900' as const, letterSpacing: 1 },
    title: { fontSize: 26, fontWeight: '800' as const },
    screenTitle: { fontSize: 20, fontWeight: '800' as const, letterSpacing: 1 },
    section: { fontSize: 18, fontWeight: '800' as const },
    body: { fontSize: 15, fontWeight: '600' as const },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1 },
    number: { fontSize: 24, fontWeight: '900' as const },
  },

  /** Claymorphism: soft outer shadow in a deeper tone of the surface hue. */
  shadow: {
    clay: {
      shadowColor: '#E0A7C6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 5,
    },
    clayLg: {
      shadowColor: '#E0A7C6',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 8,
    },
    pink: {
      shadowColor: '#D81B6E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.38,
      shadowRadius: 20,
      elevation: 9,
    },
    dark: {
      shadowColor: '#1E0A19',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
      elevation: 10,
    },
  },

  spring: {
    ui: { tension: 60, friction: 9 },
    press: { tension: 300, friction: 12 },
    board: { tension: 90, friction: 11 },
  },
} as const;

export type Theme = typeof theme;
export const INGREDIENT_COUNT = theme.ingredients.length;
