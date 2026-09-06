import { animes } from '../data/animes'
import { AnimeCard } from './AnimeCard'

export function AnimeGrid() {
  return (
    <section className="explore-section" id="explore">
      <div className="section-heading">
        <div><span className="section-kicker">DESCUBRA NOVOS MUNDOS</span><h2>Explorar animes</h2></div>
        <button className="text-button">Ver catálogo completo <span>→</span></button>
      </div>
      <div className="anime-grid">
        {animes.map((anime, index) => (
          <AnimeCard key={anime.title} anime={anime} className={`anime-${index}`} />
        ))}
      </div>
    </section>
  )
}
