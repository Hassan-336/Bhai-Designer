import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import logo from './assets/logo.png' // 👈 apna logo yahan replace karo: src/assets/logo.png
import './App.css'

/* ✏️ Apni marzi se yahan messages change karo */
const CLIENT_MESSAGES = [
  '💬 "Bhai, logo ka size thora bara kardo! 📈"',
  '💬 "Bhai, mere cousin ne 500 me banaya tha! 😂"',
  '💬 "Bhai, PSD file source bhi bhej do! 📁"',
  '💬 "Bas ek chota sa change hai, 5 min ka kaam! ⏱️"',
  '💬 "Logo ko pop kardo, thora aur pop! ✨"',
  '💬 "Budget kam hai, par exposure milega! 🙏"',
]

const THEMES = [
  { id: 'cream', label: 'Cream', emoji: '🌕' },
  { id: 'blue', label: 'Blue', emoji: '🔵' },
  { id: 'client', label: 'Client "Favor"', emoji: '🙏' },
]

function Watch() {
  const [now, setNow] = useState(new Date())
  const [spin, setSpin] = useState(0)
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = now.getSeconds()
  const m = now.getMinutes()
  const h = now.getHours() % 12
  const sec = s * 6 + spin
  const min = m * 6 + s * 0.1 + spin * 2
  const hr = h * 30 + m * 0.5 + spin * 0.5
  const day = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
  const time = now.toLocaleTimeString('en-US')
  const hand = { transformBox: 'view-box', transformOrigin: '25px 25px' }
  const spr = { type: 'spring', stiffness: 40, damping: 12 }
  return (
    <motion.button className="watch" id="watch-btn" onClick={() => { setSpin((v) => v + 720); setPulse((v) => v + 1) }}
      key={pulse} animate={pulse ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 1.2, ease: 'easeInOut' }}
      aria-label="Watch - click to spin">
      <svg viewBox="0 0 50 50" className="watch-face">
        <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="25" y1="5" x2="25" y2={i % 3 === 0 ? 9 : 7} stroke="currentColor" strokeWidth="1"
            transform={`rotate(${i * 30} 25 25)`} />
        ))}
        <motion.line x1="25" y1="25" x2="25" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          animate={{ rotate: hr }} transition={spr} style={hand} />
        <motion.line x1="25" y1="25" x2="25" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          animate={{ rotate: min }} transition={spr} style={hand} />
        <motion.line x1="25" y1="29" x2="25" y2="7" stroke="var(--highlight)" strokeWidth="1" strokeLinecap="round"
          animate={{ rotate: sec }} transition={{ type: 'spring', stiffness: 60, damping: 10 }} style={hand} />
        <circle cx="25" cy="25" r="1.6" fill="var(--highlight)" />
      </svg>
      <span className="watch-tip">Click me ⏱</span>
      <span className="watch-text">
        <b>{day}</b>
        <small>{time}</small>
      </span>
    </motion.button>
  )
}

function Bubbles({ items }) {
  return (
    <div className="bubbles" aria-hidden="true">
      <AnimatePresence>
        {items.map((b) => (
          <motion.div key={b.id} className="bubble"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            initial={{ scale: 0, opacity: 0, rotate: b.r - 10 }}
            animate={{ scale: 1, opacity: 1, rotate: b.r }}
            exit={{ scale: 0.6, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            {b.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function Home({ theme, bubbles }) {
  return (
    <motion.main className="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {theme === 'client' && <Bubbles items={bubbles} />}
      <motion.div className="logo-wrap"
        initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        whileHover={{ scale: 1.05, rotate: -2 }}>
        <h1 className="sr-only">Ahsan Mahmood - Graphic Designer</h1>
        <div className="logo" style={{ '--logo': `url(${logo})` }} role="img" aria-label="Ahsan Mahmood logo" />
      </motion.div>
      <p className="tagline">
        <b>A job title</b> <i>that always gets asked to do things for free, saying it's just a</i>{' '}
        <u>'small favor.'</u>
      </p>
      <Link to="/logofolio" className="cta" id="cta-work">View my work →</Link>
      <span className="hint">↗ Top right se theme change karke dekho</span>
    </motion.main>
  )
}

function Page({ title, text }) {
  return (
    <motion.main className="page" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
      <h1>{title}</h1>
      <p>{text}</p>
      <div className="grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <motion.div key={n} className="card" whileHover={{ y: -8, rotate: n % 2 ? -1.5 : 1.5 }}>
            <span>{title} #{n}</span>
          </motion.div>
        ))}
      </div>
    </motion.main>
  )
}

export default function App() {
  const [theme, setTheme] = useState('blue')
  const location = useLocation()
  const [bubbles, setBubbles] = useState([])
  const count = useRef(0)

  const addBubble = () => {
    const n = count.current++
    const b = {
      id: n, msg: CLIENT_MESSAGES[n % CLIENT_MESSAGES.length],
      x: 4 + Math.random() * 50, y: 14 + Math.random() * 60, r: -8 + Math.random() * 16,
    }
    setBubbles((p) => [...p.slice(-7), b])
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const changeTheme = (id, e) => {
    if (id === 'client') addBubble() // har click par ek naya message
    if (id === theme) return
    if (id !== 'client') { setBubbles([]); count.current = 0 }
    const x = e.clientX, y = e.clientY
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    if (!document.startViewTransition) return setTheme(id)
    const t = document.startViewTransition(() => {
      document.documentElement.dataset.theme = id
      setTheme(id)
    })
    t.ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
  }

  const link = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/about" className={(o) => link(o) + ' nav-left'}>About</NavLink>
        <nav className="nav-mid" aria-label="Main">
          <NavLink to="/logofolio" className={link}>Logofolio</NavLink>
          <NavLink to="/design" className={link}>Design</NavLink>
          <NavLink to="/branding" className={link}>Branding</NavLink>
        </nav>
        <div className="nav-right">
          <div className="switcher" role="group" aria-label="Theme">
            {THEMES.map((t) => (
              <button key={t.id} id={`theme-${t.id}`} className={theme === t.id ? 'on' : ''} onClick={(e) => changeTheme(t.id, e)}>
                <span>{t.emoji}</span> <span className="label">{t.label}</span>
              </button>
            ))}
          </div>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home theme={theme} bubbles={bubbles} />} />
          <Route path="/about" element={<Page title="About" text="Ahsan Mahmood — graphic designer." />} />
          <Route path="/logofolio" element={<Page title="Logofolio" text="Selected logo work." />} />
          <Route path="/design" element={<Page title="Design" text="Posters, social media & print design." />} />
          <Route path="/branding" element={<Page title="Branding" text="Complete brand identities." />} />
          <Route path="/contact" element={<Page title="Contact" text="Let's work together." />} />
        </Routes>
      </AnimatePresence>

      <Watch />
      <div className="credit">Ahsan Mahmood Portfolio</div>
    </div>
  )
}
