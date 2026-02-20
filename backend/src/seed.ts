import prisma from './config/database';

async function seed() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { telegramId: BigInt(123456789) },
        update: {},
        create: {
            telegramId: BigInt(123456789),
            firstName: 'Admin',
            username: 'admin',
            isAdmin: true,
        },
    });
    console.log(`✅ Admin user created: ${admin.firstName} (ID: ${admin.id})`);

    // Create sample listings
    const sampleCars = [
        {
            title: 'Chevrolet Malibu 2',
            brand: 'Chevrolet',
            year: 2022,
            price: 280000000,
            mileage: 35000,
            city: 'Toshkent',
            description: 'Yaxshi holatda, to\'liq komplektatsiya. Avtomat korobka, konditsioner, elektr oynalar.',
        },
        {
            title: 'Chevrolet Cobalt',
            brand: 'Chevrolet',
            year: 2020,
            price: 145000000,
            mileage: 68000,
            city: 'Samarqand',
            description: 'Holati a\'lo. Bir egadan. Hujjatlari tayyor.',
        },
        {
            title: 'Kia K5',
            brand: 'Kia',
            year: 2023,
            price: 420000000,
            mileage: 12000,
            city: 'Toshkent',
            description: 'Premium komplektatsiya, panorama lyuk, to\'la LED faralar, orqa kamera.',
        },
        {
            title: 'Hyundai Sonata',
            brand: 'Hyundai',
            year: 2021,
            price: 350000000,
            mileage: 45000,
            city: 'Buxoro',
            description: 'Ideal holat. Barcha texnik xizmatlar o\'z vaqtida qilingan.',
        },
        {
            title: 'Daewoo Gentra',
            brand: 'Daewoo',
            year: 2019,
            price: 120000000,
            mileage: 82000,
            city: 'Namangan',
            description: 'Yaxshi ishlaydi, iqtisodiy. Yangi shinalar. AC ishlaydi.',
        },
        {
            title: 'Toyota Camry 70',
            brand: 'Toyota',
            year: 2022,
            price: 520000000,
            mileage: 28000,
            city: 'Toshkent',
            description: 'Sport versiya. 2.5L motor, avtomatik uzatmalar qutisi. Holati yangi mashina.',
        },
        {
            title: 'Chevrolet Tracker',
            brand: 'Chevrolet',
            year: 2023,
            price: 310000000,
            mileage: 15000,
            city: "Farg'ona",
            description: 'SUV, 1.5T turbomotor. Keng salon, katta bagaj. Oila uchun ideal.',
        },
        {
            title: 'BYD Song Plus',
            brand: 'BYD',
            year: 2024,
            price: 380000000,
            mileage: 5000,
            city: 'Toshkent',
            description: 'Elektr gibrid, 110 km elektr rejimda. Katta ekran, 360° kamera.',
        },
    ];

    for (const carData of sampleCars) {
        const car = await prisma.car.create({
            data: {
                ...carData,
                userId: admin.id,
                images: {
                    create: [
                        { imageUrl: '/uploads/placeholder.jpg' },
                    ],
                },
            },
        });
        console.log(`✅ Car created: ${car.title}`);
    }

    console.log('🎉 Seeding complete!');
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
