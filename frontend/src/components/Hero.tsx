import { Compass, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="live-status"><span className="pulse-dot" /> 2.4K otakus conectados agora</p>
        <h1>Seu universo.<br />Seus animes.<br />Sua comunidade.</h1>
        <p>Encontre pessoas que compartilham os mesmos animes, personagens, jogos e obsessões que você.</p>
        <div className="hero-actions">
          <button className="primary-button">Entrar na comunidade <Users size={17} /></button>
          <button className="secondary-button">Explorar animes <Compass size={17} /></button>
        </div>
        <div className="stat-line">
          <span><strong>128K</strong> otakus ativos</span>
          <span><strong>4.8K</strong> posts hoje</span>
          <span><strong>91%</strong> compatibilidade média</span>
        </div>
      </div>
      <div className="hero-visual">
        <span className="hero-visual-tag">Comunidade em destaque · Jujutsu Kaisen</span>
        <div className="hero-visual-caption"><span className="pulse-dot" /> Ao vivo agora</div>
      </div>
    </section>
  )
}
