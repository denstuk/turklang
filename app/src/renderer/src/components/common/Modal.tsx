import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
