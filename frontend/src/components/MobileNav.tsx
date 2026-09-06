import { Heart, Home, Plus, Search, Users } from 'lucide-react'

export function MobileNav() {
  return (
    <nav className="mobile-nav">
      <a className="active" href="#top"><Home size={18} />Início</a>
      <a href="#explore"><Search size={18} />Explorar</a>
      <a href="#feed"><Plus size={18} />Postar</a>
      <a href="#community"><Heart size={18} />Comunidade</a>
      <a href="#top"><Users size={18} />Perfil</a>
    </nav>
  )
}
