/*
  Warnings:

  - The `role` column on the `Conversation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "role",
ADD COLUMN     "role" TEXT;
