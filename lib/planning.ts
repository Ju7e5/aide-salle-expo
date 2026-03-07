// Calcul de la semaine ISO (ex: "2026-W10")
export function getSemaineISO(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

// Retourne le lundi de la semaine ISO donnée
export function getLundiDeSemaine(semaine: string): Date {
  const [year, week] = semaine.split('-W').map(Number)
  const jan4 = new Date(year, 0, 4)
  const startOfWeek = new Date(jan4)
  const dayOfWeek = jan4.getDay() || 7
  startOfWeek.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
  return startOfWeek
}

// Formate une date en français "Lun 10 mars 2026"
export function formatDateFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const TACHES = [
  { id: 'petit_dejeuner', label: 'Petit déjeuner', icon: '🥐' },
  { id: 'menage_wc', label: 'Ménage WC', icon: '🚽' },
  { id: 'menage_pause', label: 'Salle de pause', icon: '☕' },
] as const

export type TacheId = typeof TACHES[number]['id']

// Calcule qui fait quoi pour une semaine donnée
// membresActifs : tableau ordonné des membres actifs
// offset : 0 = semaine courante, 1 = semaine suivante, etc.
export function calculerRotation(
  membresActifs: { nom: string; ordre: number }[],
  semaineISO: string
): Record<TacheId, string> {
  if (membresActifs.length === 0) {
    return { petit_dejeuner: '—', menage_wc: '—', menage_pause: '—' }
  }

  // Numéro de semaine absolu pour calculer l'offset
  const [yearStr, weekStr] = semaineISO.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  // Offset total depuis une époque arbitraire
  const absoluteWeek = year * 53 + week

  const sorted = [...membresActifs].sort((a, b) => a.ordre - b.ordre)
  const n = sorted.length

  return {
    petit_dejeuner: sorted[absoluteWeek % n].nom,
    menage_wc: sorted[(absoluteWeek + 1) % n].nom,
    menage_pause: sorted[(absoluteWeek + 2) % n].nom,
  }
}
