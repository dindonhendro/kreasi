import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Cafe() {
  const root = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cafe-head', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cafe-head', start: 'top 85%' },
      })

      gsap.from('.cafe__info', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cafe__info', start: 'top 85%' },
      })

      gsap.from('.cafe__gallery-item', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cafe__gallery', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="cafe" data-theme="studio" ref={root}>
      <div className="container">
        <div className="cafe-head" style={{ marginBottom: '2.5rem' }}>
          <div className="section-label">Café Kami</div>
          <h2 className="section-title">
            ARTē & COFFEE — <em>Seni di Setiap Seduhan</em>
          </h2>
        </div>

        <div className="cafe__layout">
          <div className="cafe__info">
            <p className="cafe__tagline">
              "Terapi Seni Kreatif: Menenangkan Pikiran Sambil Berkarya"
            </p>
            <p className="cafe__desc">
              Di samping studio workshop kami, nikmati kehangatan <strong>ARTē & COFFEE</strong>.
              Sebuah sudut nyaman yang dirancang khusus sebagai tempat kontemplasi,
              menulis jurnal, atau sekadar menikmati secangkir kopi segar di sela-sela
              kegiatan berkarya Anda.
            </p>
            
            <div className="cafe__meta-grid">
              <div className="cafe__meta-item">
                <h4>Jam Operasional</h4>
                <p>Setiap Hari | 9:00 AM - 05:00 PM</p>
              </div>
              <div className="cafe__meta-item">
                <h4>Lokasi</h4>
                <p>
                  Jl. Manunggal Jaya No.8, RT.13, Lb. Bulus, Kec. Cilandak, Jakarta Selatan,
                  Daerah Khusus Ibukota Jakarta 12440, Indonesia
                </p>
              </div>
            </div>
          </div>

          <div className="cafe__gallery">
            <div className="cafe__gallery-item cafe__gallery-item--promo">
              <img src="/cafe/cafe-promo.jpg" alt="ARTē & COFFEE Jam Buka & Flyer" />
              <div className="cafe__gallery-caption">Flyer & Jam Operasional Resmi</div>
            </div>
            <div className="cafe__gallery-item cafe__gallery-item--interior-1">
              <img src="/cafe/cafe-interior-1.jpg" alt="Suasana Bar Counter ARTē & COFFEE" />
              <div className="cafe__gallery-caption">Bar Counter & Area Seduh</div>
            </div>
            <div className="cafe__gallery-item cafe__gallery-item--interior-2">
              <img src="/cafe/cafe-interior-2.jpg" alt="Interior ARTē & COFFEE dari Kaca Depan" />
              <div className="cafe__gallery-caption">Sudut Kreatif & Cozy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
