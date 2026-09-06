import { Bell, Search, Sparkles } from 'lucide-react'

export function Navbar() {
  return (
    <header className="topbar">
      <a className="brand" href="#top">
        <span className="brand-mark"><Sparkles size={18} /></span>NEXUS OTAKU
      </a>
      <nav>
        <a href="#feed">Feed</a>
        <a href="#explore">Explorar</a>
        <a href="#community">Comunidade</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Pesquisar"><Search size={18} /></button>
        <button className="icon-button" aria-label="Notificações"><Bell size={18} /><span className="notification-dot" /></button>
        <span className="user-badge"><span className="avatar">S</span>Samuel</span>
      </div>
    </header>
  )
}
