import './App.css'
import './assets.css'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Feed } from './components/Feed'
import { AnimeGrid } from './components/AnimeGrid'
import { FloatingButton } from './components/FloatingButton'
import { MobileNav } from './components/MobileNav'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="top">
        <Hero />
        <Feed />
        <AnimeGrid />
      </main>
      <FloatingButton />
      <MobileNav />
    </div>
  )
}

export default App
