import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="drag-region h-8 shrink-0" />
        <div className="px-8 pb-8">{children}</div>
      </main>
    </div>
  )
}
