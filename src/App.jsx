import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import logo from './assets/logo.png' // 👈 apna logo yahan replace karo: src/assets/logo.png
import Design from './pages/Design'
import Logofolio from './pages/Logofolio'
import Contact from './pages/Contact'
import MarqueeSlider from './components/MarqueeSlider/MarqueeSlider'
import Lightbox from './components/Lightbox/Lightbox'
import './App.css'

new Image().src = logo // logo ko pehle hi load shuru kar do

/* 📁 Images auto-load: bas file src/assets/<page-folder>/ mein daal do, code change nahi karna */
const glob = (files) => Object.entries(files).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, url]) => url)
const PAGE_IMAGES = {
  logofolio: glob(import.meta.glob('./assets/logofolio/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
  design: glob(import.meta.glob('./assets/design/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
  branding: glob(import.meta.glob('./assets/branding/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
}
/* 🎨 Logo section: color logos src/assets/logos/ mein daalo (optional B/W: same naam + -bw, e.g. fred.png & fred-bw.png) */
const LOGO_FILES = import.meta.glob('./assets/logos/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })
const LOGOS = (() => {
  const base = (p) => p.split('/').pop().replace(/\.[^.]+$/, '')
  const entries = Object.entries(LOGO_FILES)
  const bw = Object.fromEntries(entries.filter(([p]) => base(p).endsWith('-bw')).map(([p, u]) => [base(p).slice(0, -3), u]))
  const color = Object.fromEntries(entries.filter(([p]) => !base(p).endsWith('-bw')).map(([p, u]) => [base(p), u]))
  const names = [...new Set([...Object.keys(color), ...Object.keys(bw)])]
  return names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({ name, color: color[name] || bw[name], bw: color[name] ? bw[name] : undefined, only: !color[name] }))
})()
const ABOUT_PHOTO = glob(import.meta.glob('./assets/about/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' }))[0]

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
  { id: 'cream', label: 'Cream', color: '#f5ecd9', border: 'rgba(30, 47, 255, 0.35)', title: 'Cream theme' },
  { id: 'blue', label: 'Blue', color: '#1e2fff', border: 'rgba(255, 255, 255, 0.5)', title: 'Electric Blue theme' },
  { id: 'client', label: 'Favor', color: '#ffd24a', border: 'rgba(0, 0, 0, 0.25)', title: 'Client Favor theme' },
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
      <div className="home-bottom">
        <p className="tagline">
          <b>A job title</b> <i>that always gets asked to do things for free, saying it's just a</i>{' '}
          <u>'small favor.'</u>
        </p>
        <Link to="/logofolio" className="cta" id="cta-work">View my work →</Link>
        <span className="hint">↗ Top right se theme change karke dekho</span>
      </div>
    </motion.main>
  )
}


function Page({ title, text, folder, extra }) {
  const [activeImage, setActiveImage] = useState(null)
  const images = (folder && PAGE_IMAGES[folder]) || []

  return (
    <motion.main className="page" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
      <Link to="/" className="back-home" id="back-home">← Home</Link>
      <h1>{title}</h1>
      <p>{text}</p>

      {folder && (
        images.length ? (
          <>
            <MarqueeSlider
              images={images}
              title={title}
              onImageClick={(src) => setActiveImage(src)}
            />

            <div className="grid">
              {images.map((src, n) => (
                <motion.div
                  key={src}
                  className="card has-img"
                  whileHover={{ y: -8, rotate: n % 2 ? -1.5 : 1.5 }}
                  onClick={() => setActiveImage(src)}
                  title="Click to view full image"
                >
                  <img src={src} alt={`${title} ${n + 1}`} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="empty">Images add karne ke liye files <code>src/assets/{folder}/</code> mein daalo.</p>
        )
      )}

      {extra}

      <AnimatePresence>
        {activeImage && (
          <Lightbox src={activeImage} alt={title} onClose={() => setActiveImage(null)} />
        )}
      </AnimatePresence>
    </motion.main>
  )
}

const ABOUT = {
  role: 'Creative Designer',
  bio: 'Creative and detail-oriented Graphic Designer with over 3 years of professional experience specializing in brand identity, print collateral, and packaging design. Proven track record of managing end-to-end print production, advertising campaigns, and visual assets for diverse local and corporate brands. Adept at translating brand values into compelling visual systems that resonate with target audiences and elevate market presence. Passionate about blending aesthetic precision with strategic storytelling to deliver memorable design experiences across print and digital mediums.',
  stats: [['3+', 'Years experience'], ['5', 'Companies'], ['10', 'Core skills']],
  work: [
    ['July 2024 – Present', 'Eastgate Industries', 'Creative Designer'],
    ['Nov 2023 – July 2024', 'The Howdy Group', 'Graphic Designer'],
    ['May 2023 – Nov 2023', 'Art Techniques', 'Graphic Designer'],
    ['August 2022 – May 2023', 'Dynamic Packaging Pvt. Ltd.', 'Pre-Press Designer'],
    ['July 2021 – July 2022', 'Ideal Printer', 'Graphic Designer'],
  ],
  software: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe After Effects', 'Figma'],
  skills: ['Graphic Design', 'Brand Identity', 'Packaging Design', 'Social Media Campaign', 'Print-ready files', 'Layout Design', 'AI Image Generation', 'Design Thinking', 'Typography', 'Adaptability'],
  edu: [
    ['2024 – Present (Ongoing)', 'ADP in Marketing', 'Virtual University'],
    ['2019 – 2022', 'DAE (Printing & Graphic Arts)', 'Govt. College of Technology'],
  ],
}

function About() {
  const fade = (i = 0) => ({ initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: .6, delay: i * .08 } })
  return (
    <motion.main className="page about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Link to="/" className="back-home" id="back-home">← Home</Link>

      <section className="about-hero">
        <motion.div className="about-photo" {...fade()}>
          {ABOUT_PHOTO
            ? <img src={ABOUT_PHOTO} alt="Ahsan Mahmood" />
            : <div className="about-photo-fallback" style={{ '--logo': `url(${logo})` }} role="img" aria-label="Ahsan Mahmood logo" />}
          <span className="about-badge">✦ Open for work</span>
        </motion.div>
        <motion.div className="about-intro" {...fade(1)}>
          <span className="eyebrow">Hello, I'm</span>
          <h1>Ahsan Mahmood</h1>
          <h2>{ABOUT.role}</h2>
          <p>{ABOUT.bio}</p>
          <div className="about-contact">
            <a href="mailto:m.ahsanmahmood126@gmail.com">m.ahsanmahmood126@gmail.com</a>
            <a href="tel:+923084583430">+92 308 4583430</a>
            <span>Lahore, Pakistan</span>
          </div>
        </motion.div>
      </section>

      <section className="about-stats">
        {ABOUT.stats.map(([n, l], i) => (
          <motion.div key={l} className="stat" {...fade(i)}><b>{n}</b><span>{l}</span></motion.div>
        ))}
      </section>

      <section className="about-cols">
        <motion.div className="about-block" {...fade()}>
          <h3>Work Experience</h3>
          <ul className="timeline">
            {ABOUT.work.map(([d, c, r]) => (
              <li key={c}><small>{d}</small><b>{c}</b><span>{r}</span></li>
            ))}
          </ul>
        </motion.div>
        <div className="about-side">
          <motion.div className="about-block" {...fade(1)}>
            <h3>Softwares</h3>
            <div className="chips">{ABOUT.software.map((s) => <span key={s}>{s}</span>)}</div>
          </motion.div>
          <motion.div className="about-block" {...fade(2)}>
            <h3>Core Skills</h3>
            <div className="chips">{ABOUT.skills.map((s) => <span key={s}>{s}</span>)}</div>
          </motion.div>
          <motion.div className="about-block" {...fade(3)}>
            <h3>Education</h3>
            <ul className="timeline">
              {ABOUT.edu.map(([d, c, r]) => (
                <li key={c}><small>{d}</small><b>{c}</b><span>{r}</span></li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
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
          <div className="switcher" role="group" aria-label="Theme Color Switcher">
            <span className="switcher-icon" title="Theme Palette" aria-hidden="true">🎨</span>
            <div className="switcher-buttons">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  id={`theme-${t.id}`}
                  className={`theme-btn ${theme === t.id ? 'on' : ''}`}
                  onClick={(e) => changeTheme(t.id, e)}
                  title={t.title}
                  aria-label={t.title}
                  aria-pressed={theme === t.id}
                >
                  <span
                    className="theme-dot"
                    style={{
                      backgroundColor: t.color,
                      borderColor: t.border || 'transparent',
                    }}
                    aria-hidden="true"
                  />
                  <span className="label">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home theme={theme} bubbles={bubbles} />} />
          <Route path="/about" element={<About />} />
          <Route path="/logofolio" element={<Logofolio />} />
          <Route path="/design" element={<Design />} />
          <Route path="/branding" element={<Page title="Branding" text="Complete brand identities." folder="branding" />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>

      <Watch />
      <div className="credit">Ahsan Mahmood Portfolio</div>
    </div>
  )
}
