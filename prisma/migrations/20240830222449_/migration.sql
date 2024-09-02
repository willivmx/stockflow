/*
  Warnings:

  - A unique constraint covering the columns `[storeId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_storeId_key" ON "Order"("storeId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
