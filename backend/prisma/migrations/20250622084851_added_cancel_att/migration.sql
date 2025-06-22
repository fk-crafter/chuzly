/*
  Warnings:

  - You are about to drop the column `downgradeAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "downgradeAt",
ADD COLUMN     "cancelAt" TIMESTAMP(3);
