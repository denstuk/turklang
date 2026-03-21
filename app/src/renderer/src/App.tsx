import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/useProgress'
import AppShell from '@/components/layout/AppShell'
import SplashScreen from '@/components/layout/SplashScreen'
import DashboardPage from '@/components/dashboard/DashboardPage'
import FlashcardsPage from '@/components/flashcards/FlashcardsPage'
import QuizPage from '@/components/quiz/QuizPage'
import TypingPage from '@/components/typing/TypingPage'
import GrammarPage from '@/components/grammar/GrammarPage'
import LessonView from '@/components/grammar/LessonView'
import AudioPage from '@/components/audio/AudioPage'
import VideoPage from '@/components/video/VideoPage'
import ProgressPage from '@/components/progress/ProgressPage'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <ProgressProvider>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/typing" element={<TypingPage />} />
            <Route path="/grammar" element={<GrammarPage />} />
            <Route path="/grammar/:lessonId" element={<LessonView />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </ProgressProvider>
  )
}
