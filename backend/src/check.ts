import prisma from './config/database';

async function check() {
    const total = await prisma.car.count();
    const active = await prisma.car.count({ where: { status: 'active' } });
    const deleted = await prisma.car.count({ where: { status: 'deleted' } });

    console.log(`Summary: Total=${total}, Active=${active}, Deleted=${deleted}`);

    const last5 = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: true }
    });

    last5.forEach(c => {
        console.log(`ID: ${c.id}, Title: ${c.title}, Status: ${c.status}, User: ${c.user.firstName} (ID: ${c.userId})`);
    });
}

check().catch(console.error).finally(() => prisma.$disconnect());
