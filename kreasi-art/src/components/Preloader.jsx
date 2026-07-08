import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore.js'

export default function Preloader() {
  const root = useRef()
  const setLoaded = useStore((s) => s.setLoaded)

  useEffect(() => {
    const el = root.current
    const letters = el.querySelectorAll('.preloader__logo span')
    const tl = gsap.timeline()

    tl.from(letters, {
      yPercent: 110,
      stagger: 0.05,
      duration: 0.7,
      ease: 'power3.out',
    })
      .to('.preloader__bar-fill', { width: '100%', duration: 1.1, ease: 'power2.inOut' }, '-=0.3')
      .to(letters, {
        yPercent: -110,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power3.in',
      })
      .to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onStart: () => setLoaded(true),
      })
      .set(el, { display: 'none' })

    return () => tl.kill()
  }, [setLoaded])

  const word = 'kreasi.art'

  return (
    <div className="preloader" ref={root}>
      <div className="preloader__logo" aria-label="kreasi.art">
        {word.split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>
      <div className="preloader__bar">
        <div className="preloader__bar-fill" />
      </div>
      <div className="preloader__tag">Terapi Seni Kreatif</div>
    </div>
  )
}
