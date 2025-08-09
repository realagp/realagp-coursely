/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "stripeProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Course_stripeProductId_key" ON "Course"("stripeProductId");
