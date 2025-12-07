import { motion, useScroll, useTransform } from 'framer-motion'

export function BackgroundLayer() {
  const { scrollY } = useScroll()

  // Parallax Transforms
  const gridY = useTransform(scrollY, [0, 1000], [0, 200])
  const orangeOrbY = useTransform(scrollY, [0, 1000], [0, -150])
  const blueOrbY = useTransform(scrollY, [0, 1000], [0, 400])
  const redOrbY = useTransform(scrollY, [0, 1000], [0, 100])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 
        Layer 1: The Grid (Deepest)
        Z-Index: -2
      */}
      <motion.div style={{ y: gridY }} className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0 h-full w-full bg-white"
          style={{
            backgroundImage: 'radial-gradient(#bec6d4 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          {/* Faded edges mask */}
          <div
            className="absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 20%, white)',
            }}
          ></div>
          {/* Center visible mask */}
          <div className="absolute inset-0 bg-white/0 mask-[radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-90"></div>
      </motion.div>

      {/* 
        Layer 2: The Aurora Orbs (Atmosphere)
        Z-Index: -1
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Orb A: Innovation (Primary Orange) - Top Right */}
        <motion.div style={{ y: orangeOrbY }} className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, 50, 0],
              x: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 will-change-transform"
            style={{ background: 'var(--color-brand-primary)' }}
          />
        </motion.div>

        {/* Orb B: Intensity (Secondary Red) - Bottom Left */}
        <motion.div style={{ y: redOrbY }} className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-10 will-change-transform"
            style={{ background: 'var(--color-brand-secondary)' }}
          />
        </motion.div>

        {/* Orb C: Trust (Royal Blue - Balancer) - Center Left Floating */}
        <motion.div style={{ y: blueOrbY }} className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, 30, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 5,
            }}
            className="absolute top-[40%] -left-[10%] w-[600px] h-[400px] rounded-[100%] blur-[90px] opacity-12 will-change-transform"
            style={{ background: 'var(--color-royal-blue)' }}
          />
        </motion.div>

        {/* Additional "Connector" Orb to blend (Optional) */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full blur-[60px] opacity-5 bg-indigo-100 will-change-transform"
        />
      </div>
    </div>
  )
}
