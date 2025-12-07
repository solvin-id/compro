import { useEffect, useCallback } from 'react'
import { useTrail, animated } from '@react-spring/web'
import { useCursorStore, CursorVariant } from '../../hooks/useCursorStore'

const TRAIL_COUNT = 7

// Style configurations for each cursor variant
const cursorStyles: Record<
  CursorVariant,
  { color: string; size: number; opacity: number; blur: number }
> = {
  default: {
    color: '#FFA629', // Brand Orange
    size: 32,
    opacity: 0.5,
    blur: 20,
  },
  button: {
    color: '#4F46E5', // Royal Blue
    size: 80,
    opacity: 0.6,
    blur: 40,
  },
  text: {
    color: '#FFA629',
    size: 20,
    opacity: 0.2,
    blur: 10,
  },
}

export function IntelligentCursor() {
  const variant = useCursorStore((state) => state.variant)
  const styles = cursorStyles[variant]

  const [trail, api] = useTrail(TRAIL_COUNT, () => ({
    xy: [0, 0],
    config: { mass: 1, tension: 280, friction: 40 },
  }))

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      api.start({ xy: [e.clientX, e.clientY] })
    },
    [api],
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {trail.map((props, index) => {
        // Progressive sizing: First element is largest, last is smallest
        const scale = 1 - index * 0.1
        const size = styles.size * scale
        const opacity = styles.opacity * (1 - index * 0.12)

        return (
          <animated.div
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: styles.color,
              opacity,
              filter: `blur(${styles.blur * scale}px)`,
              willChange: 'transform',
              transform: props.xy.to(
                (x, y) =>
                  `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`,
              ),
            }}
          />
        )
      })}
    </div>
  )
}
