/*
  Warnings:

  - You are about to drop the column `dislikedByIds` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the `_DislikedBy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DislikedBy" DROP CONSTRAINT "_DislikedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_DislikedBy" DROP CONSTRAINT "_DislikedBy_B_fkey";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "dislikedByIds";

-- DropTable
DROP TABLE "_DislikedBy";
