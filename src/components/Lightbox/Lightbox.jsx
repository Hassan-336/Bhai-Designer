import { useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable Lightbox Modal Component
 * 
 * @param {string} src - Image URL to preview
 * @param {string} alt - Alt description
 * @param {Function} onClose - Close handler
 */
export default function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!src) return null

  return (
    <motion.div
      className="lightbox-overlay"
      id="lightbox-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.button
        className="lightbox-close"
        id="lightbox-close-btn"
        onClick={onClose}
        aria-label="Close preview"
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 90, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 320, delay: 0.08 }}
      >
        ✕
      </motion.button>
      <motion.div
        className="lightbox-content"
        initial={{ scale: 0.6, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.65, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt || 'Full size view'} />
      </motion.div>
    </motion.div>
  )
}
