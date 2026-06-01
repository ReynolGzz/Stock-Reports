'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../../lib/api'

type InputMode = 'url' | 'text'

export default function NewSetupPage() {
  const router = useRouter()
  const [mode, setMode] = useState<InputMode>('text')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.setups.ingest(mode === 'url' ? { url } : { text })
      router.push(`/setups/${result.setupId}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <h1>Ingest Report</h1>
          <p className="text-muted">Paste a report URL or raw text — Claude will extract the trade thesis</p>
        </div>
      </div>
      <div className="card">
        <div className="row" style={{ marginBottom: '1.5rem', gap: '0.5rem' }}>
          <button className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('text')} type="button">Paste Text</button>
          <button className={`btn ${mode === 'url' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('url')} type="button">URL</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'url' ? (
            <div className="form-group">
              <label className="form-label">Report URL</label>
              <input className="form-input" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/reports/2026-06-01.html" required />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Report Text</label>
              <textarea className="form-input form-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the full report text or HTML here..." required style={{ minHeight: '300px' }} />
            </div>
          )}
          {error && <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem', color: 'var(--red)', fontSize: '0.875rem' }}>{error}</div>}
          <div className="row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Extracting thesis...' : 'Extract & Monitor'}
            </button>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Claude will extract the structured trade thesis and begin monitoring</p>
          </div>
        </form>
      </div>
    </div>
  )
}
