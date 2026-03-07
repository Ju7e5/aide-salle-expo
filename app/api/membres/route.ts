import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const membres = await prisma.membre.findMany({ orderBy: { ordre: 'asc' } })
  return NextResponse.json(membres)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { nom, couleur } = await request.json()
  if (!nom?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  const maxOrdre = await prisma.membre.aggregate({ _max: { ordre: true } })
  const ordre = (maxOrdre._max.ordre ?? -1) + 1

  const membre = await prisma.membre.create({
    data: { nom: nom.trim(), couleur: couleur || '#B5763A', ordre },
  })
  return NextResponse.json(membre, { status: 201 })
}
