/*
  Warnings:

  - Added the required column `password` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."doctors" ADD COLUMN     "password" TEXT NOT NULL;
