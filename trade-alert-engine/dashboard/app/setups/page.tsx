'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '../../lib/api'

export default function SetupsPage() {
  const [setups, setSetups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.setups.list().then(setSetups).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? setups : setups.filter((s) => s.status === filter)

  const handleCancel = async (id: string) => {
    await api.setups.setStatus(id, 'cancelled')
    setSetups((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)))
  }

  if (loading) return <div className="text-muted">Loading...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Trade Setups</h1>
          <p className="text-muted">{setups.length} total setup{setups.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/setups/new" className="btn btn-primary">+ Ingest Report</Link>
      </div>
      <div className="row" style={{ marginBottom: '1rem', gap: '0.5rem' }}>
        {['all', 'active', 'triggered', 'stopped', 'completed', 'cancelled'].map((f) => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' ? ` (${setups.length})` : ` (${setups.filter((s) => s.status === f).length})`}
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Ticker</th><th>Strategy</th><th>Bias</th><th>Entry Zone</th>
              <th>Stop</th><th>Target 1</th><th>Status</th><th>Last Checked</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
                No setups found. <Link href="/setups/new" style={{ color: 'var(--green)' }}>Ingest a report</Link> to get started.
              </td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id}>
                <td><Link href={`/setups/${s.id}`} style={{ color: 'var(--green)', textDecoration: 'none', fontFamily: 'var(--mono)', fontWeight: 600 }}>{s.ticker}</Link></td>
                <td className="text-muted">{s.strategyType.replace(/_/g, ' ')}</td>
                <td className={s.bias === 'bullish' ? 'text-green' : s.bias === 'bearish' ? 'text-red' : 'text-muted'}>{s.bias}</td>
                <td className="text-mono" style={{ fontSize: '0.8rem' }}>{s.entryZoneMin && s.entryZoneMax ? `$${s.entryZoneMin}–$${s.entryZoneMax}` : '—'}</td>
                <td className="text-mono text-red" style={{ fontSize: '0.8rem' }}>{s.stopLoss ? `$${s.stopLoss}` : '—'}</td>
                <td className="text-mono text-green" style={{ fontSize: '0.8rem' }}>{s.target1 ? `$${s.target1}` : '—'}</td>
                <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                <td className="text-muted" style={{ fontSize: '0.75rem' }}>{s.lastCheckedAt ? new Date(s.lastCheckedAt).toLocaleString() : 'Never'}</td>
                <td>
                  <div className="row" style={{ gap: '0.375rem' }}>
                    <Link href={`/setups/${s.id}`} className="btn btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>View</Link>
                    {s.status === 'active' && <button className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleCancel(s.id)}>Cancel</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
