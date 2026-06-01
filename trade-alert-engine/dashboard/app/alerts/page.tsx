'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '../../lib/api'

const EVENT_CLASSES: Record<string, string> = {
  entry_triggered: 'alert-entry',
  avoid_triggered: 'alert-avoid',
  target_1_reached: 'alert-target',
  target_2_reached: 'alert-target',
  stop_hit: 'alert-stop',
}

export default function AlertsPage() {
  const [data, setData] = useState<any>({ alerts: [], total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.alerts.list(page).then(setData).finally(() => setLoading(false))
  }, [page])

  if (loading) return <div className="text-muted">Loading...</div>

  const totalPages = Math.ceil(data.total / 20)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Alert History</h1>
          <p className="text-muted">{data.total} total alerts</p>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>Event</th><th>Ticker</th><th>Strategy</th><th>Explanation</th><th>Channel</th><th>Status</th><th>Fired At</th></tr>
          </thead>
          <tbody>
            {data.alerts.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>No alerts fired yet</td></tr>
            ) : data.alerts.map((a: any) => (
              <tr key={a.id}>
                <td><span className={`alert-event-badge ${EVENT_CLASSES[a.event] ?? ''}`}>{a.event.replace(/_/g, ' ')}</span></td>
                <td><Link href={`/setups/${a.setupId}`} className="text-mono" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>{a.setup?.ticker}</Link></td>
                <td className="text-muted">{a.setup?.strategyType?.replace(/_/g, ' ')}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted)', fontSize: '0.8rem' }}>{a.explanation?.split('\n')[0]}</td>
                <td className="text-muted">{a.channel}</td>
                <td><span className={`badge ${a.status === 'sent' ? 'badge-active' : a.status === 'suppressed' ? 'badge-cancelled' : 'badge-stopped'}`}>{a.status}</span></td>
                <td className="text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(a.sentAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="row" style={{ marginTop: '1rem', justifyContent: 'center', gap: '0.5rem' }}>
          <button className="btn btn-ghost" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Prev</button>
          <span className="text-muted">Page {page} of {totalPages}</span>
          <button className="btn btn-ghost" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  )
}
