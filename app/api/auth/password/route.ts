import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { ancienMotDePasse, nouveauMotDePasse } = await request.json()

  if (!ancienMotDePasse || !nouveauMotDePasse) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  if (nouveauMotDePasse.length < 6) {
    return NextResponse.json({ error: 'Le mot de passe doit faire au moins 6 caractères' }, { status: 400 })
  }

  const config = await prisma.config.findUnique({ where: { cle: 'auth_password_hash' } })
  if (!config) return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })

  const valid = await bcrypt.compare(ancienMotDePasse, config.valeur)
  if (!valid) {
    return NextResponse.json({ error: 'Ancien mot de passe incorrect' }, { status: 401 })
  }

  const hash = await bcrypt.hash(nouveauMotDePasse, 10)
  await prisma.config.update({ where: { cle: 'auth_password_hash' }, data: { valeur: hash } })

  return NextResponse.json({ ok: true })
}
