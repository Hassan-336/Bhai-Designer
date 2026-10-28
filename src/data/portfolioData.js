/* Centralized Assets & Data Loader */

const glob = (files) =>
  Object.entries(files)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url)

export const PAGE_IMAGES = {
  logofolio: glob(import.meta.glob('../assets/logofolio/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
  design: glob(import.meta.glob('../assets/design/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
  branding: glob(import.meta.glob('../assets/branding/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })),
}

/* 🎨 Logos for LogoReveal section */
const LOGO_FILES = import.meta.glob('../assets/logos/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, query: '?url', import: 'default' })

export const LOGOS = (() => {
  const base = (p) => p.split('/').pop().replace(/\.[^.]+$/, '')
  const entries = Object.entries(LOGO_FILES)
  const bw = Object.fromEntries(entries.filter(([p]) => base(p).endsWith('-bw')).map(([p, u]) => [base(p).slice(0, -3), u]))
  const color = Object.fromEntries(entries.filter(([p]) => !base(p).endsWith('-bw')).map(([p, u]) => [base(p), u]))
  const names = [...new Set([...Object.keys(color), ...Object.keys(bw)])]
  return names
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({
      name,
      color: color[name] || bw[name],
      bw: color[name] ? bw[name] : undefined,
      only: !color[name],
    }))
})()

/* 📬 Contact & Owner Information */
export const CONTACT_INFO = {
  // 👈 Apna email yahan likhein (Form submit hone par is email par direct message aayega):
  email: 'ahsanmahmood.design@gmail.com',
  whatsapp: '+92 300 1234567',
  whatsappUrl: 'https://wa.me/923001234567',
  instagram: '@bhai_designer',
  instagramUrl: 'https://instagram.com',
  cvFile: '/Ahsan-Mahmood-CV.pdf',
}
