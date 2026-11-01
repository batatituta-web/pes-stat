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
  { home: 'Brighton And Hove', away: 'Manchester United', homeScore: '2', awayScore: '1', scorers: "32' D. Welbeck; 90(+5)' J. Pedro; 60' A. Traoré" },
  { home: 'Crystal Palace', away: 'West Ham', homeScore: '0', awayScore: '2', scorers: "67' T. Soucek; 72' J. Bowen" },
  { home: 'Fulham', away: 'Leicester City', homeScore: '2', awayScore: '1', scorers: "18' E. Smith-Rowe; 70' A. Iwobi; 38' W. Faes" },
  { home: 'Manchester City', away: 'Ipswich Town', homeScore: '4', awayScore: '1', scorers: "12' E. Haaland; 14' K. De Bruyne; 16' E. Haaland; 88' E. Haaland" },
  { home: 'Southampton', away: 'Nottingham Forest', homeScore: '0', awayScore: '1', scorers: "72' C. Gibbs-White" },
  { home: 'Tottenham', away: 'Everton', homeScore: '4', awayScore: '0', scorers: "14' Y. Bissouma; 25' S. Heung-Min" },
  { home: 'Aston Villa', away: 'Arsenal FC', homeScore: '0', awayScore: '2', scorers: "67' L. Trossard; 77' T. Partey" },
  { home: 'Liverpool', away: 'Brentford', homeScore: '2', awayScore: '0', scorers: "13' L. Díaz; 70' M. Salah" },
]

const scorers = [['E. Haaland (Manchester City)', '4', '(1)'], ['N. Madueke (Chelsea)', '3', '(0)'], ['D. Welbeck (Brighton And Hove)', '2', '(0)'], ['M. Salah (Liverpool)', '2', '(0)'], ['S. Heung Min (Tottenham)', '2', '(0)']]
const assists = [['C. Palmer (Chelsea)', '3'], ['J. Maddison (Tottenham)', '2'], ['B. Saka (Arsenal FC)', '2']]

function ClubBadge({ name }: { name: string }) { return <span className="club-badge" aria-hidden="true">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span> }

function StandingsTable() {
  return <section className="standings-panel"><div className="panel-title">Tabla Puntos</div><table className="standings-table"><thead><tr><th>#</th><th>Equipo</th><th>Pts</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DIF</th></tr></thead><tbody>{teams.map((team, index) => <tr className={index === 0 ? 'leader-row' : ''} key={team}><td>{index + 1}</td><td><ClubBadge name={team} />{team}</td><td>{Math.max(0, 6 - Math.floor(index / 3))}</td><td>2</td><td>{index < 3 ? 2 : index < 8 ? 1 : 0}</td><td>{index % 3 === 0 ? 0 : 1}</td><td>{index > 8 ? 1 : 0}</td><td>{5 - (index % 4)}</td><td>{index % 4}</td><td>{index < 4 ? '+3' : index % 3 === 0 ? '+1' : '0'}</td></tr>)}</tbody></table><div className="table-legend"><span>• Puesto de Champions League.</span><span>• Puesto de Europa League.</span><span>• Puesto de Conference League.</span><span>• Los últimos 3 equipos descienden.</span></div></section>
}

function FixturesPanel() {
  const [day, setDay] = useState(2)
  return <section className="fixtures-panel"><div className="round-picker">{Array.from({ length: 38 }, (_, index) => <button type="button" key={index}>{index + 1}</button>)}</div><div className="matchday-controls"><button type="button" aria-label="Fecha anterior" onClick={() => setDay(Math.max(1, day - 1))}><ChevronLeft /></button><div><b>FECHA {day}</b><strong>Premier League</strong></div><button type="button" aria-label="Fecha siguiente" onClick={() => setDay(day + 1)}><ChevronRight /></button></div><div className="fixture-date">Sábado 24 de Agosto</div>{fixtures.map((match) => <div className="fixture-match" key={`${match.home}-${match.away}`}><div className="fixture-teams"><span className="status">Final</span><strong><ClubBadge name={match.home} />{match.home}</strong><b>{match.homeScore}</b><b>{match.awayScore}</b><strong>{match.away}<ClubBadge name={match.away} /></strong><button type="button" aria-label={`Añadir evento ${match.home}`}><Plus /></button></div><div className="fixture-scorers">{match.scorers}</div></div>)}<div className="fixture-date">Domingo 25 de Agosto</div><div className="fixture-match"><div className="fixture-teams"><span className="status">Final</span><strong><ClubBadge name="Bournemouth" />Bournemouth</strong><b>1</b><b>1</b><strong>Newcastle<ClubBadge name="Newcastle" /></strong><button type="button" aria-label="Añadir evento Bournemouth Newcastle"><Plus /></button></div></div><div className="stats-footer"><b>Estadísticas Fecha:</b><br />32 goles en 10 partidos (3.20 de media)<br />Vig. locales: 17 · Goles visitantes: 15</div></section>
}

function RankingTables() { return <div className="ranking-grid"><section className="ranking-card"><div className="panel-title">Goleadores</div><table><thead><tr><th>Jugador</th><th>Goles</th><th>(Penal)</th></tr></thead><tbody>{scorers.map(([name, goals, penalty]) => <tr key={name}><td><ClubBadge name={name} />{name}</td><td>{goals}</td><td>{penalty}</td></tr>)}</tbody></table></section><section className="ranking-card"><div className="panel-title">Asistencias</div><table><thead><tr><th>Jugador</th><th>Asist.</th></tr></thead><tbody>{assists.map(([name, total]) => <tr key={name}><td><ClubBadge name={name} />{name}</td><td>{total}</td></tr>)}</tbody></table></section></div> }

export function LeagueDashboard() {
  const [activeSection, setActiveSection] = useState('🇬🇧 Premier League')
  const [activeTab, setActiveTab] = useState('Fixture y Tablas')
  const tabs = ['Fixture y Tablas', 'Equipos y Planteles', 'Campeones Liga', 'Campeones Copas', 'FA. CUP']
  return <main className="classic-site-shell"><aside className="classic-sidebar"><div className="brand-mark">PROMIEDOS<span>.com.ar</span></div><button className="login-box" type="button">●<br /><strong>Login/Registros<br />momentáneamente<br />desactivado, pronto<br />volverá.</strong></button><button className="home-link" type="button" onClick={() => setActiveSection('Inicio')}>⌂ Inicio</button>{navigationGroups.map((group) => <div className="nav-group" key={group.label}><h2>{group.label}</h2>{group.items.map((item) => <button type="button" key={item} className={activeSection === item ? 'active' : ''} onClick={() => setActiveSection(item)}>{item}</button>)}</div>)}<div className="sidebar-footer"><button>♣ Comunidad</button><button>▣ Promiedos</button><button>▣ Calendario</button><p>Contacto</p><small>Legal - Privacidad</small><small>Promiedos 2009-2024</small></div></aside><div className="classic-content"><div className="classic-brand-banner">PROMIEDOS<span>.com.ar</span></div><header className="country-header">🏴 PREMIER LEAGUE 🏴</header><nav className="section-tabs">{tabs.map((tab) => <button type="button" className={activeTab === tab ? 'selected' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</nav><div className="content-grid"><StandingsTable /><FixturesPanel /></div><RankingTables /><div className="timezone">Horarios: Argentina/UY/Br <small>(cambiar en inicio)</small></div></div></main>
}
