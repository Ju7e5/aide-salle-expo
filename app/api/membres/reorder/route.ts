import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

// PATCH /api/membres/reorder — body: { ids: string[] } (ordre souhaité)
export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { ids } = await request.json() as { ids: string[] }
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids requis' }, { status: 400 })

  await Promise.all(
    ids.map((id, index) =>
      prisma.membre.update({ where: { id }, data: { ordre: index } })
    )
  )

  return NextResponse.json({ ok: true })
}
