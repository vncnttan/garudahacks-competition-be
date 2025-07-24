/*
  Warnings:

  - You are about to drop the `_WordTranslations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_WordTranslations" DROP CONSTRAINT "_WordTranslations_A_fkey";

-- DropForeignKey
ALTER TABLE "_WordTranslations" DROP CONSTRAINT "_WordTranslations_B_fkey";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "directTranslation" TEXT[];

-- DropTable
DROP TABLE "_WordTranslations";
