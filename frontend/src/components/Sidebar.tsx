import { Gamepad2 } from 'lucide-react'
import { interests, matches } from '../data/animes'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <ProfilePanel />
      <section className="side-panel" id="community">
        <div className="panel-title"><h3>Match otaku</h3><span>Ver todos</span></div>
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
    </aside>
  )
}

function ProfilePanel() {
  return (
    <section className="profile-panel">
      <span className="avatar profile-avatar">S</span>
      <h3>Samuel</h3>
      <span className="muted">@samuel_otaku</span>
      <span className="level-label">OTAKU VETERANO · NÍVEL 27</span>
      <div className="progress"><span /></div>
      <small>1.420 XP <b>/ 1.700 XP</b></small>
    </section>
  )
}
