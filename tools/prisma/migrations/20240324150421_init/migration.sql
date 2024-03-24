-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('email', 'github', 'google');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en-US',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secrets" (
    "id" TEXT NOT NULL,
    "password" TEXT,
    "lastSignedIn" TIMESTAMP(3),
    "verificationToken" TEXT,
    "twoFactorSecret" TEXT,
    "twoFactorBackupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refreshToken" TEXT,
    "resetToken" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Secrets_resetToken_key" ON "Secrets"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Secrets_userId_key" ON "Secrets"("userId");

-- AddForeignKey
ALTER TABLE "Secrets" ADD CONSTRAINT "Secrets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
