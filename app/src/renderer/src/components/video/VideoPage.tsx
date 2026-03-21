import { useEffect, useState } from 'react'
import { VideoLesson } from '@/types'
import Card from '@/components/common/Card'
import Modal from '@/components/common/Modal'

const DIFFICULTY_COLORS = {
  beginner: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  intermediate: { bg: 'bg-blue-50', text: 'text-blue-600' },
  advanced: { bg: 'bg-purple-50', text: 'text-purple-600' }
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoLesson[]>([])
  const [playing, setPlaying] = useState<VideoLesson | null>(null)

  useEffect(() => {
    window.api.getVideoCatalog().then((data) => setVideos(data as VideoLesson[]))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Video Lessons</h2>
      <p className="text-sm text-gray-400 mb-6">Learn Turkish with curated video content</p>

      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => {
          const dc = DIFFICULTY_COLORS[video.difficulty]
          return (
            <Card
              key={video.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div onClick={() => setPlaying(video)}>
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <span className="text-xl ml-0.5">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dc.bg} ${dc.text}`}>
                      {video.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{video.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Video Player Modal */}
      <Modal open={!!playing} onClose={() => setPlaying(null)}>
        {playing && (
          <div>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800">{playing.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{playing.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
