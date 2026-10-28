import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MarqueeSlider from '../components/MarqueeSlider/MarqueeSlider'
import Lightbox from '../components/Lightbox/Lightbox'
import LogoReveal from '../components/LogoReveal/LogoReveal'
import { PAGE_IMAGES } from '../data/portfolioData'

/**
 * Professional Logofolio Page Component
 * Showcases logo collection and the interactive LogoReveal section
 */
export default function Logofolio() {
  const [activeImage, setActiveImage] = useState(null)
  const images = PAGE_IMAGES.logofolio || []

  return (
    <motion.main
      className="page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Page Navigation */}
      <Link to="/" className="back-home" id="back-home">
        ← Home
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1>Logofolio</h1>
        <p>Selected logo work & brand marks.</p>
      </header>

      {images.length > 0 && (
        <>
          {/* Marquee slider for logo mockups if any exist */}
          <MarqueeSlider
            images={images}
            title="Logofolio"
            onImageClick={(src) => setActiveImage(src)}
            speed={95}
          />

          {/* Grid gallery for logofolio */}
          <div className="grid">
            {images.map((src, index) => (
              <motion.div
                key={src}
                className="card has-img"
                whileHover={{ y: -8, rotate: index % 2 ? -1.5 : 1.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setActiveImage(src)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveImage(src)
                  }
                }}
                title="Click to view full image"
              >
                <img
                  src={src}
                  alt={`Logofolio work item ${index + 1}`}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ✨ Interactive Sticky Logo Reveal Section on Logofolio */}
      <LogoReveal />

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <Lightbox
            src={activeImage}
            alt="Logofolio showcase"
            onClose={() => setActiveImage(null)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
