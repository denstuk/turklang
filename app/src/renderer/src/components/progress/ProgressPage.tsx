import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { useProgress } from '@/hooks/useProgress'
import { Level, LEVEL_COLORS } from '@/types'
import { allWordsFlat } from '@/data/words'
import Card from '@/components/common/Card'
import ProgressBar from '@/components/common/ProgressBar'

export default function ProgressPage() {
  const { progress, words } = useProgress()

  const stats = useMemo(() => {
    if (!words) return null

    const categories = Object.entries(words.categories).map(([key, cat]) => {
      const catWords = cat.words
      const known = catWords.filter(
        (w) => progress.words[w.id] && progress.words[w.id].level >= 4
      ).length
      return { key, label: cat.label, total: catWords.length, known }
    })

    const cumulativeData: { date: string; total: number }[] = []
    const dayMap: Record<string, Set<string>> = {}
    for (const [id, wp] of Object.entries(progress.words)) {
      if (wp.lastSeen && wp.level >= 4) {
        const day = wp.lastSeen.split('T')[0]
        if (!dayMap[day]) dayMap[day] = new Set()
        dayMap[day].add(id)
      }
    }

    let running = 0
    const sortedDays = Object.keys(dayMap).sort()
    for (const day of sortedDays) {
      running += dayMap[day].size
      cumulativeData.push({ date: day.slice(5), total: running })
    }

    const totalWords = allWordsFlat(words).length
    const totalSeen = Object.values(progress.words).filter((w) => w.seen > 0).length
    const totalKnown = Object.values(progress.words).filter((w) => w.level >= 4).length
    const avgAccuracy =
      totalSeen > 0
        ? Math.round(
            (Object.values(progress.words).reduce((s, w) => s + (w.seen > 0 ? w.correct / w.seen : 0), 0) /
              totalSeen) *
              100
          )
        : 0

    const sessionData = progress.sessions
      .slice(-20)
      .map((s, i) => ({
        idx: i + 1,
        accuracy: s.totalWords > 0 ? Math.round((s.correctCount / s.totalWords) * 100) : 0,
        mode: s.mode
      }))

    return { categories, cumulativeData, totalWords, totalSeen, totalKnown, avgAccuracy, sessionData }
  }, [progress, words])

  if (!stats) return null

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Words', value: stats.totalWords, color: 'text-gray-800' },
          { label: 'Seen', value: stats.totalSeen, color: 'text-blue-500' },
          { label: 'Mastered', value: stats.totalKnown, color: 'text-emerald-500' },
          { label: 'Avg Accuracy', value: `${stats.avgAccuracy}%`, color: 'text-purple-500' }
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Words Over Time */}
        <Card className="p-6" gradient="from-emerald-400 to-cyan-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Words Mastered Over Time</h3>
          {stats.cumulativeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.cumulativeData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Master words to see progress</p>
          )}
        </Card>

        {/* Session Accuracy */}
        <Card className="p-6" gradient="from-blue-400 to-purple-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Session Accuracy</h3>
          {stats.sessionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.sessionData}>
                <XAxis dataKey="idx" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {stats.sessionData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.accuracy >= 80 ? '#10B981' : entry.accuracy >= 50 ? '#FBBF24' : '#EF4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Complete sessions to see data</p>
          )}
        </Card>
      </div>

      {/* Category Progress */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Progress by Category</h3>
        <div className="space-y-3">
          {stats.categories.map((cat) => (
            <div key={cat.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{cat.label}</span>
                <span className="text-gray-400">
                  {cat.known}/{cat.total}
                </span>
              </div>
              <ProgressBar value={cat.known} max={cat.total} />
            </div>
          ))}
        </div>
      </Card>

      {/* Session History */}
      {progress.sessions.length > 0 && (
        <Card className="p-6 mt-4" gradient="from-gray-300 to-gray-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Sessions</h3>
          <div className="space-y-2">
            {progress.sessions
              .slice(-10)
              .reverse()
              .map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base">
                      {s.mode === 'flashcards' ? '🃏' : s.mode === 'quiz' ? '✅' : '⌨️'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-700 capitalize">{s.mode}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(s.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {s.correctCount}/{s.totalWords}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.totalWords > 0
                        ? Math.round((s.correctCount / s.totalWords) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
