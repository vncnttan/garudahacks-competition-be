-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "pronounciation" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "exampleTranslation" TEXT NOT NULL,
    "examplePronounciation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WordTranslations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WordTranslations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Word_word_idx" ON "Word"("word");

-- CreateIndex
CREATE INDEX "Word_languageId_idx" ON "Word"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_languageName_key" ON "Language"("languageName");

-- CreateIndex
CREATE UNIQUE INDEX "Language_languageCode_key" ON "Language"("languageCode");

-- CreateIndex
CREATE INDEX "Language_languageCode_idx" ON "Language"("languageCode");

-- CreateIndex
CREATE INDEX "_WordTranslations_B_index" ON "_WordTranslations"("B");

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordTranslations" ADD CONSTRAINT "_WordTranslations_A_fkey" FOREIGN KEY ("A") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordTranslations" ADD CONSTRAINT "_WordTranslations_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
