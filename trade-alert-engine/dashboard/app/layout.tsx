import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reymen Trade Intelligence',
  description: 'Trade thesis monitoring & alert engine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <span className="nav-brand">Reymen · Trade Intelligence</span>
          <div className="nav-links">
            <a href="/" className="nav-link">Dashboard</a>
            <a href="/setups" className="nav-link">Setups</a>
            <a href="/setups/new" className="nav-link nav-link-cta">+ New Setup</a>
            <a href="/alerts" className="nav-link">Alerts</a>
            <a href="/settings" className="nav-link">Settings</a>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          ⚠️ Educational use only. Not financial advice. This system does not place trades.
        </footer>
      </body>
    </html>
  )
}
