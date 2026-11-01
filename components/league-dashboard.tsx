'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'

type TeamRow = {
  position: number
  name: string
  short: string
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  difference: string
}

type Match = {
  home: string
  away: string
  homeScore?: string
  awayScore?: string
  time?: string
  scorers?: string
}

const navigationGroups = [
  {
    label: '🌐 Ligas',
    items: ['🏴 Premier League', '🇪🇸 La Liga', '🇮🇹 Serie A', '🇩🇪 Bundesliga', '🇫🇷 Ligue 1', '🇳🇱 Eredivisie', '🇧🇷 Brasileirao', '🇺🇾 Uruguay', '🇵🇾 Paraguay', '🇨🇴 Colombia', '🇨🇱 Chile', '🇲🇽 Liga MX', '🇺🇸 MLS'],
  },
  {
    label: '⚑ Selecciones',
    items: ['Qatar 22', 'Mundial FEM', 'Mundial Sub 20', '-Elim. Conmebol', 'Copa America', 'Eurocopa', 'J. Olimpicos', 'Naciones UEFA', 'Historial Selección'],
  },
]

const teams = ['Celta de Vigo', 'Barcelona', 'Villarreal', 'Osasuna', 'Rayo Vallecano', 'Valladolid', 'Real Sociedad', 'Getafe', 'Atlético Madrid', 'Las Palmas', 'Betis', 'Girona', 'Leganés', 'Real Madrid', 'Sevilla', 'Athletic Bilbao', 'Mallorca', 'Alavés', 'Espanyol', 'Valencia']

const fixtures: Match[] = [
  { home: 'Celta de Vigo', away: 'Valencia', homeScore: '3', awayScore: '1', scorers: '23\' O. Míngueza; 28\' I. Aspas; 60\' F. Beltrán' },
  { home: 'Sevilla', away: 'Villarreal', homeScore: '1', awayScore: '2', scorers: '45\' D. Lukébakio; 2\' A. Danjuma' },
  { home: 'Osasuna', away: 'Mallorca', homeScore: '1', awayScore: '0', scorers: '55\' R. García' },
  { home: 'Barcelona', away: 'Athletic Bilbao', homeScore: '2', awayScore: '1', scorers: '24\' L. Yamal; 75\' R. Lewandowski' },
  { home: 'Espanyol', away: 'Real Sociedad', homeScore: '0', awayScore: '1', scorers: '80\' T. Kubo' },
  { home: 'Getafe', away: 'Rayo Vallecano', homeScore: '0', awayScore: '0', scorers: '' },
]

function teamInitials(name: string) {
  return name.split(' ').map((word) => word[0]).slice(0, 2).join('')
}

