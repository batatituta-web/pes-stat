'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

type Match = { home: string; away: string; homeScore?: string; awayScore?: string; scorers?: string }

const navigationGroups = [
  { label: 'Destacado', items: ['Liga Profesional', 'Prim. B Nacional', 'Libertadores', 'Sudamericana', 'Copa Argentina', 'Champions', 'Elim. Conmebol', 'Ranking Títulos', 'Ranking Copas Int'] },
  { label: '🇦🇷 Argentina', items: ['Liga Profesional', 'Copa de la Liga', '-Historiales', '-Tabla Historica', 'Copa Argentina', 'Copas Nacionales', 'Ranking Títulos', 'Prim. B Nacional', 'B Metro', 'Federal A', 'Primera C', 'Prom. Amateur', 'Reserva', 'Femenino'] },
  { label: '🏆 Copas Int.', items: ['Ranking Copas Int', 'Mundial Clubes', 'Libertadores', 'Sudamericana', '+Copas Conmebol', 'Champions', 'Europa League', 'Conference', '+Copas UEFA', 'Copas AFC', 'Copas CAF', 'Copas OFC'] },
  { label: '🌐 Ligas', items: ['🇬🇧 Premier League', '🇪🇸 La Liga', '🇮🇹 Serie A', '🇩🇪 Bundesliga', '🇫🇷 Ligue 1', '🇳🇱 Eredivisie', '🇧🇷 Brasileirao', '🇺🇾 Uruguay', '🇵🇾 Paraguay', '🇨🇴 Colombia', '🇨🇱 Chile', '🇲🇽 Liga MX', '🇺🇸 MLS'] },
  { label: '⚑ Selecciones', items: ['Qatar 22', 'Mundial FEM', 'Mundial Sub 20', '-Elim. Conmebol', 'Copa America', 'Eurocopa', 'J. Olimpicos', 'Naciones UEFA', 'Historial Selección'] },
]

const teams = ['Manchester City', 'Brighton And Hove', 'Arsenal FC', 'Liverpool', 'Tottenham', 'Newcastle', 'Nottingham Forest', 'Chelsea']
const fixtures: Match[] = [
  { home: 'Manchester City', away: 'Brighton And Hove', homeScore: '2', awayScore: '1', scorers: "32' Haaland; 70' Foden; 60' Pedro" },
  { home: 'Arsenal FC', away: 'Liverpool', homeScore: '1', awayScore: '1', scorers: "18' Saka; 64' Salah" },
  { home: 'Tottenham', away: 'Newcastle', homeScore: '3', awayScore: '2', scorers: "14' Son; 51' Gordon; 77' Maddison" },
  { home: 'Nottingham Forest', away: 'Chelsea', homeScore: '0', awayScore: '2', scorers: "42' Palmer; 81' Jackson" },
]

const scorers = [['E. Haaland (Manchester City)', '4', '(1)'], ['N. Madueke (Chelsea)', '3', '(0)'], ['D. Welbeck (Brighton And Hove)', '2', '(0)'], ['M. Salah (Liverpool)', '2', '(0)'], ['S. Heung Min (Tottenham)', '2', '(0)']]
const assists = [['C. Palmer (Chelsea)', '3'], ['J. Maddison (Tottenham)', '2'], ['B. Saka (Arsenal FC)', '2']]

function ClubBadge({ name }: { name: string }) { return <span className="club-badge" aria-hidden="true">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span> }

function StandingsTable() {
  return <section className="standings-panel"><div className="panel-title">Tabla Puntos</div><table className="standings-table"><thead><tr><th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DIF</th></tr></thead><tbody>{teams.map((team, index) => <tr className={index === 0 ? 'leader-row' : ''} key={team}><td>{index + 1}</td><td><ClubBadge name={team} />{team}</td><td>{Math.max(0, 6 - Math.floor(index / 3))}</td><td>2</td><td>{index < 3 ? 2 : index < 8 ? 1 : 0}</td><td>{index % 3 === 0 ? 0 : 1}</td><td>{index > 8 ? 1 : 0}</td><td>{5 - (index % 4)}</td><td>{index % 4}</td><td>{index < 4 ? '+3' : index % 3 === 0 ? '+1' : '0'}</td></tr>)}</tbody></table><div className="table-legend"><span>• Puesto de Champions League.</span><span>• Puesto de Europa League.</span><span>• Puesto de Conference League.</span><span>• Los últimos 3 equipos descienden.</span></div></section>
}

