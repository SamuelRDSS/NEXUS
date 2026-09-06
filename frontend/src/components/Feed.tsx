import { useState } from 'react'
import { posts } from '../data/posts'
import { PostCard } from './PostCard'
import { Sidebar } from './Sidebar'

export function Feed() {
  const [liked, setLiked] = useState<number[]>([])

  const toggleLike = (index: number) =>
    setLiked((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    )

  return (
    <section className="content-grid" id="feed">
      <div>
        <div className="section-heading">
          <div><span className="section-kicker">AGORA NA COMUNIDADE</span><h2>Feed Otaku</h2></div>
          <span className="live-pill"><i /> 2.3K posts hoje</span>
        </div>
        <div className="post-list">
          {posts.map((post, index) => (
            <PostCard
              key={post.author}
              post={post}
              index={index}
              liked={liked.includes(index)}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      </div>
      <Sidebar />
    </section>
  )
}
