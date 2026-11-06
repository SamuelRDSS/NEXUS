import { useState } from 'react'
import { BellRing, Check, Gamepad2, Sparkles, TrendingUp, Trophy, Users } from 'lucide-react'
import { interests, matches } from '../data/animes'

export function Sidebar() {
  const [joined, setJoined] = useState<string[]>([])
  const [quizAnswer, setQuizAnswer] = useState('')

  const toggleCommunity = (name: string) => {
    setJoined((current) => current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name])
  }

  return (
    <aside className="sidebar">
      <ProfilePanel />
      <section className="side-panel" id="community">
        <div className="panel-title"><h3>Comunidades</h3><Users size={17} /></div>
        {['Clube do Shonen', 'Ateliê Cosplay', 'RPG & Fantasia'].map((name, index) => {
          const isJoined = joined.includes(name)
          return (
            <div className="community-row" key={name}>
              <span className={`community-symbol community-${index}`}><Users size={15} /></span>
              <div><strong>{name}</strong><span>{[1280, 846, 692][index].toLocaleString('pt-BR')} membros · comunidade demo</span></div>
              <button type="button" className={isJoined ? 'join-button joined' : 'join-button'} aria-pressed={isJoined} onClick={() => toggleCommunity(name)}>{isJoined ? <><Check size={13} /> Sair</> : 'Entrar'}</button>
            </div>
          )
        })}
      </section>
      <section className="side-panel">
        <div className="panel-title"><h3>Match otaku</h3><span>Exemplos</span></div>
        {matches.map((name, index) => (
          <div className="match-row" key={name}>
            <span className="avatar">{name[0]}</span>
            <div><strong>{name}</strong><span>@{name.toLowerCase()}_quest</span></div>
            <b>{94 - index * 3}%</b>
          </div>
        ))}
      </section>
      <section className="side-panel">
        <div className="panel-title"><h3>Seus interesses</h3><Gamepad2 size={17} /></div>
        <div className="interest-list">
          {interests.map((interest) => (
            <span key={interest}>{interest}</span>
          ))}
        </div>
      </section>
      <section className="side-panel">
        <div className="panel-title"><h3>Tendências</h3><TrendingUp size={17} /></div>
        <p className="trend-disclaimer">Tópicos de exemplo · atividade fictícia</p>
        {[
          ['#TeoriaDeFã', '2,4 mil conversas demo'],
          ['#MaratonaOtaku', '1,8 mil conversas demo'],
          ['#CosplayCriativo', '986 conversas demo'],
        ].map(([tag, activity]) => <a className="trend-row" href="#feed" key={tag}><strong>{tag}</strong><span>{activity}</span></a>)}
      </section>
      <section className="side-panel news-panel">
        <div className="panel-title"><h3>Painel de notícias</h3><Sparkles size={17} /></div>
        <p className="demo-disclaimer">Conteúdo demonstrativo — não são notícias atuais.</p>
        <article className="news-item"><span>PAUTA FICTÍCIA · 01</span><strong>Como comunidades criam listas colaborativas de maratona</strong><small>Exemplo editorial para demonstração</small></article>
        <article className="news-item"><span>PAUTA FICTÍCIA · 02</span><strong>Ideias para um encontro de cosplay entre membros</strong><small>Exemplo editorial para demonstração</small></article>
      </section>
      <section className="side-panel quiz-panel">
        <div className="panel-title"><h3>Quiz da comunidade</h3><Sparkles size={17} /></div>
        <p>Qual gênero combina com histórias de mundos mágicos e jornadas heroicas?</p>
        <div className="quiz-options">
          {['Fantasia', 'Suspense', 'Slice of life'].map((answer) => (
            <button type="button" key={answer} className={quizAnswer === answer ? 'quiz-option selected' : 'quiz-option'} aria-pressed={quizAnswer === answer} onClick={() => setQuizAnswer(answer)}>{answer}</button>
          ))}
        </div>
        {quizAnswer && <span className="quiz-feedback" role="status">{quizAnswer === 'Fantasia' ? 'Acertou! Este quiz é demonstrativo.' : 'Boa tentativa! Resposta demo: Fantasia.'}</span>}
      </section>
      <section className="side-panel">
        <div className="panel-title"><h3>Ranking da semana</h3><Trophy size={17} /></div>
        <ol className="ranking-list">
          {['Mika Arai', 'Yuri Tanaka', 'Reika Sato'].map((name, index) => <li key={name}><span className="ranking-position">0{index + 1}</span><strong>{name}</strong><span>{[980, 845, 710][index]} XP demo</span></li>)}
        </ol>
      </section>
      <section className="side-panel notification-panel" id="notifications">
        <div className="panel-title"><h3>Notificações</h3><BellRing size={17} /></div>
        <p><span className="notification-mark" /> Você tem novidades nas comunidades que acompanha.</p>
        <small>Exemplo de notificação · conteúdo local demonstrativo</small>
      </section>
    </aside>
  )
}

function ProfilePanel() {
  return (
    <section className="profile-panel" id="profile">
      <span className="avatar profile-avatar">S</span>
      <h3>Samuel</h3>
      <span className="muted">@samuel_otaku</span>
      <span className="level-label">OTAKU VETERANO · NÍVEL 27</span>
      <div className="progress"><span /></div>
      <small>1.420 XP <b>/ 1.700 XP</b></small>
    </section>
  )
}
