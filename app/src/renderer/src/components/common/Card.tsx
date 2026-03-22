import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  hoverable?: boolean
}

export default function Card({
  children,
  className = '',
  gradient = 'from-emerald-400 to-cyan-400',
  hoverable = false
}: CardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm overflow-hidden ${
        hoverable ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      {children}
    </div>
  )
}
