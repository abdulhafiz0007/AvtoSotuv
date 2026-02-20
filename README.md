# 🚗 AvtoSotuv – Telegram Mini App

Mashina oldi-sotdi platformasi — Telegram Mini App

## Tuzilma (Structure)

```
AvtoSotuv/
├── backend/     # Express + Prisma + TypeScript API
├── frontend/    # Vite + React + TypeScript Mini App
├── bot/         # Telegram Bot
└── docker-compose.yml  # PostgreSQL
```

## Ishga tushirish (Getting Started)

### 1. Local PostgreSQL sozlash

O'zingizning PostgreSQL bazangizda `avtosotuv` nomli baza yarating va `backend/.env` faylidagi `DATABASE_URL` ni o'zgartiring.

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed         # Demo ma'lumotlar
npm run dev          # Server: http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install          # (allaqachon bajarilgan)
npm run dev          # Dev server: http://localhost:5173
```

### 4. Telegram Bot

```bash
cd bot
npm install          # (allaqachon bajarilgan)
npm run dev          # Bot polling rejimda
```

## API Endpointlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/login` | Telegram login |
| GET | `/api/cars` | E'lonlar ro'yxati (filterlar bilan) |
| GET | `/api/cars/:id` | E'lon tafsilotlari |
| POST | `/api/cars` | Yangi e'lon (auth) |
| DELETE | `/api/cars/:id` | E'lon o'chirish (auth) |
| GET | `/api/cars/my` | Mening e'lonlarim (auth) |
| POST | `/api/upload` | Rasm yuklash (auth) |
| GET | `/api/constants` | Markalar, shaharlar, i18n |
| GET | `/api/admin/stats` | Admin statistika |
| GET | `/api/admin/cars` | Admin e'lonlar |
| DELETE | `/api/admin/cars/:id` | Admin e'lon o'chirish |
| GET | `/api/admin/users` | Admin foydalanuvchilar |
| PUT | `/api/admin/users/:id/block` | Bloklash/chiqarish |

## Texnologiyalar

- **Backend**: Node.js, Express, TypeScript, Prisma, JWT
- **Frontend**: React, TypeScript, Vite, Zustand, Axios
- **Bot**: node-telegram-bot-api
- **DB**: PostgreSQL
- **Tillar**: O'zbek (default), Rus
