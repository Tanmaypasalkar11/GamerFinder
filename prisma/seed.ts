import { PrismaClient } from '@prisma/client'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)


const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      name: 'Test User',
    },
  })

  const game = await prisma.game.upsert({
    where: { name: 'Valorant' },
    update: {},
    create: {
      name: 'Valorant',
    },
  })

  await prisma.listing.create({
    data: {
      title: 'Looking for a Valorant duo',
      description: 'Need a reliable ranked partner.',
      pricePerHour: 12.5,
      userId: user.id,
      game:"Valorant",
    },
  })

  console.log('🌱 Seed completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
