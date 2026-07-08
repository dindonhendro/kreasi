import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fetchWorkshops } from '../api/client.js'
import { AGE_GROUPS, TYPES, DURATIONS, CATEGORIES } from '../data/workshops.js'
import { CardArt } from './Art.jsx'
import { useStore } from '../store/useStore.js'

gsap.registerPlugin(ScrollTrigger)

export const formatIDR = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const durationLabel = (d) => (d < 1 ? `${d * 60} mnt` : `${d} jam`)

function matchDuration(filter, d) {
  if (filter === 'Semua') return true
  if (filter === '< 2 jam') return d < 2
  if (filter === '2-3 jam') return d >= 2 && d <= 3
  return d > 3
}

export default function Workshops() {
  const root = useRef()
  const grid = useRef()
  const [workshops, setWorkshops] = useState([])
  const [age, setAge] = useState('Semua')
  const [type, setType] = useState('Semua')
  const [duration, setDuration] = useState('Semua')
  const setActiveWorkshop = useStore((s) => s.setActiveWorkshop)
  const catalogVersion = useStore((s) => s.catalogVersion)

  useEffect(() => {
    let alive = true
    fetchWorkshops().then((data) => {
      if (!alive) return
      setWorkshops(data)
      // Grid height changed — recompute scroll-linked animation positions
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    return () => {
      alive = false
    }
  }, [catalogVersion])

  const filtered = useMemo(
    () =>
      workshops.filter(
        (w) =>
          (age === 'Semua' || w.ageGroup === age) &&
          (type === 'Semua' || w.category === type) &&
          matchDuration(duration, w.duration),
      ),
    [workshops, age, type, duration],
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ws-head', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ws-head', start: 'top 85%' },
      })
      gsap.from('.filters', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.filters', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Re-animate cards every time the filtered list changes
  useEffect(() => {
    if (!grid.current || filtered.length === 0) return
    const cards = grid.current.querySelectorAll('.ws-card')
    const tween = gsap.fromTo(
      cards,
      { y: 44, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.65, ease: 'power3.out', overwrite: true },
    )
    return () => tween.kill()
  }, [filtered])

  const catColor = (categoryId) => CATEGORIES.find((c) => c.id === categoryId)?.color ?? '#d96f43'

  return (
    <section id="workshops" data-theme="pottery" ref={root}>
      <div className="container">
        <div className="ws-head">
          <div className="section-label">Jadwal Workshop</div>
          <h2 className="section-title">
            Temukan sesi yang <em>memanggilmu</em>
          </h2>
        </div>

        <div className="filters" role="group" aria-label="Filter workshop">
          {[
            { label: 'Kelompok Usia', options: AGE_GROUPS, value: age, set: setAge },
            { label: 'Jenis', options: TYPES, value: type, set: setType },
            { label: 'Durasi', options: DURATIONS, value: duration, set: setDuration },
          ].map((g) => (
            <div className="filter-group" key={g.label}>
              <span className="filter-group__label">{g.label}</span>
              <div className="filter-group__chips">
                {g.options.map((opt) => (
                  <button
                    key={opt}
                    className={`chip ${g.value === opt ? 'is-active' : ''}`}
                    onClick={() => g.set(opt)}
                    aria-pressed={g.value === opt}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ws-grid" ref={grid}>
          {filtered.map((w) => (
            <article
              key={w.id}
              className="ws-card"
              onClick={() => setActiveWorkshop(w)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveWorkshop(w)}
            >
              <div className="ws-card__art">
                <CardArt id={w.id} color={catColor(w.categoryId)} />
                <span className="ws-card__badge">{w.category}</span>
              </div>
              <div className="ws-card__body">
                <div className="ws-card__meta">
                  <span>◷ {durationLabel(w.duration)}</span>
                  <span>☺ {w.ageGroup}</span>
                  <span>✎ {w.instructor}</span>
                </div>
                <h3 className="ws-card__title">{w.title}</h3>
                <p className="ws-card__desc">{w.description}</p>
                <div className="ws-card__foot">
                  <span className="ws-card__price">{formatIDR(w.price)}</span>
                  <span className="ws-card__cta">
                    Detail <span className="arrow">→</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && workshops.length > 0 && (
            <div className="ws-empty">
              <strong>Belum ada sesi yang cocok</strong>
              Coba longgarkan filternya — atau hubungi kami untuk sesi privat.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
