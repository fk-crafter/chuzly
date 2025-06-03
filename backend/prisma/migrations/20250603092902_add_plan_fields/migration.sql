-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('TRIAL', 'FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'TRIAL',
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubId" TEXT,
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);
