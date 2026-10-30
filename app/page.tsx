import Link from 'next/link'

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">El Pes6omegusta</p>
            <h1 className="mt-3 text-balance text-3xl font-black tracking-tight sm:text-5xl">Próxima competencia</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">La tabla aparecerá cuando comience el torneo.</p>
          </div>
          <Link href="/dashboard" className="shrink-0 rounded-lg border border-primary/40 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
            Ver dashboard
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" aria-labelledby="empty-table-title">
          <div className="border-b border-border px-5 py-4">
            <h2 id="empty-table-title" className="text-lg font-bold">Tabla de posiciones</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sin equipos registrados</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">#</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Equipo</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Pts</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">PJ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-muted-foreground">La tabla está vacía por ahora.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