function StandingsTable() {
  const rows: TeamRow[] = teams.map((name, index) => ({
    position: index + 1,
    name,
    short: teamInitials(name),
    points: Math.max(0, 6 - Math.floor(index / 3)),
    played: index < 6 ? 2 : 1,
    won: index < 3 ? 2 : index < 8 ? 1 : 0,
    drawn: index % 3 === 0 ? 1 : 0,
    lost: index > 8 ? 1 : 0,
    goalsFor: 5 - (index % 4),
    goalsAgainst: 2 + (index % 4),
    difference: index < 4 ? '+3' : index % 3 === 0 ? '+1' : '0',
  }))

  return (
    <section className="standings-panel" aria-labelledby="standings-title">
      <div id="standings-title" className="panel-title">Tabla Puntos</div>
      <div className="table-scroll">
        <table className="standings-table">
          <thead>
            <tr><th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DIF</th></tr>
          </thead>
          <tbody>
            {rows.map((team) => (
              <tr key={team.name} className={team.position === 1 ? 'leader-row' : ''}>
                <td>{team.position}</td>
                <td><span className="team-badge">{team.short}</span>{team.name}</td>
                <td>{team.points}</td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.goalsFor}</td><td>{team.goalsAgainst}</td><td>{team.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="legend"><span>• Puesto de Champions League.</span><span>• Puesto de Europa League.</span><span>• Puesto de Liga de Conferencia.</span><span>• Los últimos 3 equipos descienden.</span></div>
    </section>
  )
}

function FixturesPanel() {
  const [fixtureDay, setFixtureDay] = useState(2)
  return (
    <section className="fixtures-panel" aria-labelledby="fixtures-title">
      <div className="matchday-controls">
        <button type="button" aria-label="Jornada anterior" onClick={() => setFixtureDay(Math.max(1, fixtureDay - 1))}><ChevronLeft /></button>
        <div><strong>FECHA {fixtureDay}</strong><span>La Liga</span></div>
        <button type="button" aria-label="Jornada siguiente" onClick={() => setFixtureDay(fixtureDay + 1)}><ChevronRight /></button>
      </div>
      <h2 id="fixtures-title" className="sr-only">Fixture y resultados</h2>
      <div className="fixture-date">Viernes 23 de Agosto</div>
      {fixtures.map((match, index) => (
        <div className="fixture-match" key={`${match.home}-${match.away}`}>
          <div className="fixture-teams"><span className="status">{index < 2 ? 'Final' : '—'}</span><strong>{match.home}</strong><b>{match.homeScore ?? '-'}</b><b>{match.awayScore ?? '-'}</b><strong>{match.away}</strong><button type="button" aria-label={`Agregar evento de ${match.home} y ${match.away}`}><Plus /></button></div>
          <div className="fixture-scorers">{match.scorers || 'Sin eventos cargados'}</div>
        </div>
      ))}
      <div className="fixture-date">Domingo 25 de Agosto</div>
      <div className="upcoming-row"><span>12:00</span><strong>Real Madrid</strong><span>vs</span><strong>Valladolid</strong></div>
      <div className="upcoming-row"><span>14:00</span><strong>Leganés</strong><span>vs</span><strong>Las Palmas</strong></div>
    </section>
  )
}

export function LeagueDashboard() {
  const [activeSection, setActiveSection] = useState('Liga Profesional')
  const [activeTab, setActiveTab] = useState('Fixture y Tablas')
  const [query, setQuery] = useState('')
  const leagueTabs = ['Resumen', 'Fixture y Tablas', 'Tabla de posiciones', 'Equipos y Planteles', 'Noticias', 'Estadísticas', 'Campeones Liga', 'Campeones Copas', 'Copa del Rey']

  return (
    <main className="classic-site-shell">
      <aside className="classic-sidebar">
        <div className="brand-mark">PROMIEDOS<span>.com.ar</span></div>
        <button className="login-box" type="button">●<br /><strong>Click acá para entrar/<br />registrar usuario</strong><br />en Promiedos.</button>
        <button className="home-link" type="button" onClick={() => setActiveSection('Inicio')}>⌂ <span>Inicio</span></button>
        {navigationGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <h2>{group.label}</h2>
            {group.items.map((item) => <button type="button" className={activeSection === item ? 'active' : ''} onClick={() => setActiveSection(item)} key={`${group.label}-${item}`}>{item}</button>)}
          </div>
        ))}
      </aside>

      <div className="classic-content">
        <header className="live-header" aria-label="Resultados en vivo de Premier League">
          <div className="live-league-logo" role="img" aria-label="Logo de la Premier League" />
          <div className="live-header-content">
            <div className="live-title-row"><h1>RESULTADOS EN VIVO DE PREMIER LEAGUE</h1><button type="button" className="follow-button">Seguir</button><span className="followers">98.49M</span></div>
            <nav className="live-tabs" aria-label="Secciones de Premier League">
              {['Resumen', 'Partidos', 'Posiciones', 'Noticias', 'Estadísticas', 'Pronósticos', 'Cuotas', 'Transferencia', 'Historia'].map((tab, index) => <button type="button" className={index === 0 ? 'active' : ''} key={tab}>{tab}</button>)}
            </nav>
          </div>
        </header>
        <section className="league-identity compact-identity" aria-label="Resumen de la competición">
          <div className="league-code"><span className="status-dot" /> PREMIER / EN-01 <strong>LIVE BOARD</strong></div>
          <div className="identity-stat"><small>TEMPORADA</small><b>2026 / 27</b></div>
          <div className="identity-stat"><small>JORNADA ACTUAL</small><b>02 <em>de 38</em></b></div>
          <div className="identity-stat"><small>PARTIDOS</small><b>06 <em>cargados</em></b></div>
        </section>
        <nav className="section-tabs" aria-label="Secciones de España">
          {leagueTabs.map((tab) => <button type="button" className={activeTab === tab ? 'selected' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}
        </nav>
        <div className="search-strip"><span>{activeSection} / {activeTab}</span><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar placeholder..." /></label></div>
        <div className="content-grid"><StandingsTable /><div className="right-column"><div className="round-selector">{Array.from({ length: 38 }, (_, index) => <button type="button" key={index}>{index + 1}</button>)}</div><FixturesPanel /></div></div>
      </div>
    </main>
  )
}
