import { useState } from 'react'
import './App.css'
import './assets.css'
import './Workspace.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Feed } from './components/Feed'
import { AnimeGrid } from './components/AnimeGrid'
import { FloatingButton } from './components/FloatingButton'
import { MobileNav } from './components/MobileNav'
import { DiscoverySections } from './components/DiscoverySections'

function App() {
  const [composerOpen, setComposerOpen] = useState(false)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#feed">Pular para o conteúdo</a>
      <Navbar />
      <main id="top">
        <Hero />
        <Feed composerOpen={composerOpen} onComposerOpenChange={setComposerOpen} />
        <AnimeGrid />
        <DiscoverySections />
      </main>
      <FloatingButton onClick={() => setComposerOpen(true)} />
      <MobileNav onCreatePost={() => setComposerOpen(true)} />
    </div>
  )
}

export default App
