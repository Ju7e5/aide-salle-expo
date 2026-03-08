'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginClient() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F5F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 44px',
          width: 380,
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid #E4E0DA',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: '#B5763A',
              borderRadius: 8,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
              padding: 5,
            }}
          >
            <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 1 }} />
            <span style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              color: '#18181B',
              fontWeight: 600,
            }}
          >
            ExpoCarrelage
          </span>
        </div>

        <p
          style={{
            fontSize: 11,
            color: '#71717A',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 32,
          }}
        >
          Espace de gestion interne
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#18181B', marginBottom: 6 }}
          >
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe"
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              border: error ? '1.5px solid #B83232' : '1.5px solid #E4E0DA',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              background: '#fff',
              color: '#18181B',
              outline: 'none',
              marginBottom: 8,
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = '#B5763A'
            }}
            onBlur={(e) => {
              if (!error) e.target.style.borderColor = '#E4E0DA'
            }}
          />

          {error && (
            <p style={{ fontSize: 12, color: '#B83232', marginBottom: 8 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '11px',
              background: loading || !password ? '#D4CEC6' : '#B5763A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              marginTop: 8,
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
