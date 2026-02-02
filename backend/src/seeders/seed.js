const { Store, Product } = require('../models');
const { sequelize } = require('../config/database');

async function seedData() {
    try {
        // Wait for DB to sync
        await sequelize.sync({ force: true }); // Use force true to clean DB for seeding

        // Seed Stores
        const store1 = await Store.create({
            name: 'Indomaret Gatot Subroto',
            address: 'Jl. Gatot Subroto No. 123',
            latitude: -7.2575,
            longitude: 112.7521,
            type: 'supermarket'
        });

        // Seed Products
        await Product.bulkCreate([
            {
                storeId: store1.id,
                name: 'Susu Ultra Milk 1L',
                price: 18000,
                stock: 50,
                locationAisle: 'A1',
                halalStatus: true,
                category: 'Minuman'
            },
            {
                storeId: store1.id,
                name: 'Beras Premium 5kg',
                price: 75000,
                stock: 30,
                locationAisle: 'B3',
                halalStatus: true,
                category: 'Sembako'
            },
            {
                storeId: store1.id,
                name: 'Minyak Goreng Bimoli 2L',
                price: 35000,
                stock: 45,
                locationAisle: 'A2',
                halalStatus: true,
                category: 'Sembako'
            }
        ]);

        console.log('✅ Seed completed');
    } catch (err) {
        console.error('❌ SEED FAILED:', err.message);
        if (err.parent && err.parent.code === '28P01') {
            console.error('\n⚠️  PASSWORD SALAH / AUTHENTICATION FAILED');
            console.error('👉 Cek file backend/.env');
            console.error('👉 Pastikan DB_PASSWORD sesuai dengan password user postgres Anda.');
        } else if (err.parent && err.parent.code === '3D000') {
            console.error('\n⚠️  DATABASE BELUM ADA');
            console.error(`👉 Silakan buat database dulu: CREATE DATABASE ${process.env.DB_NAME};`);
        }
    } finally {
        process.exit();
    }
}

seedData();

