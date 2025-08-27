/*
  Warnings:

  - Added the required column `responses` to the `ChatSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChatSession" ADD COLUMN     "responses" JSONB NOT NULL;
