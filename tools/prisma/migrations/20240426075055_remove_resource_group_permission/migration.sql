/*
  Warnings:

  - You are about to drop the `ResourceGroupPermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ResourceGroupPermission" DROP CONSTRAINT "ResourceGroupPermission_groupPermissionId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceGroupPermission" DROP CONSTRAINT "ResourceGroupPermission_resource_id_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "slug" VARCHAR;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "slug" VARCHAR;

-- DropTable
DROP TABLE "ResourceGroupPermission";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
