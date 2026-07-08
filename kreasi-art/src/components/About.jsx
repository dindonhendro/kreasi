import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: 1200, suffix: '+', label: 'Peserta telah berkarya' },
  { num: 6, suffix: '', label: 'Kategori seni terapi' },
  { num: 14, suffix: '', label: 'Instruktur berpengalaman' },
  { num: 4.9, suffix: '★', label: 'Rating kepuasan peserta', decimal: true },
]

export default function About() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.about__body p').forEach((p) => {
        gsap.from(p, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: p, start: 'top 85%' },
        })
      })

      gsap.from('.about__stats', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__stats', start: 'top 85%' },
      })

      gsap.utils.toArray('.stat__num').forEach((el) => {
        const end = parseFloat(el.dataset.value)
        const decimal = el.dataset.decimal === 'true'
        const counter = { v: 0 }
        gsap.to(counter, {
          v: end,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.firstChild.textContent = decimal
              ? counter.v.toFixed(1)
              : Math.round(counter.v).toLocaleString('id-ID')
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="tentang" data-theme="calm" ref={root}>
      <div className="container">
        <div className="section-label">Tentang Kami</div>
        <div className="about__grid">
          <div className="about__body">
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>
              Studio digital yang terasa seperti <em>rumah seni</em>
            </h2>
            <p>
              Di tengah hari-hari yang riuh, <strong>kreasi.art</strong> hadir sebagai
              tempat berteduh. Kami percaya proses berkarya — memijat tanah liat,
              menorehkan gutta di atas kain, menusukkan benang — adalah bentuk meditasi
              yang paling jujur.
            </p>
            <p>
              Workshop kami dirancang untuk <strong>semua usia dan semua level</strong>.
              Tidak ada karya yang salah di sini; yang ada hanya cerita yang berbeda-beda
              di setiap tangan.
            </p>
            <p>
              Dipandu instruktur yang sabar dan hangat, setiap sesi ditutup dengan satu
              hal yang sama: pulang membawa karya, dan pikiran yang lebih ringan.
            </p>
          </div>
          <div className="about__stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__num" data-value={s.num} data-decimal={s.decimal ? 'true' : 'false'}>
                  <span>0</span>
                  {s.suffix}
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
