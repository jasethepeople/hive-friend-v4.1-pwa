import { Header } from '@/components/Header'
import { RealtimeStats } from '@/components/RealtimeStats'
import { RealtimeWorldMap } from '@/components/RealtimeWorldMap'
import { ControlPanel } from '@/components/ControlPanel'
import { LogStream } from '@/components/LogStream'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-400">Swarm Overview</h1>
          <ThemeToggle />
        </div>
        <RealtimeStats />
        <RealtimeWorldMap />
        <ControlPanel />
        <LogStream />
      </div>
    </main>
  );
}