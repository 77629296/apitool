/*
  Warnings:

  - Made the column `isPublic` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false,
ALTER COLUMN "isMaintenanceOn" SET DEFAULT true;
