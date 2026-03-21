import { useCallback } from 'react'

export function useTTS() {
  const speak = useCallback((text: string, lang = 'tr-TR') => {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.85

    const voices = window.speechSynthesis.getVoices()
    const turkishVoice = voices.find((v) => v.lang.startsWith('tr'))
    if (turkishVoice) utterance.voice = turkishVoice

    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak }
}