function FixturesPanel() {
  const [day, setDay] = useState(2)
  return <section className="fixtures-panel"><div className="round-picker">{Array.from({ length: 7 }, (_, index) => <button type="button" key={index}>{index + 1}</button>)}</div><div className="matchday-controls"><button type="button" aria-label="Fecha anterior" onClick={() => setDay(Math.max(1, day - 1))}><ChevronLeft /></button><div><b>FECHA {day}</b><strong>Premier League</strong></div><button type="button" aria-label="Fecha siguiente" onClick={() => setDay(day + 1)}><ChevronRight /></button></div><div className="fixture-date">Sábado 24 de Agosto</div>{fixtures.map((match) => <div className="fixture-match" key={`${match.home}-${match.away}`}><div className="fixture-teams"><span className="status">Final</span><strong><ClubBadge name={match.home} />{match.home}</strong><b>{match.homeScore}</b><b>{match.awayScore}</b><strong>{match.away}<ClubBadge name={match.away} /></strong><button type="button" aria-label={`Añadir evento ${match.home}`}><Plus /></button></div><div className="fixture-scorers">{match.scorers}</div></div>)}<div className="stats-footer"><b>Estadísticas Fecha:</b><br />32 goles en 10 partidos (3.20 de media)<br />Vig. locales: 17 · Goles visitantes: 15</div></section>
}

function RankingTables() { return <div className="ranking-grid"><section className="ranking-card"><div className="panel-title">Goleadores</div><table><thead><tr><th>Jugador</th><th>Goles</th><th>(Penal)</th></tr></thead><tbody>{scorers.map(([name, goals, penalty]) => <tr key={name}><td><ClubBadge name={name} />{name}</td><td>{goals}</td><td>{penalty}</td></tr>)}</tbody></table></section><section className="ranking-card"><div className="panel-title">Asistencias</div><table><thead><tr><th>Jugador</th><th>Asist.</th></tr></thead><tbody>{assists.map(([name, total]) => <tr key={name}><td><ClubBadge name={name} />{name}</td><td>{total}</td></tr>)}</tbody></table></section></div> }

export function LeagueDashboard() {
  const [activeSection, setActiveSection] = useState('🇬🇧 Premier League')
  const [activeTab, setActiveTab] = useState('Fixture y Tablas')
  const tabs = ['Fixture y Tablas', 'Equipos y Planteles', 'Campeones Liga', 'Campeones Copas', 'FA. CUP']
  return <main className="classic-site-shell"><aside className="classic-sidebar"><div className="brand-mark">PROMIEDOS<span>.com.ar</span></div><button className="login-box" type="button">●<br /><strong>Login/Registros<br />momentáneamente<br />desactivado, pronto<br />volverá.</strong></button><button className="home-link" type="button" onClick={() => setActiveSection('Inicio')}>⌂ Inicio</button>{navigationGroups.map((group) => <div className="nav-group" key={group.label}><h2>{group.label}</h2>{group.items.map((item) => <button type="button" key={item} className={activeSection === item ? 'active' : ''} onClick={() => setActiveSection(item)}>{item}</button>)}</div>)}<div className="sidebar-footer"><button>♣ Comunidad</button><button>▣ Promiedos</button><button>▣ Calendario</button><p>Contacto</p><small>Legal - Privacidad</small><small>Promiedos 2009-2024</small></div></aside><div className="classic-content"><div className="classic-brand-banner">PROMIEDOS<span>.com.ar</span></div><header className="country-header">🏴 PREMIER LEAGUE 🏴</header><nav className="section-tabs">{tabs.map((tab) => <button type="button" className={activeTab === tab ? 'selected' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</nav><div className="content-grid"><StandingsTable /><FixturesPanel /></div><RankingTables /><div className="timezone">Horarios: Argentina/UY/Br <small>(cambiar en inicio)</small></div></div></main>
}
