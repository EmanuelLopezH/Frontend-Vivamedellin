/*
 * 🎨 ViveMedellín - Guía Visual de Estilos
 * 
 * Este archivo documenta todos los estilos y componentes visuales
 * utilizados en el home de ViveMedellín
 */

// ============================================
// 🎨 PALETA DE COLORES
// ============================================

export const colors = {
  // Gradientes principales
  gradients: {
    primary: "from-blue-600 to-purple-600",
    hero: "from-blue-600 via-purple-600 to-pink-600",
    background: "from-slate-50 via-blue-50 to-purple-50",
  },

  // Cards de features
  features: {
    blue: "from-blue-50 to-blue-100/50",
    purple: "from-purple-50 to-purple-100/50",
    pink: "from-pink-50 to-pink-100/50",
    orange: "from-orange-50 to-orange-100/50",
    green: "from-green-50 to-green-100/50",
    indigo: "from-indigo-50 to-indigo-100/50",
  },

  // Iconos de features
  iconBackgrounds: {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
    orange: "bg-orange-600",
    green: "bg-green-600",
    indigo: "bg-indigo-600",
  },
};

// ============================================
// 📏 ESPACIADO Y TAMAÑOS
// ============================================

export const spacing = {
  sections: {
    hero: "py-20 md:py-32",
    features: "py-20",
    cta: "py-20",
    footer: "py-12",
  },

  containers: {
    default: "container mx-auto px-4",
    hero: "max-w-4xl mx-auto",
    features: "max-w-6xl mx-auto",
  },

  cards: {
    padding: "p-8",
    iconSize: "w-12 h-12",
    iconInner: "w-6 h-6",
  },
};

// ============================================
// 🔤 TIPOGRAFÍA
// ============================================

export const typography = {
  hero: {
    title: "text-5xl md:text-7xl font-bold",
    subtitle: "text-xl text-slate-600",
    badge: "text-sm font-medium",
  },

  sections: {
    title: "text-4xl font-bold",
    subtitle: "text-xl text-slate-600",
  },

  cards: {
    title: "text-xl font-bold",
    description: "text-slate-600",
  },

  stats: {
    number: "text-3xl font-bold text-slate-900",
    label: "text-sm text-slate-600",
  },
};

// ============================================
// 🎯 COMPONENTES
// ============================================

export const components = {
  navbar: {
    container: "border-b bg-white/80 backdrop-blur-md sticky top-0 z-50",
    logo: "w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg",
    title: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
  },

  buttons: {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
    outline: "hover:bg-blue-50",
    large: "text-lg px-8",
  },

  cards: {
    feature: "p-8 rounded-2xl hover:shadow-lg transition-shadow",
    iconContainer: "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
  },

  badge: "inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium",
};

// ============================================
// 📱 RESPONSIVE BREAKPOINTS
// ============================================

export const breakpoints = {
  mobile: "< 640px",
  tablet: "640px - 1024px",
  desktop: "> 1024px",

  grid: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-2",
    desktop: "lg:grid-cols-3",
  },
};

// ============================================
// ✨ EFECTOS Y ANIMACIONES
// ============================================

export const effects = {
  hover: {
    cards: "hover:shadow-lg transition-shadow",
    buttons: "hover:from-blue-700 hover:to-purple-700",
  },

  blur: {
    navbar: "backdrop-blur-md",
  },

  transitions: {
    default: "transition-shadow",
  },
};

// ============================================
// 📋 ESTRUCTURA DE LA PÁGINA
// ============================================

export const pageStructure = `
┌─────────────────────────────────────┐
│         NAVBAR (sticky)              │
│  Logo + Title | Login + Register     │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│  - Badge                            │
│  - Title (gradient)                 │
│  - Subtitle                         │
│  - 2 CTAs                           │
│  - Stats (3 columns)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      FEATURES SECTION               │
│  - Section Title                    │
│  - 6 Feature Cards (3 columns)      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         CTA SECTION                 │
│  - Icon                             │
│  - Title                            │
│  - Description                      │
│  - CTA Button                       │
│  (Full width gradient bg)           │
│                                     │
├─────────────────────────────────────┤
│         FOOTER                      │
│  Logo | Copyright                   │
└─────────────────────────────────────┘

MODALS (overlays):
- LoginDialog
- RegisterDialog
`;

// ============================================
// 🔑 DATOS DE PRUEBA
// ============================================

export const testUsers = [
  { username: "Steven", password: "1234", role: "admin" },
  { username: "Dahiana", password: "abcd", role: "user" },
  { username: "Andrés", password: "1234", role: "user" },
  { username: "Lucas", password: "abcd", role: "user" },
];

export const stats = {
  events: "500+",
  users: "50K+",
  places: "100+",
};

// ============================================
// 📦 EXPORT DEFAULT
// ============================================

export default {
  colors,
  spacing,
  typography,
  components,
  breakpoints,
  effects,
  pageStructure,
  testUsers,
  stats,
};
