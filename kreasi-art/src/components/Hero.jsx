import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useStore } from '../store/useStore.js'
import { scrollToTarget } from '../hooks/useLenis.js'

gsap.registerPlugin(SplitText)

export default function Hero() {
  const root = useRef()
  const loaded = useStore((s) => s.loaded)

  useEffect(() => {
    if (!loaded) return
    const el = root.current
    let split
    const ctx = gsap.context(() => {
      const run = () => {
        split = new SplitText(el.querySelector('.hero__title'), {
          type: 'lines,words,chars',
          linesClass: 'line',
        })
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from(split.chars, {
          yPercent: 120,
          rotate: 4,
          duration: 1.1,
          stagger: 0.022,
        })
          .from('.hero__kicker', { y: 24, opacity: 0, duration: 0.7 }, '-=0.7')
          .from('.hero__sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
          .from('.hero__actions > *', { y: 26, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.55')
          .from('.hero__scroll', { opacity: 0, duration: 0.8 }, '-=0.3')
      }
      // Split only after webfonts settle so line breaks are correct
      if (document.fonts?.status === 'loaded') run()
      else document.fonts.ready.then(run).catch(run)
    }, el)
    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [loaded])

  return (
    <section id="beranda" className="hero" data-theme="studio" ref={root}>
      <div className="container">
        <div className="hero__kicker">
          <span className="hero__kicker-dot" />
          Studio Seni &amp; Terapi Kreatif — Jakarta
        </div>
        <h1 className="hero__title" style={{ visibility: loaded ? 'visible' : 'hidden' }}>
          Menenangkan <em>pikiran,</em> sambil berkarya
        </h1>
        <p className="hero__sub">
          arte.coffee adalah ruang aman untuk melepas penat lewat seni. Dari batik gutta
          tamarind hingga pottery — tak perlu bakat, cukup rasa ingin mencoba.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => scrollToTarget('#workshops')}>
            Jelajahi Workshop <span className="arrow">→</span>
          </button>
          <button className="btn btn--ghost" onClick={() => scrollToTarget('#tentang')}>
            Kenali Studio Kami
          </button>
        </div>
      </div>
      <div className="hero__scroll">
        Gulir
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
