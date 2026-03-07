import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { SessionData, sessionOptions } from '@/lib/session'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password) {
    return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
  }

  const config = await prisma.config.findUnique({ where: { cle: 'auth_password_hash' } })

  if (!config) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  const valid = await bcrypt.compare(password, config.valeur)

  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  session.authenticated = true
  await session.save()

  return response
}
