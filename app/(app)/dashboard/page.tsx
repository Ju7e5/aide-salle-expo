'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSemaineISO, getLundiDeSemaine, TACHES } from '@/lib/planning'

interface DashboardData {
  stats: {
    totalReferences: number
    presentoirsVides: number
    presentoirsActifs: number
    rotationsCeMois: number
  }
  alertesRotations: {
    id: string
    presentoir: { nom: string }
    datePrevue: string
    description: string
  }[]
  dernieresReferences: {
    id: string
    nom: string
    reference: string
    fournisseur: string
    presentoir: { nom: string } | null
    createdAt: string
  }[]
  semaine: string
}

interface PlanningEntry {
  id: string
  tache: string
  membreNom: string
  fait: boolean
}

function StatCard({
  value,
  label,
  color = '#18181B',
  bg = '#fff',
}: {
  value: number | string
  label: string
  color?: string
  bg?: string
}) {
  return (
    <div
      style={{
        background: bg,
        border: '1px solid #E4E0DA',
        borderRadius: 12,
        padding: '18px 20px',
      }}
    >
      <p style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: '#71717A', marginTop: 5 }}>{label}</p>
    </div>
  )
}

function getSemainesRange(current: string, offset: number): string {
  const [yearStr, weekStr] = current.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr) + offset
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

function joursRestants(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [planning, setPlanning] = useState<PlanningEntry[]>([])
  const [loading, setLoading] = useState(true)

  const semaine = getSemaineISO()

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch(`/api/planning?semaine=${semaine}`).then((r) => r.json()),
    ]).then(([dash, plan]) => {
      setData(dash)
      setPlanning(plan.taches || [])
      setLoading(false)
    })
  }, [semaine])

  const lundi = getLundiDeSemaine(semaine)
  const vendredi = new Date(lundi)
  vendredi.setDate(lundi.getDate() + 4)
  const semaineLabel = `${lundi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} – ${vendredi.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#71717A', fontSize: 13 }}>Chargement…</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            fontWeight: 600,
            color: '#18181B',
            marginBottom: 2,
          }}
        >
          Bonjour
        </h1>
        <p style={{ fontSize: 13, color: '#71717A' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Planning semaine — mise en avant */}
      <div
        style={{
          background: '#18181B',
          borderRadius: 14,
          padding: '18px 22px',
          marginBottom: 24,
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Semaine du
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#B5763A' }}>{semaineLabel}</span>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {TACHES.map((tacheInfo) => {
            const entry = planning.find((t) => t.tache === tacheInfo.id)
            return (
              <div key={tacheInfo.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{tacheInfo.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {tacheInfo.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: entry?.fait ? '#3D7A5E' : '#fff' }}>
                    {entry?.membreNom || '—'}
                    {entry?.fait && ' ✓'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <StatCard value={data.stats.totalReferences} label="Références en expo" />
          <StatCard
            value={data.stats.presentoirsActifs}
            label="Présentoirs actifs"
            color="#3D7A5E"
            bg="#E8F4EE"
          />
          <StatCard
            value={data.stats.presentoirsVides}
            label="Présentoirs vides"
            color={data.stats.presentoirsVides > 0 ? '#B83232' : '#71717A'}
            bg={data.stats.presentoirsVides > 0 ? '#FCEAEA' : '#fff'}
          />
          <StatCard value={data.stats.rotationsCeMois} label="Rotations ce mois" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Alertes */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#18181B', marginBottom: 12 }}>
            Alertes rotations
          </h2>
          {data?.alertesRotations.length === 0 ? (
            <div
              style={{
                background: '#E8F4EE',
                border: '1px solid #3D7A5E',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 13,
                color: '#3D7A5E',
              }}
            >
              Aucune rotation urgente cette semaine
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data?.alertesRotations.map((alerte) => {
                const jours = joursRestants(alerte.datePrevue)
                return (
                  <div
                    key={alerte.id}
                    style={{
                      background: jours <= 2 ? '#FCEAEA' : '#FDF6E3',
                      border: `1px solid ${jours <= 2 ? '#B83232' : '#B8860B'}`,
                      borderRadius: 10,
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>⚠</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#18181B' }}>
                          {alerte.presentoir.nom}
                        </p>
                        <p style={{ fontSize: 12, color: '#71717A' }}>{alerte.description}</p>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: jours <= 2 ? '#B83232' : '#B8860B',
                          flexShrink: 0,
                        }}
                      >
                        {jours <= 0 ? "Aujourd'hui" : `J-${jours}`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Dernières références */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#18181B' }}>Dernières références</h2>
            <Link
              href="/catalogue"
              style={{ fontSize: 12, color: '#B5763A', textDecoration: 'none', fontWeight: 500 }}
            >
              Voir tout →
            </Link>
          </div>

          {data?.dernieresReferences.length === 0 ? (
            <div
              style={{
                background: '#F7F5F2',
                border: '1px solid #E4E0DA',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 13,
                color: '#71717A',
              }}
            >
              Aucune référence encore ajoutée
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                border: '1px solid #E4E0DA',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {data?.dernieresReferences.map((ref, i) => (
                <div
                  key={ref.id}
                  style={{
                    padding: '10px 16px',
                    borderBottom: i < (data.dernieresReferences.length - 1) ? '1px solid #E4E0DA' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#18181B' }}>{ref.nom}</p>
                    <p style={{ fontSize: 11, color: '#71717A' }}>
                      {ref.reference} · {ref.fournisseur}
                      {ref.presentoir && ` · ${ref.presentoir.nom}`}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: '#71717A',
                    }}
                  >
                    {new Date(ref.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
