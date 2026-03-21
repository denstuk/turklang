import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/quiz', label: 'Quiz', icon: '✅' },
  { to: '/typing', label: 'Type Answer', icon: '⌨️' },
  { to: '/grammar', label: 'Grammar', icon: '📖' },
  { to: '/audio', label: 'Audio', icon: '🔊' },
  { to: '/video', label: 'Video', icon: '🎬' },
  { to: '/progress', label: 'Progress', icon: '📈' }
]

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-white border-r border-gray-100 flex flex-col pt-12 pb-4 shrink-0">
      <div className="px-6 mb-8">
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #10B981, #06B6D4, #3B82F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          TURKLANG
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Turkish Language</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 no-drag">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-300">v1.0.0</p>
      </div>
    </aside>
  )
}
