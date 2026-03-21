import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-5xl font-extrabold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              TURKLANG
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm text-gray-400 mt-2 uppercase tracking-[0.2em]"
            >
              Turkish Language
            </motion.p>
            <div className="flex gap-2 justify-center mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
