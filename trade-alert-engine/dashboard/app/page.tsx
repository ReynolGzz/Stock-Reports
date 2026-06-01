'use client'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Link from 'next/link'

function statusBadge(status: string) {
  return <span className={`badge badge-${status}`}>{status}</span>
}

function alertEventBadge(event: string) {
  const map: Record<string, string> = {
    entry_triggered: 'alert-entry',
    avoid_triggered: 'alert-avoid',
    target_1_reached: 'alert-target',
    target_2_reached: 'alert-target',
    stop_hit: 'alert-stop',
  }
  return <span className={`alert-event-badge ${map[event] ?? ''}`}>{event.replace(/_/g, ' ')}</span>
}

export default function DashboardPage() {
  const [setups, setSetups] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.setups.list(), api.alerts.list(1)])
      .then(([s, a]) => { setSetups(s); setAlerts(a.alerts ?? []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-muted">Loading...</div>

  const active = setups.filter((s) => s.status === 'active').length
  const triggered = setups.filter((s) => s.status === 'triggered').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Reymen Trade Intelligence — Phase 1</p>
        </div>
        <Link href="/setups/new" className="btn btn-primary">+ Ingest Report</Link>
      </div>
      <div className="kpi-strip">
        <div className="kpi-card"><div className="kpi-label">Total Setups</div><div className="kpi-value">{setups.length}</div></div>
        <div className="kpi-card"><div className="kpi-label">Active</div><div className="kpi-value text-green">{active}</div></div>
        <div className="kpi-card"><div className="kpi-label">Triggered</div><div className="kpi-value text-amber">{triggered}</div></div>
        <div className="kpi-card"><div className="kpi-label">Total Alerts</div><div className="kpi-value">{alerts.length}</div></div>
      </div>
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <div className="row" style={{ marginBottom: '1rem' }}>
            <h2>Active Setups</h2>
            <div className="spacer" />
            <Link href="/setups" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}>View all</Link>
          </div>
          {setups.filter((s) => ['active', 'triggered'].includes(s.status)).length === 0 ? (
            <p className="text-muted">No active setups. <Link href="/setups/new" style={{ color: 'var(--green)' }}>Ingest a report</Link> to get started.</p>
          ) : (
            <div className="stack-sm">
              {setups.filter((s) => ['active', 'triggered'].includes(s.status)).slice(0, 8).map((s) => (
                <Link key={s.id} href={`/setups/${s.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card-sm row" style={{ cursor: 'pointer' }}>
                    <div>
                      <div className="row" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="text-mono" style={{ fontWeight: 600 }}>{s.ticker}</span>
                        {statusBadge(s.status)}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {s.strategyType.replace(/_/g, ' ')} · {s._count?.alerts ?? 0} alerts
                      </div>
                    </div>
                    <div className="spacer" />
                    {s.entryZoneMin && s.entryZoneMax && (
                      <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                        <div className="text-muted">Zone</div>
                        <div className="text-mono">${s.entryZoneMin}–${s.entryZoneMax}</div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="row" style={{ marginBottom: '1rem' }}>
            <h2>Recent Alerts</h2>
            <div className="spacer" />
            <Link href="/alerts" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.375rem 0.75rem' }}>View all</Link>
          </div>
          {alerts.length === 0 ? (
            <p className="text-muted">No alerts yet. Alerts fire when setup conditions are met.</p>
          ) : (
            <div>
              {alerts.slice(0, 10).map((a) => (
                <div key={a.id} className="alert-item">
                  {alertEventBadge(a.event)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: '0.5rem' }}>
                      <span className="text-mono" style={{ fontWeight: 600 }}>{a.setup?.ticker}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(a.sentAt).toLocaleString()}</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.explanation?.split('\n')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
