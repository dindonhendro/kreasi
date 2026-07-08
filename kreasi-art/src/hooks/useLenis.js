import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore.js'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function useLenis() {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const setScrollProgress = useStore.getState().setScrollProgress

    lenis.on('scroll', (e) => {
      ScrollTrigger.update()
      const max = e.limit || 1
      setScrollProgress(Math.min(1, e.scroll / max))
    })

    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenis = null
    }
  }, [])
}
