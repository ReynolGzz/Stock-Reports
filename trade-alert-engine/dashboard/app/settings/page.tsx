'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function SettingsPage() {
  const [chatId, setChatId] = useState('')
  const [saved, setSaved] = useState(false)
  const [channels, setChannels] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.settings.getChannels().then(setChannels).catch(() => {})
  }, [])

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.settings.saveTelegram(chatId)
      setSaved(true)
      setChatId('')
      const updated = await api.settings.getChannels()
      setChannels(updated)
      setTimeout(() => setSaved(false), 3000)
    } finally { setLoading(false) }
  }

  const telegram = channels.find((c) => c.type === 'telegram')

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="text-muted">Configure notification channels and alert preferences</p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Telegram Alerts</h2>
        <p className="text-muted" style={{ marginBottom: '1.25rem', fontSize: '0.875rem' }}>Configure your Telegram Bot to receive alerts when trade conditions are met.</p>
        {telegram && (
          <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.15)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            <div className="row" style={{ gap: '0.5rem' }}>
              <span style={{ color: 'var(--green)' }}>✓</span>
              <span>Telegram configured — Chat ID: <code className="text-mono">{(telegram.config as any)?.chatId}</code></span>
            </div>
          </div>
        )}
        <form onSubmit={handleSaveTelegram}>
          <div className="form-group">
            <label className="form-label">Telegram Chat ID</label>
            <input className="form-input" value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="e.g. 123456789 or @channelname" required />
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Get your Chat ID by messaging @userinfobot on Telegram</div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save Telegram Config'}</button>
        </form>
      </div>
      <div className="card">
        <h2 style={{ marginBottom: '0.75rem' }}>API Configuration</h2>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Configure these in your server's <code className="text-mono">.env</code> file.</p>
        <div className="stack-sm">
          {[
            { key: 'ANTHROPIC_API_KEY', desc: 'Required — Claude API for report extraction' },
            { key: 'POLYGON_API_KEY', desc: 'Recommended — Primary market data provider' },
            { key: 'FINNHUB_API_KEY', desc: 'Optional — Fallback market data provider' },
            { key: 'TELEGRAM_BOT_TOKEN', desc: 'Required for Telegram alerts' },
            { key: 'DATABASE_URL', desc: 'Required — PostgreSQL connection string' },
          ].map((item) => (
            <div key={item.key} className="card-sm row" style={{ gap: '0.75rem' }}>
              <code className="text-mono text-green" style={{ fontSize: '0.8rem', minWidth: '200px' }}>{item.key}</code>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
