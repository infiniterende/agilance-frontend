/*
  Warnings:

  - You are about to alter the column `probability` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "probability" SET DATA TYPE INTEGER;
