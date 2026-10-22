'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, CirclePlus, Crown, LayoutDashboard, ListOrdered, MoreHorizontal, Pencil, Settings2, Shield, Trash2, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Player = { id: string; name: string; initials: string; color: string }
type Match = { id: number; home: string; away: string; homeGoals: number; awayGoals: number; date: string; round: string }

const initialPlayers: Player[] = [
  { id: 'racing', name: 'Racing Club', initials: 'RC', color: 'bg-sky-500' },
  { id: 'river', name: 'River Plate', initials: 'RP', color: 'bg-rose-500' },
  { id: 'boca', name: 'Boca Juniors', initials: 'BJ', color: 'bg-amber-500' },
  { id: 'independiente', name: 'Independiente', initials: 'IN', color: 'bg-red-500' },
  { id: 'san-lorenzo', name: 'San Lorenzo', initials: 'SL', color: 'bg-indigo-500' },
  { id: 'estudiantes', name: 'Estudiantes', initials: 'ES', color: 'bg-violet-500' },
  { id: 'newells', name: "Newell's", initials: 'N', color: 'bg-orange-500' },
]

const initialMatches: Match[] = [
  { id: 1, home: 'racing', away: 'river', homeGoals: 3, awayGoals: 1, date: 'Hoy, 22:15', round: 'Fecha 4' },
  { id: 2, home: 'boca', away: 'independiente', homeGoals: 2, awayGoals: 2, date: 'Ayer, 23:00', round: 'Fecha 4' },
  { id: 3, home: 'san-lorenzo', away: 'estudiantes', homeGoals: 1, awayGoals: 0, date: 'Ayer, 22:30', round: 'Fecha 4' },
  { id: 4, home: 'newells', away: 'racing', homeGoals: 0, awayGoals: 2, date: '12 Jun, 22:00', round: 'Fecha 3' },
]

function calculateTable(players: Player[], matches: Match[]) {
  const stats = Object.fromEntries(players.map((player) => [player.id, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }]))
  matches.forEach(({ home, away, homeGoals, awayGoals }) => {
    if (!stats[home] || !stats[away]) return
    stats[home].played += 1; stats[away].played += 1
    stats[home].gf += homeGoals; stats[home].ga += awayGoals
    stats[away].gf += awayGoals; stats[away].ga += homeGoals
    if (homeGoals > awayGoals) { stats[home].won += 1; stats[away].lost += 1; stats[home].points += 3 }
    else if (homeGoals < awayGoals) { stats[away].won += 1; stats[home].lost += 1; stats[away].points += 3 }
    else { stats[home].drawn += 1; stats[away].drawn += 1; stats[home].points += 1; stats[away].points += 1 }
  })
  return players.map((player) => ({ ...player, ...stats[player.id], gd: stats[player.id].gf - stats[player.id].ga })).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
}

