import { motion, useScroll, useTransform } from 'framer-motion'

export function BackgroundLayer() {
  const { scrollY } = useScroll()

  const gridY = useTransform(scrollY, [0, 1000], [0, 200])
  const orangeOrbY = useTransform(scrollY, [0, 1000], [0, -150])
  const blueOrbY = useTransform(scrollY, [0, 1000], [0, 400])
  const redOrbY = useTransform(scrollY, [0, 1000], [0, 100])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none top-0">
      <motion.div style={{ y: gridY }} className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0 h-full w-full bg-background"
          style={{
            backgroundImage:
              'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          <div
            className="absolute inset-0 bg-background"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 20%, white)',
            }}
          ></div>
          <div className="absolute inset-0 bg-background/0 mask-[radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
        </div>

        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 100%)',
          }}
        ></div>
      </motion.div>
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
            className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] will-change-transform"
            style={{
              background: 'var(--color-brand-primary)',
              opacity: 'var(--aurora-opacity)',
            }}
          />
        </motion.div>

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
            className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[80px] will-change-transform"
            style={{
              background: 'var(--color-brand-secondary)',
              opacity: 'calc(var(--aurora-opacity) * 0.7)',
            }}
          />
        </motion.div>

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
            className="absolute top-[40%] -left-[10%] w-[600px] h-[400px] rounded-[100%] blur-[90px] will-change-transform"
            style={{
              background: 'var(--color-royal-blue)',
              opacity: 'calc(var(--aurora-opacity) * 0.8)',
            }}
          />
        </motion.div>

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
          className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full blur-[60px] bg-indigo-100 dark:bg-indigo-900 will-change-transform"
          style={{ opacity: 'calc(var(--aurora-opacity) * 0.35)' }}
        />
      </div>
    </div>
  )
}
