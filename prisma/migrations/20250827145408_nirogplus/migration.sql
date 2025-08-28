/*
  Warnings:

  - You are about to drop the column `device` on the `SupportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `issue` on the `SupportRequest` table. All the data in the column will be lost.
  - Added the required column `doctor` to the `SupportRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `SupportRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SupportRequest" DROP COLUMN "device",
DROP COLUMN "issue",
ADD COLUMN     "doctor" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;
