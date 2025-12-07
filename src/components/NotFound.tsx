import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from './ui/Button'
import { BackgroundLayer } from './ui/BackgroundLayer'

export function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundLayer />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* 404 Number with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-[200px] md:text-[280px] flex items-center font-bold leading-none text-gray-100 select-none">
            <motion.span
              animate={{
                color: ['#f3f4f6', '#FFA629', '#f3f4f6'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              4
            </motion.span>
            <motion.span
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block w-28 md:w-56 h-28 md:h-56 relative"
            >
              <Search className="w-32 md:w-64 h-32 absolute md:h-64 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2  text-brand-primary inline" />
            </motion.span>
            <motion.span
              animate={{
                color: ['#f3f4f6', '#4F46E5', '#f3f4f6'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5,
              }}
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the
            digital void. Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/">
            <Button size="lg" className="rounded-full group">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
        </motion.div>

        {/* Fun suggestion */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-sm text-gray-400"
        >
          Error code: 404 • Maybe try the{' '}
          <Link to="/" className="text-brand-primary hover:underline">
            homepage
          </Link>
          ?
        </motion.p>
      </div>
    </div>
  )
}
