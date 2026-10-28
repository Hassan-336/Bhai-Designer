import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { LOGOS } from '../../data/portfolioData'

/**
 * Reusable Logo Reveal on Scroll Component
 */
export default function LogoReveal() {
  const ref = useRef(null)
  const [cols, setCols] = useState(() => (innerWidth < 700 ? 3 : 4))
  const [revealed, setRevealed] = useState(0)
  const [hover, setHover] = useState(-1)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    const handleResize = () => setCols(innerWidth < 700 ? 3 : 4)
    addEventListener('resize', handleResize)

    // Preload logos
    LOGOS.forEach((l) => {
      if (l.color) { const img = new Image(); img.src = l.color }
      if (l.bw) { const img = new Image(); img.src = l.bw }
    })

    return () => removeEventListener('resize', handleResize)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setRevealed(Math.min(cols, Math.floor(Math.max(0, p - 0.05) / 0.8 * (cols + 1))))
  })

  if (!LOGOS || !LOGOS.length) {
    return <p className="empty">Logo section: logos <code>src/assets/logos/</code> mein daalo.</p>
  }

  const rows = Math.ceil(LOGOS.length / cols)

  return (
    <section className="logo-reveal" ref={ref} style={{ '--steps': cols + 2 }}>
      <div className="logo-sticky">
        <h2 className="logo-reveal-title">Logos <small>scroll karo ↓</small></h2>
        <div className="logo-grid" style={{ '--cols': cols, '--rows': rows }}>
          {LOGOS.map((l, i) => {
            const on = i % cols < revealed || hover === i
            return (
              <motion.div
                key={l.name}
                className={'logo-item' + (on ? ' on' : '')}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
                onTouchStart={() => setHover(i)}
                onTouchEnd={() => setHover(-1)}
                animate={{ scale: hover === i ? 1.35 : 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                style={{ zIndex: hover === i ? 5 : 1 }}
              >
                {l.bw && (
                  <img
                    className="bw"
                    src={l.bw}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                  />
                )}
                <img
                  className={l.bw ? 'color' : 'color auto'}
                  src={l.color}
                  alt={l.name}
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
