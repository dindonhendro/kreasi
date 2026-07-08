import { lazy, Suspense, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Scene = lazy(() => import('./three/Scene.jsx'))
import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Categories from './components/Categories.jsx'
import Workshops from './components/Workshops.jsx'
import WorkshopModal from './components/WorkshopModal.jsx'
import Journey from './components/Journey.jsx'
import Cafe from './components/Cafe.jsx'
import Footer from './components/Footer.jsx'
import Portal from './components/Portal.jsx'
import { useLenis } from './hooks/useLenis.js'
import { useStore, THEMES } from './store/useStore.js'
import { getCurrentSession } from './api/client.js'

gsap.registerPlugin(ScrollTrigger)

// Adaptive theme (PRD §4.1): each section declares data-theme; as it enters
// the viewport we tween the CSS variables AND the store, so the DOM palette
// and the Three.js scene shift together.
function useAdaptiveTheme(loaded) {
  useEffect(() => {
    if (!loaded) return

    const triggers = gsap.utils.toArray('[data-theme]').map((sec) =>
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) useStore.getState().setThemeName(sec.dataset.theme)
        },
      }),
    )

    const applyTheme = (name) => {
      const t = THEMES[name]
      if (!t) return
      gsap.to(document.documentElement, {
        '--bg': t.bg,
        '--bg-soft': t.bgSoft,
        '--ink': t.ink,
        '--ink-soft': t.inkSoft,
        '--accent': t.accent,
        '--accent-2': t.accent2,
        '--card': t.card,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    let prev = useStore.getState().themeName
    const unsub = useStore.subscribe((state) => {
      if (state.themeName !== prev) {
        prev = state.themeName
        applyTheme(state.themeName)
      }
    })

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      triggers.forEach((t) => t.kill())
      unsub()
      clearTimeout(refresh)
    }
  }, [loaded])
}

// Hydrate the auth session on startup (SDK refreshes via httpOnly cookie).
function useAuthHydration() {
  const setSession = useStore((s) => s.setSession)
  const clearSession = useStore((s) => s.clearSession)
  const setPortalOpen = useStore((s) => s.setPortalOpen)

  useEffect(() => {
    let cancelled = false
    getCurrentSession()
      .then((session) => {
        if (cancelled) return
        if (session) setSession(session.user, session.profile)
        else clearSession()
      })
      .catch(() => !cancelled && clearSession())

    if (location.hash === '#portal') setPortalOpen(true)
    return () => {
      cancelled = true
    }
  }, [setSession, clearSession, setPortalOpen])
}

export default function App() {
  const loaded = useStore((s) => s.loaded)
  useLenis()
  useAdaptiveTheme(loaded)
  useAuthHydration()

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Preloader />
      <Navbar />
      <main className="site-content">
        <Hero />
        <Marquee />
        <About />
        <Categories />
        <Workshops />
        <Cafe />
        <Journey />
        <Footer />
      </main>
      <WorkshopModal />
      <Portal />
    </>
  )
}
