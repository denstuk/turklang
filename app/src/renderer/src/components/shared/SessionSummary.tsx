import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'

interface SessionSummaryProps {
  open: boolean
  onClose: () => void
  correct: number
  total: number
  duration: number
}

export default function SessionSummary({
  open,
  onClose,
  correct,
  total,
  duration
}: SessionSummaryProps) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const mins = Math.floor(duration / 60)
  const secs = duration % 60

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h3>

        <div className="flex justify-center gap-8 my-6">
          <div>
            <p className="text-3xl font-bold text-emerald-500">{correct}</p>
            <p className="text-xs text-gray-400">Correct</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{total}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-500">{pct}%</p>
            <p className="text-xs text-gray-400">Accuracy</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Time: {mins}m {secs}s
        </p>

        <Button onClick={onClose} size="lg">
          Continue
        </Button>
      </div>
    </Modal>
  )
}
