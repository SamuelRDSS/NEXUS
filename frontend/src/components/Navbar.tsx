import { Bell, Search, Sparkles } from 'lucide-react'

export function Navbar() {
  const focusFeedSearch = () => {
    document.getElementById('feed-search')?.focus()
  }

  return (
    <header className="topbar">
      <a className="brand" href="#top">
        <span className="brand-mark"><Sparkles size={18} /></span>NEXUS OTAKU
      </a>
      <nav>
        <a href="#feed">Feed</a>
        <a href="#explore">Explorar</a>
        <a href="#communities">Comunidades</a>
        <a href="#news">Notícias</a>
        <a href="#quizzes">Quizzes</a>
        <a href="#rankings">Rankings</a>
      </nav>
      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="Pesquisar no feed" onClick={focusFeedSearch}><Search size={18} /></button>
        <a className="icon-button" href="#notifications" aria-label="Ver notificações"><Bell size={18} /><span className="notification-dot" /></a>
        <a className="user-badge" href="#profile"><span className="avatar">S</span>Samuel</a>
      </div>
    </header>
  )
}
