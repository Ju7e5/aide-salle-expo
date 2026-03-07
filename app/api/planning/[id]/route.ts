import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

// PATCH /api/planning/:id — marquer fait ou échanger responsable
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const data = await request.json()

  const updated = await prisma.planning.update({
    where: { id: params.id },
    data: {
      ...data,
      faitLe: data.fait === true ? new Date() : data.fait === false ? null : undefined,
    },
  })

  return NextResponse.json(updated)
}
