const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin1234', // ⚠️ เปลี่ยนเป็นรหัสที่อยากได้
      name: 'Super Admin',
    },
  });
  console.log('✅ Created Admin User!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());