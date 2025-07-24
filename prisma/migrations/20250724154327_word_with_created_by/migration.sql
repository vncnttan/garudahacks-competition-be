/*
  Warnings:

  - Added the required column `createdById` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
