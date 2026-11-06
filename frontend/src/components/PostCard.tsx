import { useState } from 'react'
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Bookmark, Flag } from 'lucide-react'
import type { Post } from '../data/posts'

interface PostCardProps {
  post: Post
  index: number
  liked: boolean
  commentCount: number
  onToggleLike: () => void
  onComment: () => void
}

export function PostCard({ post, index, liked, commentCount, onToggleLike, onComment }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [replies, setReplies] = useState<string[]>([])
  const [shareStatus, setShareStatus] = useState('')
  const [pollChoice, setPollChoice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [menuStatus, setMenuStatus] = useState('')

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = comment.trim()
    if (!text) return
    setReplies((current) => [...current, text])
    setComment('')
    onComment()
  }

  const sharePost = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${post.id}`)
      setShareStatus('Link copiado')
    } catch {
      setShareStatus('Não foi possível copiar o link neste navegador')
    }
  }

  return (
    <article className="post-card" id={post.id}>
      <div className="post-author">
        <span className="avatar avatar-large">{post.author[0]}</span>
        <div>
          <strong>{post.author}</strong>
          <span>{post.handle} · {post.kind === 'bot' ? 'pergunta diária automatizada' : `${index * 13 + 3} min atrás · perfil fictício`}</span>
        </div>
        <span className={post.kind === 'bot' ? 'bot-label' : 'demo-label'}>{post.kind === 'bot' ? 'BOT · NPC' : 'DEMO'}</span>
        <button type="button" className="more-button" aria-label="Mais opções da publicação" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={19} /></button>
      </div>
      {menuOpen && <div className="post-menu">
        <button type="button" onClick={() => { setSaved((current) => !current); setMenuStatus(saved ? 'Publicação removida dos salvos.' : 'Publicação salva nesta sessão.') }}><Bookmark size={14} />{saved ? 'Remover dos salvos' : 'Salvar publicação'}</button>
        <button type="button" onClick={() => { setMenuStatus('Publicação sinalizada para revisão demonstrativa.'); setMenuOpen(false) }}><Flag size={14} />Sinalizar publicação</button>
      </div>}
      {menuStatus && <p className="share-status" role="status">{menuStatus}</p>}
      <p>{post.text}</p>
      {post.image && <img className="post-media" src={post.image} alt={post.imageAlt ?? ''} loading="lazy" />}
      {post.poll && (
        <fieldset className="post-poll">
          <legend>Enquete demonstrativa · qual perfil você prefere?</legend>
          {post.poll.map((option) => (
            <button type="button" key={option} className={pollChoice === option ? 'poll-choice selected' : 'poll-choice'} aria-pressed={pollChoice === option} onClick={() => setPollChoice(option)}>{option}</button>
          ))}
          {pollChoice && <span className="poll-vote-status" role="status">Voto registrado nesta sessão: {pollChoice}</span>}
        </fieldset>
      )}
      <div className="post-tags">
        <span>{post.tag}</span>
        <span>#Anime</span>
      </div>
      <div className="post-actions">
        <button type="button" className={liked ? 'action-button liked' : 'action-button'} aria-pressed={liked} onClick={onToggleLike}>
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />{liked ? 'Curtido' : post.likes.toLocaleString('pt-BR')}
        </button>
        <button type="button" className="action-button" aria-expanded={commentsOpen} onClick={() => setCommentsOpen((open) => !open)}><MessageCircle size={16} />{commentCount}</button>
        <button type="button" className="action-button" onClick={sharePost}><Share2 size={16} /> Compartilhar</button>
      </div>
      {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}
      {commentsOpen && (
        <div className="comment-thread">
          {replies.map((reply, replyIndex) => <p className="local-reply" key={`${post.id}-reply-${replyIndex}`}><strong>Você</strong> {reply}</p>)}
          <form className="comment-form" onSubmit={submitComment}>
            <label className="sr-only" htmlFor={`comment-${post.id}`}>Escreva um comentário</label>
            <input id={`comment-${post.id}`} value={comment} onChange={(event) => setComment(event.target.value)} maxLength={240} placeholder="Escreva um comentário..." />
            <button type="submit" className="icon-button" aria-label="Enviar comentário" disabled={!comment.trim()}><Send size={15} /></button>
          </form>
          <small>Comentários adicionados aqui ficam nesta sessão.</small>
        </div>
      )}
    </article>
  )
}
