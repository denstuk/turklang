import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { useProgress } from '@/hooks/useProgress'
import { Level, LEVEL_NAMES, LEVEL_COLORS } from '@/types'
import { allWordsFlat } from '@/data/words'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import LevelBadge from '@/components/common/LevelBadge'

export default function DashboardPage() {
  const { progress, words } = useProgress()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const totalWords = words ? allWordsFlat(words).length : 0
    const wordEntries = Object.values(progress.words)
    const known = wordEntries.filter((w) => w.level >= 4).length
    const learning = wordEntries.filter((w) => w.level >= 1 && w.level < 4).length

    const levelCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const w of wordEntries) levelCounts[w.level] = (levelCounts[w.level] || 0) + 1
    const unseenCount = totalWords - wordEntries.length
    levelCounts[0] += unseenCount

    const levelData = Object.entries(levelCounts).map(([level, count]) => ({
      level: LEVEL_NAMES[Number(level) as Level],
      count,
      color: LEVEL_COLORS[Number(level) as Level]
    }))

    const weakWords = wordEntries.length > 0
      ? Object.entries(progress.words)
          .filter(([, w]) => w.seen > 0 && w.level < 4)
          .sort((a, b) => a[1].level - b[1].level || b[1].incorrect - a[1].incorrect)
          .slice(0, 5)
      : []

    const activityMap: Record<string, number> = {}
    for (const s of progress.sessions) {
      const day = s.date.split('T')[0]
      activityMap[day] = (activityMap[day] || 0) + s.totalWords
    }
    const activityData = Object.entries(activityMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, words]) => ({ date: date.slice(5), words }))

    return { totalWords, known, learning, levelData, weakWords, activityData }
  }, [progress, words])

  const pct = stats.totalWords > 0 ? Math.round((stats.known / stats.totalWords) * 100) : 0
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (pct / 100) * circumference

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Overall Progress Ring */}
        <Card className="p-6 col-span-2">
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{pct}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Words Mastered</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.known}{' '}
                <span className="text-base font-normal text-gray-400">/ {stats.totalWords}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.learning} currently learning
              </p>
            </div>
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-6" gradient="from-orange-400 to-red-400">
          <div className="text-center">
            <p className="text-4xl mb-2">🔥</p>
            <p className="text-3xl font-bold text-gray-800">{progress.dailyStreak}</p>
            <p className="text-sm text-gray-400">Day Streak</p>
            <p className="text-xs text-gray-300 mt-2">
              {progress.totalSessions} total sessions
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Activity Chart */}
        <Card className="p-6" gradient="from-blue-400 to-purple-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Activity (Last 14 Days)</h3>
          {stats.activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={stats.activityData}>
                <defs>
                  <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="words"
                  stroke="#3B82F6"
                  fill="url(#activityGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Complete a session to see activity
            </p>
          )}
        </Card>

        {/* Level Breakdown */}
        <Card className="p-6" gradient="from-purple-400 to-pink-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Level Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.levelData}>
              <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stats.levelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Weak Words */}
        <Card className="p-6" gradient="from-red-400 to-orange-400">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Words to Practice</h3>
          {stats.weakWords.length > 0 ? (
            <div className="space-y-2">
              {stats.weakWords.map(([id, wp]) => (
                <div key={id} className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-700">{id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {wp.correct}/{wp.seen}
                    </span>
                    <LevelBadge level={wp.level as Level} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No weak words yet</p>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Start</h3>
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => navigate('/flashcards')}
            >
              🃏 Flashcards
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => navigate('/quiz')}
            >
              ✅ Quiz
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => navigate('/typing')}
            >
              ⌨️ Type the Answer
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start text-left"
              onClick={() => navigate('/grammar')}
            >
              📖 Grammar Lessons
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
