import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const MEMBRES_INITIAUX = [
  { nom: 'Jules', couleur: '#B5763A', ordre: 0 },
  { nom: 'Sylvana', couleur: '#3D7A5E', ordre: 1 },
  { nom: 'Mathieu', couleur: '#2E5FA3', ordre: 2 },
  { nom: 'François', couleur: '#7C3D8A', ordre: 3 },
  { nom: 'Vincent', couleur: '#B83232', ordre: 4 },
  { nom: 'Laurine', couleur: '#C0615A', ordre: 5 },
  { nom: 'Elisa', couleur: '#B8860B', ordre: 6 },
]

async function main() {
  console.log('Seeding database...')

  // Mot de passe par défaut : "carrelage2026"
  const passwordHash = await bcrypt.hash('carrelage2026', 10)
  await prisma.config.upsert({
    where: { cle: 'auth_password_hash' },
    update: {},
    create: { cle: 'auth_password_hash', valeur: passwordHash },
  })

  // Membres de l'équipe
  for (const m of MEMBRES_INITIAUX) {
    const existing = await prisma.membre.findFirst({ where: { nom: m.nom } })
    if (!existing) {
      await prisma.membre.create({ data: m })
    }
  }

  console.log('Seed completed. Default password: carrelage2026')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
