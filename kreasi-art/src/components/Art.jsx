// Hand-drawn-feel SVG icons + generative card art, so the site ships with
// zero external image assets (fast, offline-safe, always on-brand).

export function CategoryIcon({ type }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (type) {
    case 'batik':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M10 38 C 10 20, 20 10, 38 10 C 38 28, 28 38, 10 38 Z" />
          <path d="M17 31 C 20 24, 24 20, 31 17" />
          <circle cx="27" cy="21" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'pottery':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M16 10 h16 M18 10 c 0 6 -6 8 -6 16 c 0 8 5 12 12 12 c 7 0 12 -4 12 -12 c 0 -8 -6 -10 -6 -16" />
          <path d="M17 30 h14" />
        </svg>
      )
    case 'painting':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M24 6 C 34 6 42 13 42 22 C 42 28 38 30 33 30 H 29 C 26 30 25 32 26 34 C 27 37 26 40 22 40 C 13 40 6 32 6 23 C 6 13 14 6 24 6 Z" />
          <circle cx="16" cy="18" r="2" fill="currentColor" stroke="none" />
          <circle cx="25" cy="14" r="2" fill="currentColor" stroke="none" />
          <circle cx="33" cy="19" r="2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'punchneedle':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 8 v-4 M14 40 c 4 -8 16 -8 20 0" />
          <path d="M18 22 q 3 -4 6 0 q 3 4 6 0" />
        </svg>
      )
    case 'journaling':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <path d="M12 8 h20 a4 4 0 0 1 4 4 v24 a4 4 0 0 1 -4 4 h-20 z" />
          <path d="M12 8 v32 M20 18 h10 M20 25 h10" />
        </svg>
      )
    case 'tiedye':
      return (
        <svg viewBox="0 0 48 48" {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 8 a16 16 0 0 1 0 32 M24 12 a12 12 0 0 0 0 24 M24 17 a7 7 0 0 1 0 14" />
        </svg>
      )
    default:
      return null
  }
}

// Small deterministic PRNG so each workshop gets stable, unique artwork
function mulberry(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h) || 1
}

export function CardArt({ id, color }) {
  const rnd = mulberry(hashId(id))
  const light = '#fbf5e9'
  const shapes = []
  const n = 6 + Math.floor(rnd() * 4)

  for (let i = 0; i < n; i++) {
    const kind = rnd()
    const x = 20 + rnd() * 360
    const y = 15 + rnd() * 240
    const s = 14 + rnd() * 60
    const o = 0.25 + rnd() * 0.6
    if (kind < 0.4) {
      shapes.push(<circle key={i} cx={x} cy={y} r={s / 2} fill={light} opacity={o} />)
    } else if (kind < 0.7) {
      shapes.push(
        <path
          key={i}
          d={`M ${x - s} ${y} Q ${x} ${y - s * 0.9} ${x + s} ${y} Q ${x} ${y + s * 0.9} ${x - s} ${y}`}
          fill="none"
          stroke={light}
          strokeWidth={3 + rnd() * 3}
          opacity={o}
        />,
      )
    } else {
      shapes.push(
        <path
          key={i}
          d={`M ${x} ${y} q ${s * 0.7} ${-s * 0.5} ${s * 1.4} 0 q ${s * 0.7} ${s * 0.5} ${s * 1.4} 0`}
          fill="none"
          stroke={light}
          strokeWidth={2.5 + rnd() * 2.5}
          strokeLinecap="round"
          opacity={o}
        />,
      )
    }
  }

  return (
    <svg viewBox="0 0 400 270" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustrasi workshop">
      <rect width="400" height="270" fill={color} />
      {shapes}
      <circle cx={330 + rnd() * 30} cy={40 + rnd() * 30} r="52" fill={light} opacity="0.32" />
    </svg>
  )
}
