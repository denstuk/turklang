import { useTTS } from '@/hooks/useTTS'

interface SpeakButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg' }

export default function SpeakButton({ text, className = '', size = 'md' }: SpeakButtonProps) {
  const { speak } = useTTS()

  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text) }}
      className={`rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 flex items-center justify-center transition-all ${SIZES[size]} ${className}`}
      title="Listen"
    >
      🔊
    </button>
  )
}
