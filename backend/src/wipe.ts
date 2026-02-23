import prisma from './config/database';

async function wipeData() {
    console.log('🧹 Wiping all listing and service data...');

    // Delete car images first (cascade might take care of it, but being explicit)
    await prisma.carImage.deleteMany({});
    console.log('✅ Deleted all car images');

    // Delete all cars
    await prisma.car.deleteMany({});
    console.log('✅ Deleted all cars');

    // Delete all services
    await prisma.service.deleteMany({});
    console.log('✅ Deleted all services');

    console.log('🎉 Database cleaned! Only users remain.');
}

wipeData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
