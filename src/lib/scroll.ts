import type Lenis from 'lenis'

declare global {
  interface Window {
    lenis?: Lenis
  }
}

export function scrollToSection(id: string) {
  if (window.lenis) window.lenis.scrollTo(`#${id}`)
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop() {
  if (window.lenis) window.lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
