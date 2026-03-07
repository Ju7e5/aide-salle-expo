import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { getSemaineISO, calculerRotation, TACHES } from '@/lib/planning'

// GET /api/planning?semaine=2026-W10
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const semaine = searchParams.get('semaine') || getSemaineISO()

  // Chercher les entrées existantes
  const existing = await prisma.planning.findMany({ where: { semaine } })

  if (existing.length === TACHES.length) {
    return NextResponse.json({ semaine, taches: existing })
  }

  // Générer automatiquement si manquant
  const membres = await prisma.membre.findMany({
    where: { actif: true },
    orderBy: { ordre: 'asc' },
  })

  const rotation = calculerRotation(membres, semaine)
  const taches = await Promise.all(
    TACHES.map(async (t) => {
      const entry = existing.find((e) => e.tache === t.id)
      if (entry) return entry
      return prisma.planning.create({
        data: {
          semaine,
          tache: t.id,
          membreNom: rotation[t.id],
          fait: false,
        },
      })
    })
  )

  return NextResponse.json({ semaine, taches })
}
