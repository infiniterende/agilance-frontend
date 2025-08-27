/*
  Warnings:

  - Changed the type of `conversation_history` on the `ChatSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ChatSession" DROP COLUMN "conversation_history",
ADD COLUMN     "conversation_history" JSONB NOT NULL;
