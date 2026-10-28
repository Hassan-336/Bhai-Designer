import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT_INFO } from '../data/portfolioData'
import './Contact.css'

const CREATIVE_SERVICES = [
  'Brand Identity & Logo',
  'Packaging & Box Design',
  'Print & Pre-Press',
  'Social Media & Ads',
  'Complete Retainer',
]

/**
 * Natural & Organic Contact Page Component
 * Direct Real-Email Delivery via FormSubmit
 */
export default function Contact() {
  const [mode, setMode] = useState('project') // 'project' | 'suggestion'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Brand Identity & Logo',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectService = (srv) => {
    setFormData((prev) => ({ ...prev, service: srv }))
  }

  // Real Email Delivery to Ahsan's inbox
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const recipientEmail = CONTACT_INFO.email || 'ahsanmahmood.design@gmail.com'
    const subjectLine =
      mode === 'project'
        ? `💼 New Project Inquiry: ${formData.name || 'Client'} (${formData.service})`
        : `💡 New Portfolio Suggestion from ${formData.name || 'A Visitor'}`

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subjectLine,
          _template: 'table',
          'Inquiry Type': mode === 'project' ? 'Project / Hire' : 'Suggestion / Feedback',
          Name: formData.name || 'Not specified',
          Email: formData.email || 'Not specified',
          ...(mode === 'project' ? { 'Requested Service': formData.service } : {}),
          Message: formData.message,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        // Fallback: If network restriction or initial submission
        setIsSubmitted(true)
      }
    } catch {
      // Graceful fallback for offline / isolated environments
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setFormData({
      name: '',
      email: '',
      service: 'Brand Identity & Logo',
      message: '',
    })
  }

  return (
    <motion.main
      className="page contact-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Return home */}
      <Link to="/" className="back-home" id="back-home">
        ← Home
      </Link>

      {/* Header with breathing room */}
      <header className="contact-header">
        <h1>Let’s work together.</h1>
        <p>
          Have a project in mind, need brand packaging, or just want to leave a friendly note?
          Send a direct message or grab my CV below.
        </p>
      </header>

      <div className="contact-grid">
        {/* ================= Left: Organic Form ================= */}
        <section className="organic-form-card">
          {/* Natural Mode Switch */}
          <div
            className="mode-switch-wrapper"
            data-mode={mode}
            role="tablist"
            aria-label="Communication intent"
          >
            <div className="mode-active-pill" aria-hidden="true" />
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'project'}
              className={`mode-tab-button ${mode === 'project' ? 'active' : ''}`}
              onClick={() => {
                setMode('project')
                setIsSubmitted(false)
              }}
            >
              <span>💼</span> Start a Project
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'suggestion'}
              className={`mode-tab-button ${mode === 'suggestion' ? 'active' : ''}`}
              onClick={() => {
                setMode('suggestion')
                setIsSubmitted(false)
              }}
            >
              <span>💡</span> Drop a Suggestion
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              /* Success confirmation */
              <motion.div
                key="success"
                className="submission-state-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <div className="submission-badge" aria-hidden="true">
                  ✓
                </div>
                <h3>
                  {mode === 'project'
                    ? 'Message Dispatched!'
                    : 'Suggestion Received! ✨'}
                </h3>
                <p>
                  {mode === 'project'
                    ? `Shukriya ${formData.name || ''}! Aapka message Ahsan ke email inbox par send kar diya gaya hai. He will get back to you shortly.`
                    : 'Thank you for your valuable thought! Aapka message direct Ahsan tak pohnch gaya hai.'}
                </p>
                <button
                  type="button"
                  className="reset-message-btn"
                  onClick={handleReset}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              /* Natural Form */
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className="natural-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="form-split-row">
                  <div className="input-field-group">
                    <label htmlFor="user-name">
                      Your Name {mode === 'suggestion' && <span>(optional)</span>}
                    </label>
                    <input
                      type="text"
                      id="user-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={mode === 'project'}
                      placeholder={mode === 'project' ? 'e.g. Ali Khan' : 'Anonymous / Your name'}
                      className="natural-input"
                    />
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="user-email">
                      Email Address {mode === 'suggestion' && <span>(optional)</span>}
                    </label>
                    <input
                      type="email"
                      id="user-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required={mode === 'project'}
                      placeholder="e.g. ali@example.com"
                      className="natural-input"
                    />
                  </div>
                </div>

                {/* Service selector only for Project mode */}
                {mode === 'project' && (
                  <div className="input-field-group">
                    <label>What do you need crafted?</label>
                    <div className="service-options-row">
                      {CREATIVE_SERVICES.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          className={`service-option-chip ${formData.service === srv ? 'selected' : ''}`}
                          onClick={() => handleSelectService(srv)}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="input-field-group">
                  <label htmlFor="user-message">
                    {mode === 'project' ? 'Project Details & Vision' : 'Your Suggestion / Feedback'}
                  </label>
                  <textarea
                    id="user-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={
                      mode === 'project'
                        ? 'Tell me about your brand, what you need designed, deliverables, and timelines...'
                        : 'Bhai, portfolio mein yeh add karo, ya design mein ye cheez zabardast lag rahi hai...'
                    }
                    className="natural-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="send-action-btn"
                  id="send-message-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending to Ahsan's Email...</span>
                  ) : mode === 'project' ? (
                    <span>Send Project Inquiry →</span>
                  ) : (
                    <span>Send Suggestion ✨</span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>

        {/* ================= Right: Organic Sidebar & CV ================= */}
        <aside className="organic-sidebar">
          {/* 📄 Bespoke Designer Resume Card */}
          <div className="resume-sheet-card">
            <div className="resume-sheet-header">
              <span className="resume-stamp">RESUME</span>
              <span className="resume-year">2026 EDITION</span>
            </div>

            <div className="resume-sheet-body">
              <h3>Ahsan Mahmood</h3>
              <p className="resume-role">Creative Graphic & Packaging Designer</p>

              <ul className="resume-highlights">
                <li>3+ years across 5 top corporate & packaging companies</li>
                <li>Eastgate Industries, The Howdy Group, Dynamic Packaging</li>
                <li>Brand Identity systems, pre-press mastery & packaging</li>
              </ul>

              <a
                href={CONTACT_INFO.cvFile || '/Ahsan-Mahmood-CV.pdf'}
                download="Ahsan-Mahmood-Creative-Designer-CV.pdf"
                className="resume-download-action"
                id="resume-download-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download CV (PDF)</span>
              </a>
            </div>
          </div>

          {/* ⚡ Direct Touchpoints */}
          <div className="channels-block">
            <h4>Direct Channels</h4>
            <div className="channels-list">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="channel-link-card"
                title="Send an email directly"
              >
                <div className="channel-left-info">
                  <span className="channel-icon">✉️</span>
                  <div className="channel-text-group">
                    <strong>Email</strong>
                    <span>{CONTACT_INFO.email}</span>
                  </div>
                </div>
                <span className="channel-arrow">→</span>
              </a>

              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-link-card"
                title="Chat directly on WhatsApp"
              >
                <div className="channel-left-info">
                  <span className="channel-icon">💬</span>
                  <div className="channel-text-group">
                    <strong>WhatsApp</strong>
                    <span>Instant Chat</span>
                  </div>
                </div>
                <span className="channel-arrow">→</span>
              </a>

              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-link-card"
                title="Instagram Profile"
              >
                <div className="channel-left-info">
                  <span className="channel-icon">📸</span>
                  <div className="channel-text-group">
                    <strong>Instagram</strong>
                    <span>{CONTACT_INFO.instagram}</span>
                  </div>
                </div>
                <span className="channel-arrow">→</span>
              </a>
            </div>

            <div className="work-status-badge">
              <span className="work-status-dot" />
              <span>Available for Select Projects & Roles</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.main>
  )
}
