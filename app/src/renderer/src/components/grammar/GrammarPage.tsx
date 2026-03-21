import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GrammarLesson } from '@/types'
import Card from '@/components/common/Card'

const DIFFICULTY_COLORS = {
  beginner: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  intermediate: { bg: 'bg-blue-50', text: 'text-blue-600' },
  advanced: { bg: 'bg-purple-50', text: 'text-purple-600' }
}

const DIFFICULTY_GRADIENTS = {
  beginner: 'from-emerald-400 to-cyan-400',
  intermediate: 'from-blue-400 to-purple-400',
  advanced: 'from-purple-400 to-pink-400'
}

export default function GrammarPage() {
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    window.api.getGrammarLessons().then((data) => setLessons(data as GrammarLesson[]))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Grammar Lessons</h2>
      <p className="text-sm text-gray-400 mb-6">Interactive Turkish grammar exercises</p>

      <div className="grid grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const dc = DIFFICULTY_COLORS[lesson.difficulty]
          return (
            <Card
              key={lesson.id}
              gradient={DIFFICULTY_GRADIENTS[lesson.difficulty]}
              className="p-5 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div onClick={() => navigate(`/grammar/${lesson.id}`)}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${dc.bg} ${dc.text}`}
                  >
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lesson.exercises.length} exercises
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.description}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
