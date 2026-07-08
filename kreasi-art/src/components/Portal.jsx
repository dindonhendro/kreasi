import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore.js'
import { CATEGORIES } from '../data/workshops.js'
import {
  backendReady,
  signInUser,
  signUpUser,
  signOutUser,
  fetchMyRegistrations,
  fetchInstructorData,
  fetchAdminData,
  createWorkshop,
  deleteWorkshop,
  addSchedule,
  deleteSchedule,
  updateRegistrationStatus,
} from '../api/client.js'
import { formatIDR } from './Workshops.jsx'

const STATUS_OPTIONS = ['pending', 'confirmed', 'attended', 'cancelled']
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded']

const STATUS_LABEL = {
  pending: 'Menunggu',
  confirmed: 'Terkonfirmasi',
  attended: 'Hadir',
  cancelled: 'Batal',
  unpaid: 'Belum bayar',
  paid: 'Lunas',
  refunded: 'Refund',
}

/* ---------------- auth forms ---------------- */

function AuthForms() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const setSession = useStore((s) => s.setSession)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const { user, profile } =
        mode === 'login'
          ? await signInUser({ email, password })
          : await signUpUser({ name, email, password })
      setSession(user, profile)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="portal__auth">
      <div className="portal__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'login'}
          className={mode === 'login' ? 'is-active' : ''}
          onClick={() => { setMode('login'); setError('') }}
        >
          Masuk
        </button>
        <button
          role="tab"
          aria-selected={mode === 'signup'}
          className={mode === 'signup' ? 'is-active' : ''}
          onClick={() => { setMode('signup'); setError('') }}
        >
          Buat Akun
        </button>
      </div>

      <form className="portal__form" onSubmit={submit}>
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Nama lengkap"
          />
        )}
        <input
          type="email"
          placeholder="Alamat email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Alamat email"
        />
        <input
          type="password"
          placeholder="Kata sandi (min. 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          aria-label="Kata sandi"
        />
        {error && <p className="portal__error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Daftar'}
        </button>
      </form>

      <p className="portal__hint">
        Login peserta, instruktur, dan admin memakai pintu yang sama — dashboard
        menyesuaikan peranmu.
      </p>
    </div>
  )
}

/* ---------------- user dashboard (My Studio) ---------------- */

