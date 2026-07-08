import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { scrollToTarget } from '../hooks/useLenis.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function Footer() {
  const root = useRef()

  useEffect(() => {
    let split
    const ctx = gsap.context(() => {
      const run = () => {
        split = new SplitText('.cta__title', { type: 'words' })
        gsap.from(split.words, {
          y: 60,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.cta__title', start: 'top 85%' },
        })
      }
      if (document.fonts?.status === 'loaded') run()
      else document.fonts.ready.then(run).catch(run)

      gsap.from('.cta__sub, .cta .btn', {
        y: 34,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cta__sub', start: 'top 88%' },
      })
    }, root)
    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [])

  const year = new Date().getFullYear()

  return (
    <div ref={root} data-theme="dusk">
      <section className="cta" id="kontak">
        <div className="container">
          <h2 className="cta__title">
            Pikiranmu berhak <em>beristirahat</em> sambil berkarya
          </h2>
          <p className="cta__sub">
            Kursi workshop terbatas setiap minggunya. Amankan sesimu sekarang, atau tanya
            kami dulu — kami senang mengobrol.
          </p>
          <button className="btn btn--primary" onClick={() => scrollToTarget('#workshops')}>
            Mulai Berkarya <span className="arrow">→</span>
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div>
              <div className="footer__logo">
                arte<em>.coffee</em>
              </div>
              <p className="footer__tag">
                Terapi Seni Kreatif: Menenangkan Pikiran Sambil Berkarya.
              </p>
            </div>
            <div className="footer__cols">
              <div className="footer__col">
                <h4>Jelajah</h4>
                <a href="#tentang" onClick={(e) => { e.preventDefault(); scrollToTarget('#tentang') }}>Tentang</a>
                <a href="#kategori" onClick={(e) => { e.preventDefault(); scrollToTarget('#kategori') }}>Kategori</a>
                <a href="#workshops" onClick={(e) => { e.preventDefault(); scrollToTarget('#workshops') }}>Workshop</a>
                <a href="#cafe" onClick={(e) => { e.preventDefault(); scrollToTarget('#cafe') }}>Café</a>
              </div>
              <div className="footer__col">
                <h4>Studio</h4>
                <a href="mailto:halo@arte.coffee">halo@arte.coffee</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://wa.me/6281200000000" target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
              <div className="footer__col">
                <h4>Untuk Pengajar</h4>
                <a href="#kontak" onClick={(e) => e.preventDefault()}>Portal Instruktur</a>
                <a href="#kontak" onClick={(e) => e.preventDefault()}>Gabung Mengajar</a>
              </div>
            </div>
          </div>
          <div className="footer__base">
            <span>© {year} arte.coffee — Semua karya milik pembuatnya.</span>
            <span>Dibuat dengan tanah liat, benang, dan sedikit kode.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
