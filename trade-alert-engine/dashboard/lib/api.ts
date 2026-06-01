const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? `API error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  setups: {
    list: () => apiFetch<any[]>('/setups'),
    get: (id: string) => apiFetch<any>(`/setups/${id}`),
    ingest: (body: { url?: string; text?: string }) =>
      apiFetch('/setups/ingest', { method: 'POST', body: JSON.stringify(body) }),
    check: (id: string) => apiFetch(`/setups/${id}/check`, { method: 'POST' }),
    setStatus: (id: string, status: string) =>
      apiFetch(`/setups/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  },
  alerts: {
    list: (page = 1) => apiFetch<any>(`/alerts?page=${page}`),
    forSetup: (setupId: string) => apiFetch<any[]>(`/alerts/${setupId}`),
  },
  market: {
    quote: (ticker: string) => apiFetch<any>(`/market/${ticker}`),
  },
  settings: {
    saveTelegram: (chatId: string) =>
      apiFetch('/settings/telegram', { method: 'POST', body: JSON.stringify({ chatId }) }),
    getChannels: () => apiFetch<any[]>('/settings/channels'),
  },
}
