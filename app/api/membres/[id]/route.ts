import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const data = await request.json()
  const membre = await prisma.membre.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(membre)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await prisma.membre.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
