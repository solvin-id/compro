import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Expose lenis instance to window for global access if needed (optional)
    // @ts-ignore
    window.lenis = lenis

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href && href !== '#') {
          lenis.scrollTo(href)
        }
      })
    })

    return () => {
      lenis.destroy()
      // @ts-ignore
      delete window.lenis
    }
  }, [])

  return null
}
