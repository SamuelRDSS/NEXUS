import { useEffect, useMemo, useState } from 'react'
import { Search, Send, X } from 'lucide-react'
import { posts as demoPosts } from '../data/posts'
import type { Post } from '../data/posts'
import { PostCard } from './PostCard'
import { Sidebar } from './Sidebar'

interface FeedProps {
  composerOpen: boolean
  onComposerOpenChange: (open: boolean) => void
}

const filters = ['Todos', '#Final', '#Recomendação', '#Discussão', '#Mangá', '#Cosplay']
const botPrompts = [
  'Qual anime você recomendaria para alguém que quer começar a explorar esse universo? Conte o motivo, sem spoilers.',
  'Se pudesse passar um dia no mundo de um anime, qual escolheria e o que faria primeiro?',
  'Qual abertura combina melhor com uma maratona hoje? Vale defender sua escolha!',
  'Que personagem merece mais reconhecimento? Apresente seu argumento para a comunidade.',
  'Qual jogo ou anime você gostaria de esquecer para poder descobrir tudo de novo?',
  'Monte uma equipe de três personagens de universos diferentes. Quem você escolheria?',
  'Qual trilha sonora geek não pode faltar na sua playlist?',
]

interface DailyBotPost extends Post {
  id: string
  author: string
  handle: string
  text: string
  tag: string
  kind: 'bot'
  likes: number
  comments: number
}

function localDailyBotPost(): DailyBotPost {
  const date = new Date().toISOString().slice(0, 10)
  const dayIndex = Math.floor(Date.now() / 86_400_000) % botPrompts.length
  return {
    id: `nexus-bot-local-${date}`,
    author: 'Nexus Bot',
    handle: '@nexus_bot',
    text: botPrompts[dayIndex],
    tag: '#PerguntaDoDia',
    kind: 'bot',
    likes: 0,
    comments: 0,
  }
}

export function Feed({ composerOpen, onComposerOpenChange }: FeedProps) {
  const [feedPosts, setFeedPosts] = useState(demoPosts)
  const [liked, setLiked] = useState<string[]>([])
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [botPost, setBotPost] = useState<DailyBotPost>(localDailyBotPost)
  const [botNotice, setBotNotice] = useState('Pergunta automática de demonstração; sem IA e não salva no servidor.')

  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

    fetch(`${apiUrl}/api/bot/daily-post`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`API respondeu com HTTP ${response.status}`)
        return response.json() as Promise<DailyBotPost>
      })
      .then((post) => {
        setBotPost(post)
        setBotNotice('Pergunta diária do Nexus Bot; conteúdo pré-escrito, sem IA.')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('Não foi possível carregar o post diário do bot:', error)
        setBotNotice('API do bot indisponível. Exibindo pergunta local de demonstração, não publicada no servidor.')
      })

    return () => controller.abort()
  }, [])

  const visiblePosts = useMemo(() => [botPost, ...feedPosts].filter((post) => {
    const matchesSearch = `${post.author} ${post.handle} ${post.text} ${post.tag}`
      .toLocaleLowerCase('pt-BR')
      .includes(search.toLocaleLowerCase('pt-BR'))
    return matchesSearch && (activeFilter === 'Todos' || post.tag === activeFilter)
  }), [activeFilter, botPost, feedPosts, search])

  const publishPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      setError('Escreva algo antes de publicar.')
      return
    }

    const newPost: Post = {
      id: `local-${Date.now()}`,
      author: 'Samuel',
      handle: '@samuel_otaku',
      text,
      likes: 0,
      comments: 0,
      tag: '#Comunidade',
    }
    setFeedPosts((current) => [newPost, ...current])
    setDraft('')
    setError('')
    setNotice('Publicação adicionada ao feed desta sessão.')
    setActiveFilter('Todos')
    setSearch('')
    onComposerOpenChange(false)
  }

  const toggleLike = (id: string) => {
    setLiked((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id])
  }

  const addComment = (id: string) => {
    setCommentCounts((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }

  return (
    <section className="content-grid" id="feed">
      <div>
        <div className="section-heading">
          <div><span className="section-kicker">AGORA NA COMUNIDADE</span><h2>Feed Otaku</h2></div>
          <span className="live-pill"><i /> Mural demonstrativo</span>
        </div>
        <div className="feed-tools">
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <input id="feed-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar posts, pessoas ou temas" aria-label="Buscar no feed" />
          </label>
          <div className="filter-list" aria-label="Filtrar publicações">
            {filters.map((filter) => (
              <button key={filter} type="button" className={activeFilter === filter ? 'filter-chip active' : 'filter-chip'} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
            ))}
          </div>
        </div>
        {notice && <p className="status-message" role="status">{notice}</p>}
        <p className="bot-disclaimer" role="status"><strong>Nexus Bot · NPC</strong> {botNotice}</p>
        {composerOpen && (
          <form className="composer post-card" onSubmit={publishPost}>
            <div className="composer-heading">
              <div><span className="section-kicker">SUA VOZ NA NEXUS</span><h3>Criar publicação</h3></div>
              <button className="icon-button" type="button" aria-label="Fechar editor" onClick={() => onComposerOpenChange(false)}><X size={17} /></button>
            </div>
            <label className="sr-only" htmlFor="post-draft">Texto da publicação</label>
            <textarea id="post-draft" autoFocus value={draft} maxLength={500} onChange={(event) => { setDraft(event.target.value); setError('') }} placeholder="O que você quer compartilhar com a comunidade?" rows={4} />
            <div className="composer-footer">
              <span>{draft.length}/500 caracteres · publicação local</span>
              <button className="primary-button" type="submit"><Send size={16} /> Publicar</button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        )}
        <div className="post-list">
          {visiblePosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              liked={liked.includes(post.id)}
              commentCount={commentCounts[post.id] ?? post.comments}
              onToggleLike={() => toggleLike(post.id)}
              onComment={() => addComment(post.id)}
            />
          ))}
          {visiblePosts.length === 0 && <div className="empty-state"><Search size={22} /><strong>Nenhuma publicação encontrada</strong><span>Tente outro termo ou filtro.</span></div>}
        </div>
      </div>
      <Sidebar />
    </section>
  )
}
