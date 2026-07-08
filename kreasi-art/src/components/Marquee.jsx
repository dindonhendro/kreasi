import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const ITEMS = [
  'Batik Gutta Tamarind',
  'Pottery',
  'Punch Needle',
  'Art Journaling',
  'Tie Dye',
  'Ecoprint',
  'Melukis Akrilik',
  'Cat Air',
]

export default function Marquee() {
  const track = useRef()

  useEffect(() => {
    const tween = gsap.to(track.current, {
      xPercent: -50,
      duration: 28,
      ease: 'none',
      repeat: -1,
    })
    const el = track.current
    const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.5 })
    const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.5 })
    el.parentElement.addEventListener('mouseenter', slow)
    el.parentElement.addEventListener('mouseleave', fast)
    return () => {
      tween.kill()
      el.parentElement?.removeEventListener('mouseenter', slow)
      el.parentElement?.removeEventListener('mouseleave', fast)
    }
  }, [])

  const strip = (key) => (
    <div className="marquee__item" key={key} aria-hidden={key > 0}>
      {ITEMS.map((it) => (
        <span key={it} style={{ display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
          {it} <i>✦</i>
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee">
      <div className="marquee__track" ref={track}>
        {strip(0)}
        {strip(1)}
      </div>
    </div>
  )
}
