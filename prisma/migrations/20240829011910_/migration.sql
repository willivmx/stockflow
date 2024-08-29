/*
  Warnings:

  - You are about to drop the column `userId` on the `Store` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_userId_userEmail_fkey";

-- DropIndex
DROP INDEX "Store_userId_key";

-- DropIndex
DROP INDEX "Store_userId_userEmail_key";

-- DropIndex
DROP INDEX "users_id_email_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
