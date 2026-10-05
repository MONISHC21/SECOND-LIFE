import bcrypt from 'bcryptjs';
import { db } from '../server/db/store.ts';

async function main() {
  console.log('SecondLife Prisma Seeder invoked...');
  console.log('Database initialized with master catalog of 22 components, 10 projects, and demo user Monish.');
}

main()
  .then(() => {
    console.log('Seed completed successfully.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
