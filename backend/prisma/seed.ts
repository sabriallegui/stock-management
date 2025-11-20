import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed script to populate the database with initial data
 * Creates an admin user, a regular user, and sample gadgets
 */
async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockmgmt.com' },
    update: {},
    create: {
      email: 'admin@stockmgmt.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@stockmgmt.com' },
    update: {},
    create: {
      email: 'user@stockmgmt.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Created regular user:', user.email);

  // Create sample gadgets
  const gadgets = [
    {
      name: 'MacBook Pro 16"',
      description: 'Apple MacBook Pro with M3 chip, 16GB RAM',
      quantity: 5,
      category: 'Laptop',
      status: 'AVAILABLE',
    },
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with 256GB storage',
      quantity: 10,
      category: 'Mobile',
      status: 'AVAILABLE',
    },
    {
      name: 'Dell Monitor 27"',
      description: '4K UHD Monitor',
      quantity: 15,
      category: 'Monitor',
      status: 'AVAILABLE',
    },
    {
      name: 'Magic Mouse',
      description: 'Apple Magic Mouse',
      quantity: 20,
      category: 'Accessory',
      status: 'AVAILABLE',
    },
    {
      name: 'USB-C Hub',
      description: 'Multi-port USB-C adapter',
      quantity: 8,
      category: 'Accessory',
      status: 'IN_USE',
    },
  ];

  for (const gadget of gadgets) {
    await prisma.gadget.upsert({
      where: { id: gadget.name }, // Using name as temporary unique identifier
      update: {},
      create: gadget,
    }).catch(() => {
      // If upsert fails, create new
      return prisma.gadget.create({ data: gadget });
    });
  }
  console.log(`✅ Created ${gadgets.length} sample gadgets`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('Admin - Email: admin@stockmgmt.com, Password: admin123');
  console.log('User  - Email: user@stockmgmt.com, Password: user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
