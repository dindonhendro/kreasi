import { createClient } from '@insforge/sdk'
import { WORKSHOPS } from '../data/workshops.js'

// InsForge backend (PRD §6). When env vars are missing or the backend is
// unreachable, the public site falls back to bundled demo data; the portal
// (auth/admin/instructor) requires the backend.
const BASE_URL = import.meta.env.VITE_INSFORGE_URL
const ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY

export const insforge =
  BASE_URL && ANON_KEY ? createClient({ baseUrl: BASE_URL, anonKey: ANON_KEY }) : null

export const backendReady = Boolean(insforge)

const fail = (error, fallbackMsg) => {
  throw new Error(error?.message ?? fallbackMsg)
}

/* ---------------- catalog (public) ---------------- */

function toUiWorkshop(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    categoryId: row.category_id,
    ageGroup: row.age_group,
    duration: Number(row.duration_hours),
    price: row.price,
    instructor: row.instructor_name,
    maxParticipants: row.max_participants,
    schedule: (row.workshop_schedules ?? [])
      .slice()
      .sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? ''))
      .map((s) => ({
        id: s.id,
        date: s.label_date,
        time: s.label_time,
        left: Math.max(0, s.seats_total - s.seats_taken),
      })),
  }
}

export async function fetchWorkshops() {
  if (!insforge) return WORKSHOPS
  const { data, error } = await insforge.database
    .from('workshops')
    .select('*, workshop_schedules(id, label_date, label_time, seats_total, seats_taken, starts_at)')
    .order('created_at', { ascending: true })
  if (error || !data?.length) {
    if (error) console.warn('InsForge fetch failed, using local data:', error.message ?? error)
    return WORKSHOPS
  }
  return data.map(toUiWorkshop)
}

export async function registerForWorkshop({ workshopId, slotId, name, email, userId = null }) {
  if (!insforge) {
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true }
  }
  // No .select(): anon guests cannot read registrations back (RLS), and the
  // seat-claim trigger already rejects full/mismatched schedules.
  const { error } = await insforge.database.from('registrations').insert([
    { workshop_id: workshopId, schedule_id: slotId, name, email, user_id: userId },
  ])
  if (error) fail(error, 'Pendaftaran gagal terkirim')
  return { ok: true }
}

/* ---------------- auth ---------------- */

async function fetchProfile(userId) {
  const { data } = await insforge.database
    .from('profiles')
    .select('id, name, role')
    .eq('id', userId)
    .maybeSingle()
  return data ?? null
}

async function ensureProfile(user, name) {
  let profile = await fetchProfile(user.id)
  if (!profile) {
    const wanted = name || user.email?.split('@')[0] || 'Peserta'
    await insforge.database.from('profiles').insert([{ id: user.id, name: wanted, role: 'user' }])
    profile = (await fetchProfile(user.id)) ?? { id: user.id, name: wanted, role: 'user' }
  }
  return profile
}

export async function signUpUser({ name, email, password }) {
  if (!insforge) throw new Error('Backend belum dikonfigurasi')
  const { data, error } = await insforge.auth.signUp({ email, password, name })
  if (error) fail(error, 'Pendaftaran akun gagal')
  if (!data?.user) throw new Error('Pendaftaran akun gagal')
  const profile = await ensureProfile(data.user, name)
  return { user: data.user, profile }
}

export async function signInUser({ email, password }) {
  if (!insforge) throw new Error('Backend belum dikonfigurasi')
  const { data, error } = await insforge.auth.signInWithPassword({ email, password })
  if (error) fail(error, 'Email atau kata sandi salah')
  const profile = await ensureProfile(data.user)
  return { user: data.user, profile }
}

export async function signOutUser() {
  if (!insforge) return
  await insforge.auth.signOut()
}

export async function getCurrentSession() {
  if (!insforge) return null
  const { data, error } = await insforge.auth.getCurrentUser()
  if (error || !data?.user) return null
  const profile = await fetchProfile(data.user.id)
  return { user: data.user, profile: profile ?? { id: data.user.id, name: data.user.email, role: 'user' } }
}

/* ---------------- My Studio (user) ---------------- */

export async function fetchMyRegistrations() {
  const { data, error } = await insforge.database
    .from('registrations')
    .select(
      'id, status, payment_status, created_at, workshops(title, category), workshop_schedules(label_date, label_time)',
    )
    .order('created_at', { ascending: false })
  if (error) fail(error, 'Gagal memuat pendaftaran')
  return data ?? []
}

/* ---------------- instructor ---------------- */

export async function fetchInstructorData(userId) {
  const { data: workshops, error } = await insforge.database
    .from('workshops')
    .select('id, title, category, workshop_schedules(id, label_date, label_time, seats_total, seats_taken, starts_at)')
    .eq('instructor_id', userId)
    .order('created_at', { ascending: true })
  if (error) fail(error, 'Gagal memuat kelas')
  const ids = (workshops ?? []).map((w) => w.id)
  let registrations = []
  if (ids.length) {
    const { data: regs, error: regErr } = await insforge.database
      .from('registrations')
      .select('id, name, email, status, payment_status, workshop_id, schedule_id, created_at')
      .in('workshop_id', ids)
      .order('created_at', { ascending: true })
    if (regErr) fail(regErr, 'Gagal memuat peserta')
    registrations = regs ?? []
  }
  return { workshops: workshops ?? [], registrations }
}

/* ---------------- admin ---------------- */

export async function fetchAdminData() {
  const [ws, regs, profs] = await Promise.all([
    insforge.database
      .from('workshops')
      .select('*, workshop_schedules(id, label_date, label_time, seats_total, seats_taken, starts_at)')
      .order('created_at', { ascending: true }),
    insforge.database
      .from('registrations')
      .select('id, name, email, status, payment_status, workshop_id, schedule_id, created_at')
      .order('created_at', { ascending: false }),
    insforge.database.from('profiles').select('id, name, role').eq('role', 'instructor'),
  ])
  if (ws.error) fail(ws.error, 'Gagal memuat workshop')
  if (regs.error) fail(regs.error, 'Gagal memuat pendaftaran')
  if (profs.error) fail(profs.error, 'Gagal memuat instruktur')
  return {
    workshops: ws.data ?? [],
    registrations: regs.data ?? [],
    instructors: profs.data ?? [],
  }
}

export async function createWorkshop(fields) {
  const { data, error } = await insforge.database.from('workshops').insert([fields]).select()
  if (error) fail(error, 'Gagal menambah workshop')
  return data?.[0]
}

export async function deleteWorkshop(id) {
  const { error } = await insforge.database.from('workshops').delete().eq('id', id)
  if (error) fail(error, 'Gagal menghapus workshop')
}

export async function addSchedule(fields) {
  const { data, error } = await insforge.database.from('workshop_schedules').insert([fields]).select()
  if (error) fail(error, 'Gagal menambah jadwal')
  return data?.[0]
}

export async function deleteSchedule(id) {
  const { error } = await insforge.database.from('workshop_schedules').delete().eq('id', id)
  if (error) fail(error, 'Gagal menghapus jadwal')
}

export async function updateRegistrationStatus(id, patch) {
  // Only status/payment_status are client-updatable (column grant + RLS)
  const allowed = {}
  if (patch.status) allowed.status = patch.status
  if (patch.payment_status) allowed.payment_status = patch.payment_status
  const { error } = await insforge.database.from('registrations').update(allowed).eq('id', id)
  if (error) fail(error, 'Gagal memperbarui status')
}
