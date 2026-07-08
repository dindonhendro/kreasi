import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES } from '../data/workshops.js'
import { CategoryIcon } from './Art.jsx'
import { useStore } from '../store/useStore.js'
import { scrollToTarget } from '../hooks/useLenis.js'

gsap.registerPlugin(ScrollTrigger)

export default function Categories() {
  const root = useRef()
  const setHoverColor = useStore((s) => s.setHoverColor)
  const triggerBurst = useStore((s) => s.triggerBurst)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cats__head', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cats__head', start: 'top 85%' },
      })
      gsap.from('.cat-card', {
        y: 70,
        opacity: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cats__grid', start: 'top 82%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const onEnter = (color) => {
    setHoverColor(color)
    triggerBurst()
  }

  return (
    <section id="kategori" data-theme="batik" ref={root}>
      <div className="container">
        <div className="cats__head">
          <div>
            <div className="section-label">Kategori Workshop</div>
            <h2 className="section-title">
              Pilih <em>medium</em> ceritamu
            </h2>
          </div>
          <button className="btn btn--ghost" onClick={() => scrollToTarget('#workshops')}>
            Lihat Semua Jadwal <span className="arrow">→</span>
          </button>
        </div>
        <div className="cats__grid">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className="cat-card"
              style={{ '--cat-color': c.color }}
              onMouseEnter={() => onEnter(c.color)}
              onMouseLeave={() => setHoverColor(null)}
              onClick={() => scrollToTarget('#workshops')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollToTarget('#workshops')}
            >
              <div className="cat-card__blob" />
              <div className="cat-card__icon">
                <CategoryIcon type={c.icon} />
              </div>
              <div>
                <h3 className="cat-card__title">{c.title}</h3>
                <p className="cat-card__desc">{c.desc}</p>
                <span className="cat-card__links">
                  <span className="cat-card__link">
                    Lihat kelas <span className="arrow">→</span>
                  </span>
                  <a
                    className="cat-card__link cat-card__link--exp"
                    href={`/experience/${c.id}/index.html`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ✦ Rasakan vibe-nya
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
