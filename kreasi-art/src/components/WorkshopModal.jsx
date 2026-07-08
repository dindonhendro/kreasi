import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore.js'
import { registerForWorkshop } from '../api/client.js'
import { CATEGORIES } from '../data/workshops.js'
import { CardArt } from './Art.jsx'
import { formatIDR } from './Workshops.jsx'

export default function WorkshopModal() {
  const workshop = useStore((s) => s.activeWorkshop)
  const setActiveWorkshop = useStore((s) => s.setActiveWorkshop)
  const triggerBurst = useStore((s) => s.triggerBurst)
  const user = useStore((s) => s.user)
  const profile = useStore((s) => s.profile)
  const bumpCatalog = useStore((s) => s.bumpCatalog)

  const overlay = useRef()
  const modal = useRef()
  const [slot, setSlot] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [error, setError] = useState('')

  useEffect(() => {
    if (!workshop) return
    setSlot(null)
    setName(profile?.name ?? '')
    setEmail(user?.email ?? '')
    setStatus('idle')
    setError('')

    const tl = gsap.timeline()
    tl.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(
        modal.current,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.15',
      )

    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshop])

  if (!workshop) return null

  const close = () => {
    gsap.to(modal.current, { y: 40, opacity: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlay.current, {
      opacity: 0,
      duration: 0.35,
      delay: 0.1,
      onComplete: () => setActiveWorkshop(null),
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!slot) {
      setError('Pilih jadwal dulu ya.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      await registerForWorkshop({
        workshopId: workshop.id,
        slotId: slot,
        name,
        email,
        userId: user?.id ?? null,
      })
      setStatus('done')
      triggerBurst()
      bumpCatalog() // refresh seat counts on the public grid
    } catch (err) {
      setStatus('idle')
      setError(err.message ?? 'Pendaftaran gagal terkirim. Coba lagi ya.')
    }
  }

  const color = CATEGORIES.find((c) => c.id === workshop.categoryId)?.color ?? '#d96f43'

  return (
    <div
      className="modal-overlay"
      ref={overlay}
      onClick={(e) => e.target === overlay.current && close()}
      role="dialog"
      aria-modal="true"
      aria-label={workshop.title}
    >
      <div className="modal" ref={modal}>
        <button className="modal__close" onClick={close} aria-label="Tutup detail workshop">
          ✕
        </button>

        {status === 'done' ? (
          <div className="modal__success">
            <div className="modal__success-icon">✓</div>
            <h3>Sampai jumpa di studio!</h3>
            <p>
              Pendaftaran <strong>{workshop.title}</strong> atas nama {name} sudah kami
              terima. Detail pembayaran dan lokasi akan dikirim ke {email}.
            </p>
            <button className="btn btn--primary" onClick={close}>
              Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="modal__art">
              <CardArt id={workshop.id} color={color} />
            </div>
            <div className="modal__body">
              <h3 className="modal__title">{workshop.title}</h3>
              <div className="modal__tags">
                <span className="modal__tag">{workshop.category}</span>
                <span className="modal__tag">{workshop.ageGroup}</span>
                <span className="modal__tag">
                  {workshop.duration < 1 ? `${workshop.duration * 60} menit` : `${workshop.duration} jam`}
                </span>
                <span className="modal__tag">Maks. {workshop.maxParticipants} peserta</span>
              </div>
              <p className="modal__desc">{workshop.description}</p>
              <p className="modal__desc">
                <strong style={{ color: 'var(--ink)' }}>Instruktur:</strong> {workshop.instructor}
              </p>
              <a
                className="modal__experience"
                href={`/experience/${workshop.categoryId}/index.html`}
                target="_blank"
                rel="noreferrer"
              >
                ✦ Rasakan vibe workshop ini <span className="arrow">→</span>
              </a>

              <form onSubmit={submit} style={{ display: 'contents' }}>
                <span className="modal__slots-label">Pilih Jadwal</span>
                <div className="modal__slots">
                  {workshop.schedule.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`slot ${slot === s.id ? 'is-selected' : ''}`}
                      disabled={s.left === 0}
                      onClick={() => setSlot(s.id)}
                    >
                      {s.date} · {s.time}
                      <small>{s.left === 0 ? 'Penuh' : `Sisa ${s.left} kursi`}</small>
                    </button>
                  ))}
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-label="Nama lengkap"
                  />
                  <input
                    type="email"
                    placeholder="Alamat email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Alamat email"
                  />
                </div>

                {error && (
                  <p className="portal__error" role="alert">
                    {error}
                  </p>
                )}
                <div className="modal__foot">
                  <div className="modal__price">
                    {formatIDR(workshop.price)}
                    <small>per peserta, alat &amp; bahan termasuk</small>
                  </div>
                  <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Mengirim…' : 'Daftar Sekarang'}
                    <span className="arrow">→</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
