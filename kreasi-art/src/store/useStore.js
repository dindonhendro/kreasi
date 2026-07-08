import { create } from 'zustand'

// Section palettes — the 3D scene and CSS variables both read from these,
// so DOM and WebGL shift together as the user scrolls ("adaptive theme").
export const THEMES = {
  studio: {
    bg: '#f4eee2',
    bgSoft: '#ece3d0',
    ink: '#2e241f',
    inkSoft: '#5c4d42',
    accent: '#d96f43',
    accent2: '#8a9a72',
    card: '#fbf7ee',
  },
  batik: {
    bg: '#f1e9dc',
    bgSoft: '#e7dbc6',
    ink: '#2b2117',
    inkSoft: '#5f4c36',
    accent: '#b0722a',
    accent2: '#7c8a5a',
    card: '#faf4e8',
  },
  pottery: {
    bg: '#efe4da',
    bgSoft: '#e4d4c6',
    ink: '#33241c',
    inkSoft: '#6b5040',
    accent: '#c05f38',
    accent2: '#96a07e',
    card: '#f9f0e8',
  },
  calm: {
    bg: '#e9ede3',
    bgSoft: '#dde3d3',
    ink: '#28302a',
    inkSoft: '#4f5c50',
    accent: '#6f8a5e',
    accent2: '#d0965a',
    card: '#f4f6ef',
  },
  dusk: {
    bg: '#2e241f',
    bgSoft: '#3a2d26',
    ink: '#f4eee2',
    inkSoft: '#c9b8a6',
    accent: '#e08c5f',
    accent2: '#9db089',
    card: '#3a2d26',
  },
}

export const useStore = create((set) => ({
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),

  themeName: 'studio',
  setThemeName: (themeName) => set({ themeName }),

  // Accent color pushed by hovered category cards → 3D particle tint
  hoverColor: null,
  setHoverColor: (hoverColor) => set({ hoverColor }),

  // Incrementing counter → each bump triggers a particle burst in the scene
  burst: 0,
  triggerBurst: () => set((s) => ({ burst: s.burst + 1 })),

  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),

  activeWorkshop: null,
  setActiveWorkshop: (activeWorkshop) => set({ activeWorkshop }),

  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),

  // ---- auth / portal ----
  user: null,
  profile: null, // { id, name, role: 'user' | 'instructor' | 'admin' }
  authLoading: true,
  setSession: (user, profile) => set({ user, profile, authLoading: false }),
  clearSession: () => set({ user: null, profile: null, authLoading: false }),

  portalOpen: false,
  setPortalOpen: (portalOpen) => set({ portalOpen }),

  // Bumped after portal mutations / registrations so the public grid refetches
  catalogVersion: 0,
  bumpCatalog: () => set((s) => ({ catalogVersion: s.catalogVersion + 1 })),
}))
