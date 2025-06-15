/*
  Warnings:

  - You are about to drop the column `emailToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailTokenExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailToken",
DROP COLUMN "emailTokenExpires",
DROP COLUMN "emailVerified",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
