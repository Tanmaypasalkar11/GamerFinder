-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "emailVerifiedToken" TEXT,
ADD COLUMN     "emailVerifiedTokenExpiresAt" TIMESTAMP(3);