export function LeagueDashboard() {
  const [players, setPlayers] = useState(initialPlayers)
  const [matches, setMatches] = useState(initialMatches)
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'players'>('overview')
  const [showForm, setShowForm] = useState(false)
  const [home, setHome] = useState('racing'); const [away, setAway] = useState('river')
  const [homeGoals, setHomeGoals] = useState(''); const [awayGoals, setAwayGoals] = useState('')
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem('pes6-league')
    if (saved) { const parsed = JSON.parse(saved); setPlayers(parsed.players ?? initialPlayers); setMatches(parsed.matches ?? initialMatches) }
  }, [])
  useEffect(() => { window.localStorage.setItem('pes6-league', JSON.stringify({ players, matches })) }, [players, matches])

  const table = useMemo(() => calculateTable(players, matches), [players, matches])
  const leader = table[0]
  const totalGoals = matches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0)
  const getPlayer = (id: string) => players.find((player) => player.id === id) ?? { name: 'Desconocido', initials: '?', color: 'bg-muted' }

  function addMatch(event: React.FormEvent) {
    event.preventDefault()
    if (home === away || homeGoals === '' || awayGoals === '') return
    setMatches([{ id: Date.now(), home, away, homeGoals: Number(homeGoals), awayGoals: Number(awayGoals), date: 'Recién cargado', round: `Fecha ${Math.ceil((matches.length + 1) / 2)}` }, ...matches])
    setHomeGoals(''); setAwayGoals(''); setShowForm(false)
  }
  function addPlayer(event: React.FormEvent) {
    event.preventDefault(); if (!playerName.trim() || players.length >= 8) return
    const id = playerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'); setPlayers([...players, { id, name: playerName.trim(), initials: playerName.trim().slice(0, 2).toUpperCase(), color: 'bg-teal-500' }]); setPlayerName('')
  }

  return (
    <div className="min-h-screen bg-[#f2f8f5] text-slate-950">
      <header className="border-b border-[#007a55]/20 bg-[#007a55] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-[#007a55]"><Trophy /></div><div><p className="text-lg font-black tracking-tight text-white">Liga Master</p><p className="text-xs font-medium text-emerald-100">PES 6 · Temporada 2026</p></div></div>
          <div className="flex items-center gap-2"><span className="hidden rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex"><span className="mr-2 size-1.5 rounded-full bg-emerald-200" />Liga en curso</span><Button variant="outline" size="sm" className="border-white/40 bg-white text-[#007a55] hover:bg-emerald-50" onClick={() => setShowForm(!showForm)}><CirclePlus data-icon="inline-start" />Cargar resultado</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#007a55]">Torneo privado</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Copa de los amigos</h1><p className="mt-2 text-sm text-slate-500">Resultados y posiciones de la liga de PES 6.</p></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1"><button onClick={() => setActiveTab('overview')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'overview' ? 'bg-[#007a55] text-white' : 'text-slate-500'}`}><LayoutDashboard className="mr-1 inline size-4" />Resumen</button><button onClick={() => setActiveTab('matches')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'matches' ? 'bg-[#007a55] text-white' : 'text-slate-500'}`}><ListOrdered className="mr-1 inline size-4" />Partidos</button><button onClick={() => setActiveTab('players')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'players' ? 'bg-[#007a55] text-white' : 'text-slate-500'}`}><Users className="mr-1 inline size-4" />Jugadores</button></div></div>
        {showForm && <form onSubmit={addMatch} className="mb-6 rounded-2xl border border-[#007a55]/20 bg-emerald-50 p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Cargar resultado</h2><p className="text-xs text-slate-500">La tabla se actualiza automáticamente.</p></div><button type="button" onClick={() => setShowForm(false)} className="text-slate-400">×</button></div><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end"><label className="text-xs font-bold text-slate-600">Local<select value={home} onChange={(e) => setHome(e.target.value)} className="mt-1 block w-full rounded-lg border-slate-200 bg-white p-2.5 text-sm">{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><input aria-label="Goles local" inputMode="numeric" value={homeGoals} onChange={(e) => setHomeGoals(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 text-center text-lg font-bold sm:w-16" placeholder="0" /><label className="text-xs font-bold text-slate-600">Visitante<select value={away} onChange={(e) => setAway(e.target.value)} className="mt-1 block w-full rounded-lg border-slate-200 bg-white p-2.5 text-sm">{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="flex items-center gap-2"><input aria-label="Goles visitante" inputMode="numeric" value={awayGoals} onChange={(e) => setAwayGoals(e.target.value)} className="w-16 rounded-lg border border-slate-200 p-2.5 text-center text-lg font-bold" placeholder="0" /><Button type="submit">Guardar</Button></div></div></form>}
        {activeTab === 'players' ? <section className="grid gap-5 md:grid-cols-[1fr_340px]"><div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-4 text-lg font-bold">Participantes <span className="text-sm font-normal text-slate-400">{players.length}/8</span></h2><div className="grid gap-3 sm:grid-cols-2">{players.map((player) => <div key={player.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-full text-xs font-black text-white ${player.color}`}>{player.initials}</span><span className="font-semibold">{player.name}</span></div><button onClick={() => setPlayers(players.filter((p) => p.id !== player.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button></div>)}</div></div><form onSubmit={addPlayer} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-1 font-bold">Sumar participante</h2><p className="mb-4 text-sm text-slate-500">Podés tener hasta 8 equipos.</p><input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nombre del equipo" className="mb-3 w-full rounded-lg border border-slate-200 p-2.5 text-sm" /><Button className="w-full" disabled={players.length >= 8}>Agregar</Button></form></section> : <><section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl bg-[#005c40] p-5 text-white"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-300">Líder actual</span><Crown className="text-amber-400" /></div><p className="text-2xl font-black">{leader?.name}</p><p className="mt-1 text-sm text-slate-400">{leader?.points} puntos · {leader?.played} partidos</p></div><StatCard label="Partidos jugados" value={matches.length.toString()} icon={<CalendarDays />} /><StatCard label="Goles convertidos" value={totalGoals.toString()} icon={<Trophy />} /><StatCard label="Participantes" value={`${players.length}/8`} icon={<Users />} /></section><div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]"><section className="rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">Tabla de posiciones</h2><p className="text-xs text-slate-500">Ordenada por puntos y diferencia de gol</p></div><button className="text-slate-400"><MoreHorizontal /></button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Pos</th><th className="px-2 py-3">Equipo</th><th className="px-2 py-3 text-center">PJ</th><th className="px-2 py-3 text-center">DG</th><th className="px-5 py-3 text-center">Pts</th></tr></thead><tbody>{table.map((team, index) => <tr key={team.id} className="border-t border-slate-100"><td className="px-5 py-3 font-bold text-slate-400">{String(index + 1).padStart(2, '0')}</td><td className="px-2 py-3"><div className="flex items-center gap-2.5"><span className={`grid size-8 place-items-center rounded-lg text-[10px] font-black text-white ${team.color}`}>{team.initials}</span><span className="whitespace-nowrap font-semibold">{team.name}</span></div></td><td className="px-2 py-3 text-center text-slate-500">{team.played}</td><td className={`px-2 py-3 text-center font-semibold ${team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-slate-400'}`}>{team.gd > 0 ? '+' : ''}{team.gd}</td><td className="px-5 py-3 text-center text-base font-black">{team.points}</td></tr>)}</tbody></table></div></section><section className="rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">Últimos resultados</h2><p className="text-xs text-slate-500">Cargados manualmente</p></div><button onClick={() => setActiveTab('matches')} className="text-xs font-bold text-[#007a55]">Ver todos</button></div><div className="flex flex-col">{matches.slice(0, 4).map((match) => <div key={match.id} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-0"><div><p className="text-xs text-slate-400">{match.round} · {match.date}</p><div className="mt-2 flex items-center gap-2 text-sm font-semibold"><span>{getPlayer(match.home).name}</span><b className="rounded bg-slate-100 px-2 py-1">{match.homeGoals} - {match.awayGoals}</b><span>{getPlayer(match.away).name}</span></div></div><Pencil className="size-4 text-slate-300" /></div>)}</div></section></div></>}
        {activeTab === 'matches' && <section className="mt-6 rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold">Todos los partidos</h2><p className="text-xs text-slate-500">Historial completo de la competencia</p></div>{matches.map((match) => <div key={match.id} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-0"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-full text-[10px] font-black text-white ${getPlayer(match.home).color}`}>{getPlayer(match.home).initials}</span><span className="text-sm font-semibold">{getPlayer(match.home).name}</span><strong className="rounded-lg bg-slate-100 px-3 py-1.5">{match.homeGoals} - {match.awayGoals}</strong><span className="text-sm font-semibold">{getPlayer(match.away).name}</span><span className={`grid size-9 place-items-center rounded-full text-[10px] font-black text-white ${getPlayer(match.away).color}`}>{getPlayer(match.away).initials}</span></div><span className="hidden text-xs text-slate-400 sm:block">{match.date}</span></div>)}</section>}
      </main>
      <footer className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-7 text-xs text-slate-400 sm:px-8"><span>Los datos se guardan solo en este navegador.</span><span className="flex items-center gap-1"><Settings2 className="size-3" /> Liga privada</span></footer>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><span className="text-[#007a55]">{icon}</span></div><p className="text-3xl font-black tracking-tight">{value}</p></div> }
