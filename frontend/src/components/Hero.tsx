import { Compass, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="live-status"><span className="pulse-dot" /> Prévia interativa · dados demonstrativos</p>
        <h1>Seu universo.<br />Seus animes.<br />Sua comunidade.</h1>
        <p>Encontre pessoas que compartilham os mesmos animes, personagens, jogos e obsessões que você.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#community">Entrar na comunidade <Users size={17} /></a>
          <a className="secondary-button" href="#explore">Explorar animes <Compass size={17} /></a>
        </div>
        <div className="stat-line">
          <span><strong>128K</strong> otakus ativos · demo</span>
          <span><strong>4.8K</strong> posts · demo</span>
          <span><strong>91%</strong> compatibilidade · demo</span>
        </div>
      </div>
      <div className="hero-visual">
        <span className="hero-visual-tag">Comunidade em destaque · Jujutsu Kaisen</span>
        <div className="hero-visual-caption"><span className="pulse-dot" /> Ao vivo agora</div>
      </div>
    </section>
  )
}
