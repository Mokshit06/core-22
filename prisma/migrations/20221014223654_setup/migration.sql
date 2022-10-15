-- CreateEnum
CREATE TYPE "Class" AS ENUM ('ECONOMY', 'BUSINESS', 'FIRST');

-- CreateTable
CREATE TABLE "EthWallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "EthWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ethWalletId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "passengers" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivateDate" TIMESTAMP(3) NOT NULL,
    "class" "Class" NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ethWalletId_key" ON "User"("ethWalletId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ethWalletId_fkey" FOREIGN KEY ("ethWalletId") REFERENCES "EthWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
