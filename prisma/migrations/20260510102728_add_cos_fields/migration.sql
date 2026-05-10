/*
  Warnings:

  - You are about to drop the column `camera` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `filmStock` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `lens` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `shotAt` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "creatorId" TEXT;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "camera",
DROP COLUMN "description",
DROP COLUMN "filmStock",
DROP COLUMN "isPublished",
DROP COLUMN "lens",
DROP COLUMN "location",
DROP COLUMN "shotAt",
DROP COLUMN "title",
ADD COLUMN     "cos_key" TEXT,
ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "storage_type" TEXT NOT NULL DEFAULT 'local';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateIndex
CREATE INDEX "Photo_storage_type_idx" ON "Photo"("storage_type");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
