import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    title: 'Pilih Workshop',
    desc: 'Jelajahi kategori dan temukan sesi yang cocok dengan jadwal serta suasana hatimu.',
  },
  {
    title: 'Daftar & Bayar',
    desc: 'Amankan kursimu dalam dua menit. Konfirmasi dan detail lokasi langsung masuk email.',
  },
  {
    title: 'Datang & Berkarya',
    desc: 'Semua alat dan bahan sudah kami siapkan. Kamu cukup datang dengan pikiran terbuka.',
  },
  {
    title: 'Bawa Pulang Ceritamu',
    desc: 'Pulang membawa karya buatan tangan sendiri — dan kepala yang jauh lebih ringan.',
  },
]

export default function Journey() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.journey-head', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.journey-head', start: 'top 85%' },
      })
      gsap.from('.step', {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.journey__steps', start: 'top 84%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="perjalanan" data-theme="calm" ref={root}>
      <div className="container">
        <div className="journey-head">
          <div className="section-label">Cara Ikut</div>
          <h2 className="section-title">
            Empat langkah menuju <em>tenang</em>
          </h2>
        </div>
        <div className="journey__steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step__num">0{i + 1}</div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
