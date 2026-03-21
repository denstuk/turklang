import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GrammarLesson, Exercise } from '@/types'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import FillInBlank from './FillInBlank'
import SentenceBuilder from './SentenceBuilder'
import ConjugationDrill from './ConjugationDrill'

export default function LessonView() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<GrammarLesson | null>(null)
  const [phase, setPhase] = useState<'learn' | 'practice'>('learn')
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    window.api.getGrammarLessons().then((data) => {
      const lessons = data as GrammarLesson[]
      const found = lessons.find((l) => l.id === lessonId)
      if (found) setLesson(found)
    })
  }, [lessonId])

  if (!lesson) return null

  const handleExerciseComplete = () => {
    setCompleted((c) => c + 1)
    if (exerciseIdx + 1 < lesson.exercises.length) {
      setExerciseIdx((i) => i + 1)
    }
  }

  if (phase === 'learn') {
    return (
      <div className="max-w-2xl mx-auto mt-4">
        <button
          onClick={() => navigate('/grammar')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 block"
        >
          ← Back to lessons
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h2>
        <p className="text-sm text-gray-500 mb-6">{lesson.description}</p>

        <div className="space-y-4">
          {lesson.sections.map((section, i) => (
            <Card key={i} className="p-6">
              {section.type === 'explanation' && (
                <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
              )}

              {section.type === 'example' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">{section.content}</h4>
                  <div className="space-y-2">
                    {section.examples?.map((ex, j) => (
                      <div key={j} className="flex gap-4 py-1.5 border-b border-gray-50 last:border-0">
                        <span className="font-medium text-gray-800 text-sm">{ex.tr}</span>
                        <span className="text-gray-400 text-sm">{ex.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.type === 'table' && section.table && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">{section.content}</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {section.table.headers.map((h, j) => (
                          <th key={j} className="text-left py-2 px-3 text-gray-400 font-medium border-b border-gray-100">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, j) => (
                        <tr key={j} className="border-b border-gray-50 last:border-0">
                          {row.map((cell, k) => (
                            <td key={k} className="py-2 px-3 text-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Button onClick={() => setPhase('practice')} size="lg" className="w-full mt-6">
          Start Exercises ({lesson.exercises.length})
        </Button>
      </div>
    )
  }

  const exercise = lesson.exercises[exerciseIdx]
  const allDone = completed >= lesson.exercises.length

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <button
        onClick={() => setPhase('learn')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-4 block"
      >
        ← Back to lesson
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
        <span className="text-sm text-gray-400">
          {Math.min(exerciseIdx + 1, lesson.exercises.length)} / {lesson.exercises.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${(completed / lesson.exercises.length) * 100}%` }}
        />
      </div>

      {allDone ? (
        <Card className="p-8 text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Lesson Complete!</h3>
          <p className="text-gray-500 mb-6">
            You completed all {lesson.exercises.length} exercises
          </p>
          <Button onClick={() => navigate('/grammar')} size="lg">
            Back to Lessons
          </Button>
        </Card>
      ) : (
        <ExerciseRenderer exercise={exercise} onComplete={handleExerciseComplete} />
      )}
    </div>
  )
}

function ExerciseRenderer({
  exercise,
  onComplete
}: {
  exercise: Exercise
  onComplete: () => void
}) {
  switch (exercise.type) {
    case 'fill_blank':
      return <FillInBlank key={exercise.sentence} exercise={exercise} onComplete={onComplete} />
    case 'sentence_build':
      return <SentenceBuilder key={exercise.english} exercise={exercise} onComplete={onComplete} />
    case 'conjugation':
      return <ConjugationDrill key={exercise.verb} exercise={exercise} onComplete={onComplete} />
  }
}
