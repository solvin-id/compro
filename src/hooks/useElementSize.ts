import { useEffect, useRef, useState } from 'react'

export interface ElementSize {
  width: number
  height: number
}

/**
 * Observes an element's border-box size, rAF-throttled and rounded.
 * Disabled observers cost nothing: no observer is created until `enabled`.
 */
export function useElementSize(enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return

    let frame = 0

    const read = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      )
    }

    const observer = new ResizeObserver(() => {
      if (frame) return
      frame = requestAnimationFrame(read)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled])

  return { ref, size }
}
