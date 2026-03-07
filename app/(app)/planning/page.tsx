'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSemaineISO, getLundiDeSemaine, TACHES } from '@/lib/planning'

interface PlanningEntry {
  id: string
  semaine: string
  tache: string
  membreNom: string
  fait: boolean
  faitLe: string | null
}

interface Membre {
  id: string
  nom: string
  couleur: string
  actif: boolean
}

function getSemainesRange(current: string, offset: number): string {
  const [yearStr, weekStr] = current.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr) + offset
  // Normalize week overflow
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const startOfYear = new Date(jan4)
  startOfYear.setDate(jan4.getDate() - dayOfWeek + 1)
  const targetDate = new Date(startOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000)
  const d = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function formatSemaineLabel(semaine: string): string {
  try {
    const lundi = getLundiDeSemaine(semaine)
    const vendredi = new Date(lundi)
    vendredi.setDate(lundi.getDate() + 4)
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
    return `${lundi.toLocaleDateString('fr-FR', opts)} – ${vendredi.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' })}`
  } catch {
    return semaine
  }
}

export default function PlanningPage() {
  const currentSemaine = getSemaineISO()
  const [semaine, setSemaine] = useState(currentSemaine)
  const [taches, setTaches] = useState<PlanningEntry[]>([])
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [echangeMode, setEchangeMode] = useState<string | null>(null)
  const [echangeTarget, setEchangeTarget] = useState<string | null>(null)

  const fetchPlanning = useCallback(async (sem: string) => {
    setLoading(true)
    const res = await fetch(`/api/planning?semaine=${sem}`)
    if (res.ok) {
      const data = await res.json()
      setTaches(data.taches)
    }
    setLoading(false)
  }, [])

  const fetchMembres = useCallback(async () => {
    const res = await fetch('/api/membres')
    if (res.ok) setMembres(await res.json())
  }, [])

  useEffect(() => {
    fetchMembres()
  }, [fetchMembres])

  useEffect(() => {
    fetchPlanning(semaine)
  }, [semaine, fetchPlanning])

  async function toggleFait(entry: PlanningEntry) {
    await fetch(`/api/planning/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fait: !entry.fait }),
    })
    await fetchPlanning(semaine)
  }

  async function handleEchange(targetId: string) {
    if (!echangeMode) return
    if (echangeMode === targetId) {
      setEchangeMode(null)
      setEchangeTarget(null)
      return
    }
    await fetch('/api/planning/echange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ semaine, tache1Id: echangeMode, tache2Id: targetId }),
    })
    setEchangeMode(null)
    setEchangeTarget(null)
    await fetchPlanning(semaine)
  }

  async function handleChangeMembre(entryId: string, newNom: string) {
    await fetch(`/api/planning/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membreNom: newNom }),
    })
    await fetchPlanning(semaine)
  }

  const isCurrentWeek = semaine === currentSemaine
  const membresActifs = membres.filter((m) => m.actif)

  // Semaines pour la vue mini-calendrier
  const semaines = [-1, 0, 1, 2].map((offset) => getSemainesRange(currentSemaine, offset))

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#18181B',
            marginBottom: 4,
          }}
        >
          Planning équipe
        </h1>
        <p style={{ fontSize: 13, color: '#71717A' }}>Rotation des tâches hebdomadaires</p>
      </div>

      {/* Sélecteur de semaine */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {semaines.map((sem) => {
          const lundi = getLundiDeSemaine(sem)
          const isCurrent = sem === currentSemaine
          const isSelected = sem === semaine
          return (
            <button
              key={sem}
              onClick={() => setSemaine(sem)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: isSelected ? '2px solid #B5763A' : '1.5px solid #E4E0DA',
                background: isSelected ? '#F5EDE3' : '#fff',
                color: isSelected ? '#B5763A' : '#18181B',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {isCurrent && (
                <span style={{ fontSize: 10, marginRight: 5, color: '#3D7A5E', fontWeight: 600 }}>
                  CETTE SEMAINE ·{' '}
                </span>
              )}
              {lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </button>
          )
        })}
        <button
          onClick={() => setSemaine((s) => getSemainesRange(s, -1))}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid #E4E0DA',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => setSemaine((s) => getSemainesRange(s, 1))}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid #E4E0DA',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ›
        </button>
      </div>

      {/* Titre semaine */}
      <div
        style={{
          background: isCurrentWeek ? '#F5EDE3' : '#fff',
          border: `1.5px solid ${isCurrentWeek ? '#B5763A' : '#E4E0DA'}`,
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {isCurrentWeek && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#B5763A',
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ fontSize: 14, fontWeight: 600, color: isCurrentWeek ? '#B5763A' : '#18181B' }}>
          Semaine du {formatSemaineLabel(semaine)}
        </span>
        <span style={{ fontSize: 12, color: '#71717A', marginLeft: 'auto' }}>{semaine}</span>
      </div>

      {/* Tâches */}
      {loading ? (
        <p style={{ color: '#71717A', fontSize: 13 }}>Chargement…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {TACHES.map((tacheInfo) => {
            const entry = taches.find((t) => t.tache === tacheInfo.id)
            if (!entry) return null

            const membre = membres.find((m) => m.nom === entry.membreNom)
            const isEchangeSource = echangeMode === entry.id
            const isEchangeTarget = echangeTarget === entry.id

            return (
              <div
                key={tacheInfo.id}
                style={{
                  background: entry.fait ? '#E8F4EE' : '#fff',
                  border: `1.5px solid ${isEchangeSource ? '#B5763A' : entry.fait ? '#3D7A5E' : '#E4E0DA'}`,
                  borderRadius: 12,
                  padding: '18px',
                  position: 'relative',
                }}
              >
                {/* Icône et titre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{tacheInfo.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#18181B' }}>{tacheInfo.label}</span>
                  {entry.fait && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 10,
                        background: '#E8F4EE',
                        color: '#3D7A5E',
                        padding: '2px 7px',
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      Fait ✓
                    </span>
                  )}
                </div>

                {/* Responsable */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: membre?.couleur || '#B5763A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {entry.membreNom.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#18181B' }}>{entry.membreNom}</p>
                    {entry.faitLe && (
                      <p style={{ fontSize: 11, color: '#71717A' }}>
                        {new Date(entry.faitLe).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Changer responsable manuellement */}
                <div style={{ marginBottom: 12 }}>
                  <select
                    value={entry.membreNom}
                    onChange={(e) => handleChangeMembre(entry.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1.5px solid #E4E0DA',
                      borderRadius: 6,
                      fontSize: 12,
                      fontFamily: "'Outfit', sans-serif",
                      background: '#fff',
                      color: '#18181B',
                      cursor: 'pointer',
                    }}
                  >
                    {membresActifs.map((m) => (
                      <option key={m.id} value={m.nom}>
                        {m.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bouton marquer fait */}
                <button
                  onClick={() => toggleFait(entry)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: entry.fait ? '#FCEAEA' : '#3D7A5E',
                    color: entry.fait ? '#B83232' : '#fff',
                    border: 'none',
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  {entry.fait ? '✕ Marquer non fait' : '✓ Marquer comme fait'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Historique — semaines précédentes */}
      {!isCurrentWeek && !loading && (
        <div
          style={{
            background: '#F7F5F2',
            border: '1px solid #E4E0DA',
            borderRadius: 10,
            padding: '14px 18px',
          }}
        >
          <p style={{ fontSize: 12, color: '#71717A' }}>
            Cette semaine est{' '}
            {semaine < currentSemaine ? 'passée' : 'à venir'}.{' '}
            {semaine < currentSemaine && 'Les modifications restent possibles.'}
          </p>
        </div>
      )}
    </div>
  )
}
