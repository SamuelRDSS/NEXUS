import { Heart } from 'lucide-react'
import type { Anime } from '../data/animes'

interface AnimeCardProps {
  anime: Anime
  className?: string
  favorite: boolean
  onToggleFavorite: () => void
}

export function AnimeCard({ anime, className, favorite, onToggleFavorite }: AnimeCardProps) {
  return (
    <article className={`anime-card ${className}`}>
      <div className="anime-art">
        <img className="anime-poster" src={anime.poster} alt="" loading="lazy" />
        <span aria-label={`Nota demonstrativa ${anime.score} de 10`}>★ {anime.score} <small>demo</small></span>
        <button type="button" className={favorite ? 'favorite-button favorited' : 'favorite-button'} aria-label={favorite ? `Remover ${anime.title} dos favoritos` : `Adicionar ${anime.title} aos favoritos`} aria-pressed={favorite} onClick={onToggleFavorite}>
          <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="anime-info">
        <h3>{anime.title}</h3>
        <p>{anime.genre}</p>
        <details className="anime-details"><summary>Ver detalhes</summary><p>{anime.synopsis}</p></details>
        <button type="button" className="secondary-button" onClick={onToggleFavorite} aria-pressed={favorite}>{favorite ? '✓ Na minha lista' : '+ Minha lista'}</button>
      </div>
    </article>
  )
}
