import { ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const VARIANTS = {
  primary:
    'text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-sm',
  secondary:
    'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50',
  ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isInteractive = variant !== 'ghost'
  return (
    <motion.button
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      whileTap={isInteractive ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15 }}
      className={`rounded-xl font-medium transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
