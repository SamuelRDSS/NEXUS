import { Heart, MessageCircle } from 'lucide-react'
import type { Post } from '../data/posts'

interface PostCardProps {
  post: Post
  index: number
  liked: boolean
  onToggleLike: (index: number) => void
}

export function PostCard({ post, index, liked, onToggleLike }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-author">
        <span className="avatar avatar-large">{post.author[0]}</span>
        <div>
          <strong>{post.author}</strong>
          <span>{post.handle} · {index * 13 + 3} min atrás</span>
        </div>
        <button className="more-button" aria-label="Mais opções">•••</button>
      </div>
      <p>{post.text}</p>
      <div className="post-tags">
        <span>{post.tag}</span>
        <span>#Anime</span>
      </div>
      <div className="post-actions">
        <button className={liked ? 'action-button liked' : 'action-button'} onClick={() => onToggleLike(index)}>
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />{liked ? 'Curtido' : post.likes}
        </button>
        <button className="action-button"><MessageCircle size={16} />{post.comments}</button>
        <button className="action-button"><span>↗</span> Compartilhar</button>
      </div>
    </article>
  )
}