function UserDash() {
  const [regs, setRegs] = useState(null)
  const [error, setError] = useState('')
  const setPortalOpen = useStore((s) => s.setPortalOpen)

  useEffect(() => {
    fetchMyRegistrations().then(setRegs).catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="portal__error">{error}</p>
  if (!regs) return <p className="portal__loading">Memuat…</p>

  if (regs.length === 0)
    return (
      <div className="portal__empty">
        <strong>Belum ada workshop terdaftar</strong>
        <p>Jelajahi jadwal dan amankan kursi pertamamu.</p>
        <button className="btn btn--primary" onClick={() => setPortalOpen(false)}>
          Lihat Workshop
        </button>
      </div>
    )

  return (
    <div className="portal__section">
      <h3>Workshop Saya</h3>
      <div className="portal__cards">
        {regs.map((r) => (
          <div className="portal__card" key={r.id}>
            <div className="portal__card-title">{r.workshops?.title}</div>
            <div className="portal__card-meta">
              {r.workshop_schedules?.label_date} · {r.workshop_schedules?.label_time}
            </div>
            <div className="portal__badges">
              <span className={`badge badge--${r.status}`}>{STATUS_LABEL[r.status]}</span>
              <span className={`badge badge--${r.payment_status}`}>
                {STATUS_LABEL[r.payment_status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- instructor dashboard ---------------- */

function InstructorDash() {
  const user = useStore((s) => s.user)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchInstructorData(user.id).then(setData).catch((e) => setError(e.message))
  }, [user.id])

  useEffect(load, [load])

  if (error) return <p className="portal__error">{error}</p>
  if (!data) return <p className="portal__loading">Memuat…</p>

  const setStatus = async (regId, patch) => {
    try {
      await updateRegistrationStatus(regId, patch)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="portal__section">
      <h3>Kelas yang Kamu Ajar</h3>
      {data.workshops.length === 0 && <p className="portal__hint">Belum ada kelas yang ditugaskan.</p>}
      {data.workshops.map((w) => (
        <div className="portal__block" key={w.id}>
          <div className="portal__block-head">
            <strong>{w.title}</strong>
            <span className="portal__muted">{w.category}</span>
          </div>
          {(w.workshop_schedules ?? [])
            .slice()
            .sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? ''))
            .map((s) => {
              const participants = data.registrations.filter((r) => r.schedule_id === s.id)
              return (
                <div className="portal__slot" key={s.id}>
                  <div className="portal__slot-head">
                    <span>
                      {s.label_date} · {s.label_time}
                    </span>
                    <span className="portal__muted">
                      {s.seats_taken}/{s.seats_total} kursi terisi
                    </span>
                  </div>
                  {participants.length === 0 ? (
                    <p className="portal__muted portal__indent">Belum ada peserta.</p>
                  ) : (
                    <table className="portal__table">
                      <thead>
                        <tr><th>Peserta</th><th>Email</th><th>Kehadiran</th><th>Pembayaran</th></tr>
                      </thead>
                      <tbody>
                        {participants.map((r) => (
                          <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.email}</td>
                            <td>
                              <select
                                value={r.status}
                                onChange={(e) => setStatus(r.id, { status: e.target.value })}
                              >
                                {STATUS_OPTIONS.map((o) => (
                                  <option key={o} value={o}>{STATUS_LABEL[o]}</option>
                                ))}
                              </select>
                            </td>
                            <td><span className={`badge badge--${r.payment_status}`}>{STATUS_LABEL[r.payment_status]}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}

/* ---------------- admin dashboard ---------------- */

const EMPTY_WS = {
  title: '',
  description: '',
  category_id: 'batik',
  age_group: 'Adult',
  duration_hours: 2,
  price: 250000,
  instructor_id: '',
  max_participants: 12,
}

function AdminDash() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_WS)
  const [slotForms, setSlotForms] = useState({})
  const [busy, setBusy] = useState(false)
  const bumpCatalog = useStore((s) => s.bumpCatalog)

  const load = useCallback(() => {
    fetchAdminData().then(setData).catch((e) => setError(e.message))
  }, [])

  useEffect(load, [load])

  if (error && !data) return <p className="portal__error">{error}</p>
  if (!data) return <p className="portal__loading">Memuat…</p>

  const refresh = () => {
    load()
    bumpCatalog()
  }

  const run = async (fn) => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await fn()
      refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const submitWorkshop = (e) => {
    e.preventDefault()
    const instructor = data.instructors.find((i) => i.id === form.instructor_id)
    run(async () => {
      await createWorkshop({
        title: form.title,
        description: form.description,
        category: catLabel(form.category_id),
        category_id: form.category_id,
        age_group: form.age_group,
        duration_hours: Number(form.duration_hours),
        price: Number(form.price),
        instructor_name: instructor?.name ?? 'TBA',
        instructor_id: instructor?.id ?? null,
        max_participants: Number(form.max_participants),
      })
      setForm(EMPTY_WS)
    })
  }

  const submitSlot = (e, w) => {
    e.preventDefault()
    const f = slotForms[w.id] ?? {}
    run(async () => {
      await addSchedule({
        workshop_id: w.id,
        label_date: f.date,
        label_time: f.time,
        seats_total: Number(f.seats || w.max_participants),
      })
      setSlotForms((s) => ({ ...s, [w.id]: { date: '', time: '', seats: '' } }))
    })
  }

  const field = (key, props = {}) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    required: true,
    ...props,
  })

  return (
    <div className="portal__section">
      {error && <p className="portal__error" role="alert">{error}</p>}

      <h3>Tambah Workshop</h3>
      <form className="portal__form portal__form--grid" onSubmit={submitWorkshop}>
        <input type="text" placeholder="Judul workshop" {...field('title')} style={{ gridColumn: '1 / -1' }} />
        <textarea
          placeholder="Deskripsi"
          rows={3}
          {...field('description')}
          style={{ gridColumn: '1 / -1' }}
        />
        <label>
          Kategori
          <select {...field('category_id')}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>
        <label>
          Kelompok usia
          <select {...field('age_group')}>
            {['Kids', 'Adult', 'Senior'].map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
        <label>
          Instruktur
          <select {...field('instructor_id')}>
            <option value="" disabled>Pilih instruktur</option>
            {data.instructors.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </label>
        <label>
          Durasi (jam)
          <input type="number" step="0.5" min="0.5" {...field('duration_hours')} />
        </label>
        <label>
          Harga (Rp)
          <input type="number" min="0" step="5000" {...field('price')} />
        </label>
        <label>
          Maks. peserta
          <input type="number" min="1" {...field('max_participants')} />
        </label>
        <button className="btn btn--primary" disabled={busy} style={{ gridColumn: '1 / -1' }}>
          {busy ? 'Menyimpan…' : 'Simpan Workshop'}
        </button>
      </form>

      <h3>Kelola Workshop &amp; Jadwal</h3>
      {data.workshops.map((w) => {
        const slots = (w.workshop_schedules ?? [])
          .slice()
          .sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? ''))
        const sf = slotForms[w.id] ?? { date: '', time: '', seats: '' }
        return (
          <div className="portal__block" key={w.id}>
            <div className="portal__block-head">
              <strong>{w.title}</strong>
              <span className="portal__muted">
                {w.category} · {formatIDR(w.price)} · {w.instructor_name}
              </span>
              <button
                className="portal__danger"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Hapus workshop "${w.title}" beserta jadwal & pendaftarannya?`))
                    run(() => deleteWorkshop(w.id))
                }}
              >
                Hapus
              </button>
            </div>

            {slots.map((s) => {
              const regCount = data.registrations.filter((r) => r.schedule_id === s.id).length
              return (
                <div className="portal__slot-row" key={s.id}>
                  <span>{s.label_date} · {s.label_time}</span>
                  <span className="portal__muted">
                    {s.seats_taken}/{s.seats_total} terisi · {regCount} pendaftaran
                  </span>
                  <button
                    className="portal__danger"
                    disabled={busy}
                    onClick={() => {
                      if (confirm('Hapus jadwal ini?')) run(() => deleteSchedule(s.id))
                    }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}

            <form className="portal__slot-add" onSubmit={(e) => submitSlot(e, w)}>
              <input
                type="text"
                placeholder="cth: Sab, 1 Agu 2026"
                value={sf.date}
                onChange={(e) => setSlotForms((s) => ({ ...s, [w.id]: { ...sf, date: e.target.value } }))}
                required
              />
              <input
                type="text"
                placeholder="cth: 09.00"
                value={sf.time}
                onChange={(e) => setSlotForms((s) => ({ ...s, [w.id]: { ...sf, time: e.target.value } }))}
                required
              />
              <input
                type="number"
                placeholder={`Kursi (${w.max_participants})`}
                min="1"
                value={sf.seats}
                onChange={(e) => setSlotForms((s) => ({ ...s, [w.id]: { ...sf, seats: e.target.value } }))}
              />
              <button className="btn btn--ghost" disabled={busy}>+ Jadwal</button>
            </form>
          </div>
        )
      })}

      <h3>Semua Pendaftaran</h3>
      {data.registrations.length === 0 ? (
        <p className="portal__hint">Belum ada pendaftaran.</p>
      ) : (
        <table className="portal__table">
          <thead>
            <tr><th>Peserta</th><th>Workshop</th><th>Status</th><th>Pembayaran</th></tr>
          </thead>
          <tbody>
            {data.registrations.map((r) => {
              const w = data.workshops.find((x) => x.id === r.workshop_id)
              return (
                <tr key={r.id}>
                  <td>{r.name}<div className="portal__muted">{r.email}</div></td>
                  <td>{w?.title ?? '—'}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => run(() => updateRegistrationStatus(r.id, { status: e.target.value }))}
                    >
                      {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{STATUS_LABEL[o]}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      value={r.payment_status}
                      onChange={(e) => run(() => updateRegistrationStatus(r.id, { payment_status: e.target.value }))}
                    >
                      {PAYMENT_OPTIONS.map((o) => <option key={o} value={o}>{STATUS_LABEL[o]}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

function catLabel(categoryId) {
  const map = {
    batik: 'Batik',
    pottery: 'Pottery',
    painting: 'Painting',
    punchneedle: 'Punch Needle',
    journaling: 'Journaling',
    tiedye: 'Tie Dye',
  }
  return map[categoryId] ?? 'Lainnya'
}

/* ---------------- portal shell ---------------- */

const ROLE_LABEL = { user: 'Peserta', instructor: 'Instruktur', admin: 'Admin' }

export default function Portal() {
  const portalOpen = useStore((s) => s.portalOpen)
  const setPortalOpen = useStore((s) => s.setPortalOpen)
  const user = useStore((s) => s.user)
  const profile = useStore((s) => s.profile)
  const authLoading = useStore((s) => s.authLoading)
  const clearSession = useStore((s) => s.clearSession)
  const panel = useRef()

  useEffect(() => {
    if (!portalOpen) return
    gsap.fromTo(panel.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
    const onKey = (e) => e.key === 'Escape' && setPortalOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [portalOpen, setPortalOpen])

  if (!portalOpen) return null

  const logout = async () => {
    await signOutUser()
    clearSession()
  }

  const role = profile?.role ?? 'user'

  return (
    <div className="portal-overlay" role="dialog" aria-modal="true" aria-label="Studio Portal">
      <div className="portal" ref={panel}>
        <div className="portal__head">
          <div>
            <div className="portal__logo">
              arte<em>.coffee</em> <span>Studio Portal</span>
            </div>
            {user && profile && (
              <div className="portal__whoami">
                {profile.name} · <span className="badge badge--role">{ROLE_LABEL[role]}</span>
              </div>
            )}
          </div>
          <div className="portal__head-actions">
            {user && (
              <button className="btn btn--ghost portal__logout" onClick={logout}>
                Keluar
              </button>
            )}
            <button className="modal__close" onClick={() => setPortalOpen(false)} aria-label="Tutup portal">
              ✕
            </button>
          </div>
        </div>

        <div className="portal__body">
          {!backendReady ? (
            <p className="portal__error">
              Backend belum dikonfigurasi — isi VITE_INSFORGE_URL &amp; VITE_INSFORGE_ANON_KEY di .env.
            </p>
          ) : authLoading ? (
            <p className="portal__loading">Memeriksa sesi…</p>
          ) : !user ? (
            <AuthForms />
          ) : role === 'admin' ? (
            <AdminDash />
          ) : role === 'instructor' ? (
            <InstructorDash />
          ) : (
            <UserDash />
          )}
        </div>
      </div>
    </div>
  )
}
