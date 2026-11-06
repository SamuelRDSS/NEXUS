import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { animes } from '../data/animes'
import { AnimeCard } from './AnimeCard'

export function AnimeGrid() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Todos')
  const [sortBy, setSortBy] = useState('popularidade')
  const [favorites, setFavorites] = useState<string[]>([])
  const genres = ['Todos', 'Fantasia', 'Ação', 'Mistério', 'Sci-fi', 'Romance']
  const visibleAnimes = useMemo(() => {
    const filtered = animes.filter((anime) => {
      const matchesSearch = `${anime.title} ${anime.genre}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
      return matchesSearch && (genre === 'Todos' || anime.genre.toLocaleLowerCase('pt-BR').includes(genre.toLocaleLowerCase('pt-BR')))
    })
    if (sortBy === 'nome') return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
    if (sortBy === 'nota') return [...filtered].sort((a, b) => Number(b.score) - Number(a.score))
    return filtered
  }, [genre, search, sortBy])

  const toggleFavorite = (title: string) => {
    setFavorites((current) => current.includes(title)
      ? current.filter((item) => item !== title)
      : [...current, title])
  }

  return (
    <section className="explore-section" id="explore">
      <div className="section-heading">
        <div><span className="section-kicker">DESCUBRA NOVOS MUNDOS</span><h2>Catálogo anime</h2></div>
        <span className="demo-label">TÍTULOS E NOTAS FICTÍCIOS</span>
      </div>
      <div className="catalog-tools">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar anime ou gênero" aria-label="Buscar no catálogo" />
        </label>
        <label className="sort-control">Ordenar por
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Ordenar catálogo">
            <option value="popularidade">Destaques</option>
            <option value="nota">Nota demonstrativa</option>
            <option value="nome">Nome</option>
          </select>
        </label>
        <div className="filter-list" aria-label="Filtrar por gênero">
          {genres.map((item) => <button key={item} type="button" className={genre === item ? 'filter-chip active' : 'filter-chip'} aria-pressed={genre === item} onClick={() => setGenre(item)}>{item}</button>)}
        </div>
      </div>
      <p className="catalog-note">Obras e notas são exemplos de interface, não representam títulos ou avaliações reais.</p>
      {visibleAnimes.length > 0 ? (
        <div className="anime-grid">
          {visibleAnimes.map((anime) => (
            <AnimeCard key={anime.title} anime={anime} className={`anime-${animes.indexOf(anime) % 3}`} favorite={favorites.includes(anime.title)} onToggleFavorite={() => toggleFavorite(anime.title)} />
          ))}
        </div>
      ) : <div className="empty-state"><Search size={22} /><strong>Nenhum título encontrado</strong><span>Experimente outro termo ou gênero.</span></div>}
    </section>
  )
}
