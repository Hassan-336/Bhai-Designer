import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MarqueeSlider from '../components/MarqueeSlider/MarqueeSlider'
import Lightbox from '../components/Lightbox/Lightbox'
import { PAGE_IMAGES } from '../data/portfolioData'

/**
 * Professional Design Portfolio Page Component
 */
export default function Design() {
  const [activeImage, setActiveImage] = useState(null)
  const images = PAGE_IMAGES.design || []

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
        <h1>Design</h1>
        <p>Posters, social media & print design.</p>
      </header>

      {images.length > 0 ? (
        <>
          {/* Reusable Marquee Slider Section */}
          <MarqueeSlider
            images={images}
            title="Design"
            onImageClick={(src) => setActiveImage(src)}
            speed={95}
          />

          {/* Detailed Work Gallery Grid */}
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
                  alt={`Design work item ${index + 1}`}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <p className="empty">
          Images add karne ke liye files <code>src/assets/design/</code> mein daalo.
        </p>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <Lightbox
            src={activeImage}
            alt="Design showcase"
            onClose={() => setActiveImage(null)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
