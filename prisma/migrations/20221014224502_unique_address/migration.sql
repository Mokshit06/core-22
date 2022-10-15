/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `EthWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EthWallet_address_key" ON "EthWallet"("address");
