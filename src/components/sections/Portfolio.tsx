import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { portfolio, PortfolioItem } from '../../data'
import { Button } from '../ui/Button'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useMountedTheme } from '@/hooks/useMountedTheme'

interface ParallaxProps {
  children: React.ReactNode
  baseVelocity: number
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  // Magic wrapping logic
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef<number>(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    // This is what changes the direction of the scroll once we
    // switch scrolling directions.
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="overflow-hidden m-0 flex flex-nowrap whitespace-nowrap">
      <motion.div className="flex flex-nowrap gap-8" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  )
}

export function Portfolio() {
  const { t } = useTranslation()
  const { theme } = useMountedTheme()

  return (
    <section
      id="portfolio"
      className={cn(
        'py-24 overflow-hidden border-t',
        theme !== 'light' &&
          'bg-gray-900/20 border-gray-800/50 backdrop-blur-md',
        theme === 'light' && 'bg-gray-900 border-gray-200',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-gray-400 max-w-xl flex items-center gap-2">
            {t('portfolio.scrollHint')}
          </p>
        </div>
        <Link to="/portfolio">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {t('portfolio.viewAll')}
          </Button>
        </Link>
      </div>

      <div className="relative w-full">
        <ParallaxText baseVelocity={-2}>
          {portfolio.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </ParallaxText>
      </div>
    </section>
  )
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const { theme } = useMountedTheme()
  return (
    <Link to="/portfolio" className="block outline-none shrink-0">
      <div className="group relative h-[450px] w-[350px] md:w-[500px] bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden hover:border-brand-primary transition-colors duration-500">
        <div className="h-2/3 bg-gray-700 w-full flex items-center justify-center relative group-hover:bg-gray-750 transition-colors">
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent opacity-60" />

          <span className="text-gray-500 font-mono text-sm relative z-10 px-4 py-2 border border-gray-600 rounded bg-gray-800/50 backdrop-blur-sm">
            [PROJECT_IMAGE_SLOT_{item.id}]
          </span>

          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-md p-4 rounded-full">
            <ArrowUpRight className="text-white w-6 h-6" />
          </div>
        </div>

        <div className="h-1/3 p-8 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <span className="text-gray-500 font-mono text-sm">
                {item.year}
              </span>
            </div>
            <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
              {item.sector}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
