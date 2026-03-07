'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Membre {
  id: string
  nom: string
  couleur: string
  actif: boolean
  ordre: number
}

const COULEURS_PRESET = [
  '#B5763A', '#3D7A5E', '#2E5FA3', '#7C3D8A',
  '#B83232', '#C0615A', '#B8860B', '#4A7C8A',
  '#5C6BC0', '#26A69A',
]

function SortableRow({
  membre,
  onToggle,
  onDelete,
}: {
  membre: Membre
  onToggle: (id: string, actif: boolean) => void
  onDelete: (id: string, nom: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: membre.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const initials = membre.nom.slice(0, 2).toUpperCase()

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: '#fff',
        border: '1px solid #E4E0DA',
        borderRadius: 10,
        marginBottom: 6,
        opacity: style.opacity,
      }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'grab',
          color: '#D4CEC6',
          fontSize: 16,
          padding: '0 2px',
          lineHeight: 1,
        }}
        title="Réordonner"
      >
        ⠿
      </button>

      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: membre.actif ? membre.couleur : '#D4CEC6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Nom */}
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color: membre.actif ? '#18181B' : '#71717A',
          textDecoration: membre.actif ? 'none' : 'line-through',
        }}
      >
        {membre.nom}
      </span>

      {/* Statut */}
      {!membre.actif && (
        <span
          style={{
            fontSize: 11,
            background: '#FDF6E3',
            color: '#B8860B',
            padding: '2px 8px',
            borderRadius: 20,
            fontWeight: 500,
          }}
        >
          Inactif
        </span>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => onToggle(membre.id, !membre.actif)}
          title={membre.actif ? 'Désactiver (congé…)' : 'Réactiver'}
          style={{
            padding: '5px 10px',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "'Outfit', sans-serif",
            background: membre.actif ? '#FDF6E3' : '#E8F4EE',
            color: membre.actif ? '#B8860B' : '#3D7A5E',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {membre.actif ? 'Désactiver' : 'Réactiver'}
        </button>
        <button
          onClick={() => onDelete(membre.id, membre.nom)}
          title="Supprimer"
          style={{
            padding: '5px 8px',
            fontSize: 14,
            background: '#FCEAEA',
            color: '#B83232',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function EquipePage() {
  const [membres, setMembres] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [nom, setNom] = useState('')
  const [couleur, setCouleur] = useState('#B5763A')
  const [adding, setAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; nom: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchMembres = useCallback(async () => {
    const res = await fetch('/api/membres')
    if (res.ok) setMembres(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchMembres() }, [fetchMembres])

  async function handleAdd() {
    if (!nom.trim()) return
    setAdding(true)
    const res = await fetch('/api/membres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: nom.trim(), couleur }),
    })
    if (res.ok) {
      setNom('')
      setCouleur('#B5763A')
      await fetchMembres()
    }
    setAdding(false)
  }

  async function handleToggle(id: string, actif: boolean) {
    await fetch(`/api/membres/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actif }),
    })
    await fetchMembres()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/membres/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    await fetchMembres()
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = membres.findIndex((m) => m.id === active.id)
    const newIndex = membres.findIndex((m) => m.id === over.id)
    const newOrder = arrayMove(membres, oldIndex, newIndex)
    setMembres(newOrder)

    await fetch('/api/membres/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: newOrder.map((m) => m.id) }),
    })
  }

  const actifs = membres.filter((m) => m.actif).length

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#18181B',
            marginBottom: 4,
          }}
        >
          Équipe
        </h1>
        <p style={{ fontSize: 13, color: '#71717A' }}>
          {membres.length} membres · {actifs} actifs · Réordonnez par glisser-déposer pour modifier la rotation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Liste */}
        <div>
          {loading ? (
            <p style={{ color: '#71717A', fontSize: 13 }}>Chargement…</p>
          ) : membres.length === 0 ? (
            <p style={{ color: '#71717A', fontSize: 13 }}>Aucun membre.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={membres.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {membres.map((m) => (
                  <SortableRow
                    key={m.id}
                    membre={m}
                    onToggle={handleToggle}
                    onDelete={(id, nom) => setConfirmDelete({ id, nom })}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Formulaire ajout */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #E4E0DA',
            borderRadius: 12,
            padding: '20px',
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#18181B', marginBottom: 16 }}>
            Ajouter un membre
          </h2>

          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 5, color: '#18181B' }}>
            Nom
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Prénom"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1.5px solid #E4E0DA',
              borderRadius: 7,
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
              marginBottom: 14,
              outline: 'none',
            }}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 8, color: '#18181B' }}>
            Couleur avatar
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {COULEURS_PRESET.map((c) => (
              <button
                key={c}
                onClick={() => setCouleur(c)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: c,
                  border: couleur === c ? '2.5px solid #18181B' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none',
                }}
              />
            ))}
          </div>

          {/* Aperçu */}
          {nom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: couleur,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {nom.slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{nom}</span>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!nom.trim() || adding}
            style={{
              width: '100%',
              padding: '9px',
              background: !nom.trim() || adding ? '#D4CEC6' : '#B5763A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: !nom.trim() || adding ? 'not-allowed' : 'pointer',
            }}
          >
            {adding ? 'Ajout…' : '+ Ajouter'}
          </button>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '28px 32px',
              maxWidth: 380,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Supprimer {confirmDelete.nom} ?
            </h3>
            <p style={{ fontSize: 13, color: '#71717A', marginBottom: 20 }}>
              Cette action est irréversible. L&apos;historique du planning sera conservé mais le membre ne sera
              plus dans les rotations.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: '8px 16px',
                  background: '#F7F5F2',
                  border: '1px solid #E4E0DA',
                  borderRadius: 7,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                style={{
                  padding: '8px 16px',
                  background: '#B83232',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
