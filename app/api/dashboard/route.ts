import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'
import { getSemaineISO } from '@/lib/planning'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [
    totalReferences,
    presentoirsVides,
    presentoirsActifs,
    rotationsCeMois,
    alertesRotations,
    dernieresReferences,
  ] = await Promise.all([
    prisma.reference.count({ where: { statut: { not: 'a_retirer' } } }),
    prisma.presentoir.count({ where: { statut: 'vide' } }),
    prisma.presentoir.count({ where: { statut: 'actif' } }),
    prisma.rotation.count({
      where: {
        datePrevue: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    }),
    prisma.rotation.findMany({
      where: {
        statut: 'planifie',
        datePrevue: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: { presentoir: true },
      orderBy: { datePrevue: 'asc' },
    }),
    prisma.reference.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { presentoir: { select: { nom: true } } },
    }),
  ])

  return NextResponse.json({
    stats: { totalReferences, presentoirsVides, presentoirsActifs, rotationsCeMois },
    alertesRotations,
    dernieresReferences,
    semaine: getSemaineISO(),
  })
}
