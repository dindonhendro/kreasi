import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { scrollToTarget } from '../hooks/useLenis.js'
import { useStore } from '../store/useStore.js'

const LINKS = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#kategori', label: 'Kategori' },
  { href: '#workshops', label: 'Workshop' },
  { href: '#cafe', label: 'Café' },
  { href: '#perjalanan', label: 'Cara Ikut' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const menuOpen = useStore((s) => s.menuOpen)
  const setMenuOpen = useStore((s) => s.setMenuOpen)
  const setPortalOpen = useStore((s) => s.setPortalOpen)
  const profile = useStore((s) => s.profile)
  const mobileRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    gsap.to(mobileRef.current, {
      clipPath: menuOpen
        ? 'circle(150% at calc(100% - 3rem) 2.4rem)'
        : 'circle(0% at calc(100% - 3rem) 2.4rem)',
      duration: 0.8,
      ease: 'power3.inOut',
    })
    if (menuOpen) {
      gsap.fromTo(
        mobileRef.current.querySelectorAll('a'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, delay: 0.35, duration: 0.6, ease: 'power3.out' },
      )
    }
  }, [menuOpen])

  const go = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    history.replaceState(null, '', href)
    scrollToTarget(href)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <a href="#beranda" className="nav__logo" onClick={(e) => go(e, '#beranda')}>
            arte<em>.coffee</em>
          </a>
          <nav className="nav__links" aria-label="Navigasi utama">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav__link ${active === l.href ? 'is-active' : ''}`}
                onClick={(e) => go(e, l.href)}
              >
                {l.label}
              </a>
            ))}
            <button className="nav__cta" onClick={() => setPortalOpen(true)}>
              {profile ? profile.name.split(' ')[0] : 'Masuk'}
            </button>
          </nav>
          <button
            className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`nav__mobile ${menuOpen ? 'is-open' : ''}`} ref={mobileRef}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
            {l.label}
          </a>
        ))}
        <a
          href="#portal"
          onClick={(e) => {
            e.preventDefault()
            setMenuOpen(false)
            setPortalOpen(true)
          }}
          style={{ color: 'var(--accent)' }}
        >
          {profile ? profile.name.split(' ')[0] : 'Masuk'}
        </a>
      </div>
    </>
  )
}
