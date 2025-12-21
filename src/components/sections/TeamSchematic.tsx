import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeamData } from '../../hooks/useTranslatedData'
import { useMountedTheme } from '@/hooks/useMountedTheme'

const LINE_COLOR = '#FFA629'
const CORNER_RADIUS = 20
const AUTO_ROTATE_DURATION = 4000

function generateVerticalPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const r = CORNER_RADIUS
  const midY = y1 + (y2 - y1) / 2

  let path = `M ${x1} ${y1} `
  path += `L ${x1} ${midY - r} `
  path += `Q ${x1} ${midY} ${x1 + (x2 > x1 ? r : -r)} ${midY} `
  path += `L ${x2 - (x2 > x1 ? r : -r)} ${midY} `
  path += `Q ${x2} ${midY} ${x2} ${midY + r} `
  path += `L ${x2} ${y2}`

  return path
}

export function TeamSchematic() {
  const { theme } = useMountedTheme()
  const { t } = useTranslation()
  const TEAM_MEMBERS = useTeamData()

  const [activeId, setActiveId] = useState(TEAM_MEMBERS[0]?.id || 'ceo')
  const [isHovering, setIsHovering] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
  })
  const [cardAnchor, setCardAnchor] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setActiveId((current) => {
        const currentIndex = TEAM_MEMBERS.findIndex((m) => m.id === current)
        const nextIndex = (currentIndex + 1) % TEAM_MEMBERS.length
        return TEAM_MEMBERS[nextIndex].id
      })
    }, AUTO_ROTATE_DURATION)

    return () => clearInterval(interval)
  }, [isHovering, TEAM_MEMBERS])

  const updateDimensions = useCallback(() => {
    if (imageContainerRef.current && sectionRef.current) {
      const imgRect = imageContainerRef.current.getBoundingClientRect()
      const sectionRect = sectionRef.current.getBoundingClientRect()
      setImageDimensions({
        width: imgRect.width,
        height: imgRect.height,
        top: imgRect.top - sectionRect.top,
      })

      setCardAnchor({
        x: imgRect.width / 2,
        y: imgRect.height + 40,
      })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [updateDimensions])

  const activeMember =
    TEAM_MEMBERS.find((m) => m.id === activeId) || TEAM_MEMBERS[0]

  const getPixelPosition = (pos: { top: string; left: string }) => {
    const top = (parseFloat(pos.top) / 100) * imageDimensions.height
    const left = (parseFloat(pos.left) / 100) * imageDimensions.width
    return { x: left, y: top }
  }

  const startPos = activeMember
    ? getPixelPosition(activeMember.position)
    : { x: 0, y: 0 }
  const startX = activeMember
    ? startPos.x +
      ((parseFloat(activeMember.hotspotArea.width) / 100) *
        imageDimensions.width) /
        2
    : 0
  const startY = startPos.y + 10

  const pathD = generateVerticalPath(startX, startY, cardAnchor.x, cardAnchor.y)

  return (
    <section
      ref={sectionRef}
      id="team"
      className="min-h-screen bg-transparent py-16 flex flex-col"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('team.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl">{t('team.subtitle')}</p>
        </div>

        <div className="hidden md:flex flex-col flex-1 relative">
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-21/9 rounded-2xl overflow-visible"
          >
            <div
              className={cn(
                'absolute inset-0  flex items-center justify-center rounded-2xl overflow-hidden',
                theme !== 'light' &&
                  'bg-linear-to-br from-gray-800/15 to-gray-950/30 backdrop-blur-lg border border-border/40',
                theme === 'light' &&
                  'bg-linear-to-br from-gray-300 to-gray-400',
              )}
            >
              <img
                src="/image/dafa.webp"
                alt="dafa"
                className="absolute -bottom-1 left-1/2 scale-108 -translate-x-1/2 h-full z-10"
              />
              <img
                src="/image/rino.webp"
                alt="rino"
                className="absolute -bottom-3 right-1/5 h-full z-5"
              />
              <img
                src="/image/akbar.webp"
                alt="akbar"
                className="absolute -bottom-2 left-1/4 h-full z-5"
              />
              <img
                src="/image/aisy.webp"
                alt="aisy"
                className="absolute -bottom-2 scale-95 right-1/12 h-full z-1"
              />
              <img
                src="/image/teguh.webp"
                alt="teguh"
                className="absolute -bottom-8 scale-95 left-1/15 h-full z-1"
              />
            </div>

            {TEAM_MEMBERS.map((member) => (
              <button
                key={member.id}
                onMouseEnter={() => {
                  setIsHovering(true)
                  setActiveId(member.id)
                }}
                onMouseLeave={() => setIsHovering(false)}
                className="absolute cursor-pointer z-20"
                style={{
                  top: member.position.top,
                  left: member.position.left,
                  width: member.hotspotArea.width,
                  height: member.hotspotArea.height,
                }}
              >
                <motion.div
                  animate={{
                    scale: activeId === member.id ? [1, 1.3, 1] : 1,
                    opacity: activeId === member.id ? 1 : 0.6,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: activeId === member.id ? Infinity : 0,
                    repeatType: 'loop',
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white"
                  style={{
                    backgroundColor:
                      activeId === member.id
                        ? LINE_COLOR
                        : 'rgba(255,255,255,0.7)',
                    boxShadow:
                      activeId === member.id
                        ? `0 0 25px ${LINE_COLOR}`
                        : '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            ))}
          </div>

          <svg
            className="absolute top-0 left-0 pointer-events-none z-10 w-full"
            height={cardAnchor.y + 50}
            style={{ overflow: 'visible' }}
          >
            {TEAM_MEMBERS.map((member) => {
              const pos = getPixelPosition(member.position)
              const memberStartX =
                pos.x +
                ((parseFloat(member.hotspotArea.width) / 100) *
                  imageDimensions.width) /
                  2
              const memberStartY = pos.y + 10
              const memberPath = generateVerticalPath(
                memberStartX,
                memberStartY,
                cardAnchor.x,
                cardAnchor.y,
              )
              return (
                <path
                  key={member.id}
                  d={memberPath}
                  stroke="#d1d5db"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="none"
                  opacity={0.3}
                />
              )
            })}

            <AnimatePresence mode="wait">
              <motion.path
                key={activeId}
                d={pathD}
                stroke={LINE_COLOR}
                strokeWidth={2}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </AnimatePresence>

            <motion.circle
              key={`dot-${activeId}`}
              cx={cardAnchor.x}
              cy={cardAnchor.y}
              r={6}
              fill={LINE_COLOR}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, duration: 0.2 }}
            />
          </svg>

          <div className="mt-12 flex justify-center relative z-30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMember.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className={cn(
                  'rounded-2xl p-8 border shadow-lg max-w-2xl w-full',
                  theme === 'light'
                    ? 'bg-background border-border'
                    : 'bg-background/30 gradient-to-b from-background/30 to-background/50 backdrop-blur-sm border-border/40',
                )}
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                    <img
                      src={activeMember.profileImage}
                      alt={activeMember.name}
                      className="aspect-square w-20 h-20 rounded-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {activeMember.name}
                    </h3>
                    <p className="text-brand-primary font-semibold mb-3">
                      {activeMember.role}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {activeMember.bio}
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={activeMember.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          theme !== 'light' &&
                            'bg-gray-900 hover:bg-gray-900/50',
                          theme === 'light' && 'bg-gray-100 hover:bg-gray-200',
                        )}
                      >
                        <Github
                          size={18}
                          className={cn(
                            theme !== 'light' && 'text-gray-700',
                            theme === 'light' && 'text-gray-700',
                          )}
                        />
                      </a>
                      <a
                        href={activeMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          theme !== 'light' &&
                            'bg-gray-900 hover:bg-gray-900/50',
                          theme === 'light' && 'bg-gray-100 hover:bg-gray-200',
                        )}
                      >
                        <Linkedin
                          size={18}
                          className={cn(
                            theme !== 'light' && 'text-gray-700',
                            theme === 'light' && 'text-gray-700',
                          )}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="md:hidden space-y-6 flex-1">
          <div
            className={cn(
              'w-full rounded-xl overflow-hidden flex items-center justify-center',
              theme !== 'light' &&
                'bg-linear-to-br from-gray-800/15 to-gray-950/30 backdrop-blur-lg',
              theme === 'light' && 'bg-linear-to-br from-gray-300 to-gray-400',
            )}
          >
            <img src="/image/team-fg.webp" alt="Solvin Group Team" />
          </div>

          <div className="space-y-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-background/40 backdrop-blur-lg rounded-xl p-5 border border-border/50 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="aspect-square w-12 h-12 rounded-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-brand-primary text-sm">{member.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
