-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "username" TEXT,
    "first_name" TEXT NOT NULL,
    "phone" TEXT,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE INDEX "cars_brand_idx" ON "cars"("brand");

-- CreateIndex
CREATE INDEX "cars_city_idx" ON "cars"("city");

-- CreateIndex
CREATE INDEX "cars_price_idx" ON "cars"("price");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "cars"("year");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "cars"("status");

-- CreateIndex
CREATE INDEX "cars_user_id_idx" ON "cars"("user_id");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
