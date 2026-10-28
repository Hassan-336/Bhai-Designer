import './MarqueeSlider.css'

const CARD_SIZES = ['size-hero', 'size-tall', 'size-wide', 'size-square']

/**
 * Reusable Marquee Slider Component
 * 
 * @param {Array<string>} images - Array of image URLs to display in the marquee
 * @param {string} title - Page or project title for image alt text
 * @param {Function} onImageClick - Callback function when an image is clicked: (src, idx) => void
 * @param {number} speed - Animation duration in seconds (default: 95)
 * @param {number} minItems - Minimum items to fill the track before duplication (default: 8)
 * @param {string} className - Optional additional CSS class
 */
export default function MarqueeSlider({
  images = [],
  title = 'Portfolio',
  onImageClick,
  speed = 95,
  minItems = 8,
  className = '',
}) {
  if (!images || images.length === 0) {
    return null
  }

  // Ensure there are enough items to comfortably span wide screens before cloning
  let baseItems = [...images]
  while (baseItems.length < minItems) {
    baseItems = [...baseItems, ...images]
  }

  return (
    <section
      className={`marquee-component ${className}`}
      aria-label={`${title} image showcase marquee`}
      style={{ '--marquee-speed': `${speed}s` }}
    >
      <div className="marquee-wrapper">
        {/* Track 1 (Original) */}
        <div className="marquee-track">
          {baseItems.map((src, idx) => {
            const sizeClass = CARD_SIZES[idx % CARD_SIZES.length]
            const tiltClass = idx % 2 === 0 ? 'tilt-left' : 'tilt-right'
            return (
              <div
                key={`t1-${idx}`}
                className={`marquee-card ${sizeClass} ${tiltClass}`}
                onClick={() => onImageClick?.(src, idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onImageClick?.(src, idx)
                  }
                }}
                role="button"
                tabIndex={0}
                title="Click to view full image"
              >
                <img src={src} alt={`${title} slide ${idx + 1}`} loading="lazy" />
              </div>
            )
          })}
        </div>

        {/* Track 2 (Cloned for 100% gapless infinite loop) */}
        <div className="marquee-track" aria-hidden="true">
          {baseItems.map((src, idx) => {
            const sizeClass = CARD_SIZES[idx % CARD_SIZES.length]
            const tiltClass = idx % 2 === 0 ? 'tilt-left' : 'tilt-right'
            return (
              <div
                key={`t2-${idx}`}
                className={`marquee-card ${sizeClass} ${tiltClass}`}
                onClick={() => onImageClick?.(src, idx)}
                role="button"
                tabIndex={-1}
                title="Click to view full image"
              >
                <img src={src} alt="" loading="lazy" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
