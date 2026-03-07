'use client'

import { useState, FormEvent } from 'react'

export default function MotDePassePage() {
  const [ancien, setAncien] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (nouveau !== confirmation) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }
    if (nouveau.length < 6) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit faire au moins 6 caractères' })
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ancienMotDePasse: ancien, nouveauMotDePasse: nouveau }),
    })

    if (res.ok) {
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' })
      setAncien('')
      setNouveau('')
      setConfirmation('')
    } else {
      const data = await res.json()
      setMessage({ type: 'error', text: data.error || 'Erreur' })
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 13px',
    border: '1.5px solid #E4E0DA',
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "'Outfit', sans-serif",
    outline: 'none',
    marginBottom: 14,
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <div style={{ maxWidth: 420 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#18181B',
            marginBottom: 4,
          }}
        >
          Changer le mot de passe
        </h1>
        <p style={{ fontSize: 13, color: '#71717A', marginBottom: 28 }}>
          Le mot de passe est partagé par toute l&apos;équipe.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            border: '1px solid #E4E0DA',
            borderRadius: 12,
            padding: '24px',
          }}
        >
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
            Mot de passe actuel
          </label>
          <input
            type="password"
            value={ancien}
            onChange={(e) => setAncien(e.target.value)}
            style={inputStyle}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={nouveau}
            onChange={(e) => setNouveau(e.target.value)}
            style={inputStyle}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            style={inputStyle}
          />

          {message && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 14,
                fontSize: 13,
                background: message.type === 'success' ? '#E8F4EE' : '#FCEAEA',
                color: message.type === 'success' ? '#3D7A5E' : '#B83232',
                border: `1px solid ${message.type === 'success' ? '#3D7A5E' : '#B83232'}`,
              }}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !ancien || !nouveau || !confirmation}
            style={{
              width: '100%',
              padding: '10px',
              background: loading || !ancien || !nouveau || !confirmation ? '#D4CEC6' : '#B5763A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: loading || !ancien || !nouveau || !confirmation ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
