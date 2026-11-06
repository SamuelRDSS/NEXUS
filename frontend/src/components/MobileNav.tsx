import { Compass, Home, Plus, Users } from 'lucide-react'

interface MobileNavProps {
  onCreatePost: () => void
}

export function MobileNav({ onCreatePost }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Navegação principal móvel">
      <a className="active" href="#top"><Home size={18} />Início</a>
      <a href="#explore"><Compass size={18} />Explorar</a>
      <button type="button" onClick={onCreatePost}><Plus size={18} />Postar</button>
      <a href="#communities"><Users size={18} />Comunidade</a>
      <a href="#profile"><span className="mobile-avatar">S</span>Perfil</a>
    </nav>
  )
}
