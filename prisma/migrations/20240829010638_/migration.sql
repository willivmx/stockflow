/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,userEmail]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_userId_fkey";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_userEmail_key" ON "Store"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Store_userId_userEmail_key" ON "Store"("userId", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_userId_userEmail_fkey" FOREIGN KEY ("userId", "userEmail") REFERENCES "users"("id", "email") ON DELETE CASCADE ON UPDATE CASCADE;
