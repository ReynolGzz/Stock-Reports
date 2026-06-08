'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '../../../lib/api'

function conditionIcon(met: boolean, required: boolean) {
  if (met) return '✅'
  if (required) return '⏳'
  return '○'
}

function alertEventLabel(event: string) {
  const map: Record<string, { label: string; cls: string }> = {
    entry_triggered: { label: 'Entry', cls: 'alert-entry' },
    avoid_triggered: { label: 'Avoid', cls: 'alert-avoid' },
    target_1_reached: { label: 'Target 1', cls: 'alert-target' },
    target_2_reached: { label: 'Target 2', cls: 'alert-target' },
    stop_hit: { label: 'Stop Hit', cls: 'alert-stop' },
  }
  const m = map[event] ?? { label: event, cls: '' }
  return <span className={`alert-event-badge ${m.cls}`}>{m.label}</span>
}

export default function SetupDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [setup, setSetup] = useState<any>(null)
  const [checkResult, setCheckResult] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.setups.get(id).then(setSetup).finally(() => setLoading(false))
  }, [id])

  const handleCheck = async () => {
    setChecking(true)
    setCheckResult(null)
    try {
      const result = await api.setups.check(id)
      setCheckResult(result)
      const updated = await api.setups.get(id)
      setSetup(updated)
    } catch (err) {
      setCheckResult({ error: (err as Error).message })
    } finally { setChecking(false) }
  }

  const handleCancel = async () => {
    await api.setups.setStatus(id, 'cancelled')
    router.push('/setups')
  }

  if (loading) return <div className="text-muted">Loading...</div>
  if (!setup) return <div className="text-muted">Setup not found</div>

  const snap = setup.snapshots?.[0]
  const currentPrice = snap?.price
  const inZone = currentPrice && setup.entryZoneMin && setup.entryZoneMax
    ? currentPrice >= setup.entryZoneMin && currentPrice <= setup.entryZoneMax : false

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="row" style={{ gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 className="text-mono">{setup.ticker}</h1>
            <span className={`badge badge-${setup.status}`}>{setup.status}</span>
          </div>
          <p className="text-muted">{setup.strategyType.replace(/_/g, ' ')} · {setup.bias} bias{setup.companyName ? ` · ${setup.companyName}` : ''}</p>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          {setup.status === 'active' && (
            <>
              <button className="btn btn-primary" onClick={handleCheck} disabled={checking}>{checking ? 'Checking...' : '⟳ Check Now'}</button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </div>
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        <div className="stack">
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Price Levels</h3>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              {currentPrice && <div className="card-sm"><div className="kpi-label">Current Price</div><div className={`kpi-value ${inZone ? 'text-green' : 'text-amber'}`}>${currentPrice?.toFixed(2)}</div></div>}
              {setup.entryZoneMin && setup.entryZoneMax && <div className="card-sm"><div className="kpi-label">Entry Zone</div><div className="kpi-value text-mono" style={{ fontSize: '1rem' }}>${setup.entryZoneMin}–${setup.entryZoneMax}</div></div>}
              {setup.stopLoss && <div className="card-sm"><div className="kpi-label">Stop Loss</div><div className="kpi-value text-red">${setup.stopLoss}</div></div>}
              {setup.target1 && <div className="card-sm"><div className="kpi-label">Target 1</div><div className="kpi-value text-green">${setup.target1}</div></div>}
              {setup.target2 && <div className="card-sm"><div className="kpi-label">Target 2</div><div className="kpi-value text-green">${setup.target2}</div></div>}
              {setup.maxChasePrice && <div className="card-sm"><div className="kpi-label">Max Chase</div><div className="kpi-value text-amber">${setup.maxChasePrice}</div></div>}
            </div>
            {setup.lastCheckedAt && <div className="text-muted" style={{ marginTop: '1rem', fontSize: '0.75rem' }}>Last checked: {new Date(setup.lastCheckedAt).toLocaleString()}</div>}
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Entry Conditions</h3>
            {setup.conditions.length === 0 ? <p className="text-muted">No conditions defined</p> : (
              <div className="condition-list">
                {setup.conditions.map((c: any) => (
                  <div key={c.id} className={`condition-item ${c.met ? 'condition-met' : 'condition-pending'}`}>
                    <span>{conditionIcon(c.met, c.required)}</span>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                        {c.type.replace(/_/g, ' ')}
                        {!c.required && <span className="text-muted" style={{ marginLeft: '0.4rem' }}>(optional)</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{c.description}</div>
                      {c.metReason && <div style={{ fontSize: '0.75rem', color: 'var(--green)', marginTop: '0.2rem' }}>{c.metReason}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {setup.avoidConditions.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Avoid Conditions</h3>
              <div className="condition-list">
                {setup.avoidConditions.map((a: any) => (
                  <div key={a.id} className={`condition-item ${a.active ? 'condition-met' : 'condition-pending'}`} style={{ borderLeft: a.active ? '3px solid var(--red)' : '3px solid transparent' }}>
                    <span>{a.active ? '🚫' : '○'}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{a.type.replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{a.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="stack">
          {checkResult && (
            <div className="card" style={{ borderColor: checkResult.error ? 'rgba(255,71,87,0.3)' : 'rgba(0,229,160,0.2)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Check Result</h3>
              {checkResult.error ? <p className="text-red">{checkResult.error}</p> : (
                <div>
                  <div className="row" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="kpi-card" style={{ flex: 1, minWidth: 0 }}><div className="kpi-label">Price</div><div className="kpi-value" style={{ fontSize: '1.25rem' }}>${checkResult.price?.toFixed(2)}</div></div>
                    <div className="kpi-card" style={{ flex: 1, minWidth: 0 }}><div className="kpi-label">Alert</div><div className={`kpi-value ${checkResult.result?.shouldAlert ? 'text-green' : 'text-muted'}`} style={{ fontSize: '1rem' }}>{checkResult.result?.shouldAlert ? 'YES' : 'NO'}</div></div>
                  </div>
                  <pre style={{ fontSize: '0.75rem', color: 'var(--muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{checkResult.result?.explanation}</pre>
                </div>
              )}
            </div>
          )}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Alert History ({setup.alerts?.length ?? 0})</h3>
            {setup.alerts?.length === 0 ? <p className="text-muted">No alerts fired yet</p> : (
              <div>
                {setup.alerts?.map((a: any) => (
                  <div key={a.id} className="alert-item">
                    {alertEventLabel(a.event)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(a.sentAt).toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.explanation?.split('\n')[0]}</div>
                    </div>
                    <span className={`badge ${a.status === 'sent' ? 'badge-active' : a.status === 'suppressed' ? 'badge-cancelled' : 'badge-stopped'}`} style={{ fontSize: '0.65rem' }}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
