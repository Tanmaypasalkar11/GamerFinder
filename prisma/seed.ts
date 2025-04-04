import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Creating a dummy user with plaintext password
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123', // Plaintext password
      image: 'https://i.pravatar.cc/150?img=3',
      isOnline: true,
    },
  });

  console.log('Dummy user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
