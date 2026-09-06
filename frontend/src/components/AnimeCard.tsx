import type { Anime } from '../data/animes'

interface AnimeCardProps {
  anime: Anime
  className?: string
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  return (
    <article className={`anime-card ${className}`}>
      <div className="anime-art"><span>★ {anime.score}</span></div>
      <div className="anime-info">
        <h3>{anime.title}</h3>
        <p>{anime.genre}</p>
        <button className="secondary-button">+ Minha lista</button>
      </div>
    </article>
  )
}
