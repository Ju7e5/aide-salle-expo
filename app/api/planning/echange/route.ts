import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

// POST /api/planning/echange — échanger deux responsables sur une semaine
// body: { semaine, tache1, tache2 }
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { semaine, tache1Id, tache2Id } = await request.json()

  const [entry1, entry2] = await Promise.all([
    prisma.planning.findUnique({ where: { id: tache1Id } }),
    prisma.planning.findUnique({ where: { id: tache2Id } }),
  ])

  if (!entry1 || !entry2) {
    return NextResponse.json({ error: 'Entrées introuvables' }, { status: 404 })
  }

  await Promise.all([
    prisma.planning.update({ where: { id: tache1Id }, data: { membreNom: entry2.membreNom } }),
    prisma.planning.update({ where: { id: tache2Id }, data: { membreNom: entry1.membreNom } }),
  ])

  return NextResponse.json({ ok: true })
}
