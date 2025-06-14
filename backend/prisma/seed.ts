import prisma from '../src/utils/db/prisma';
import { Role } from '../generated/prisma';
import createUserPrisma from '../src/utils/db/createUserPrisma';

async function seedFirstAdmin() {
  const adminEmail = process.env.FIRST_ADMIN_EMAIL!;
  const adminPassword = process.env.FIRST_ADMIN_PASSWORD!;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const admin = await createUserPrisma({
    firstName: 'Super',
    lastName: 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: Role.ADMIN,
  });

  console.log('Admin user created');
}

async function main() {
  console.log('Seeding database...');
  await seedFirstAdmin();
  console.log('Database seeding completed.');
}

main()
  .catch((error) => {
    console.error('Error during database seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
  });
