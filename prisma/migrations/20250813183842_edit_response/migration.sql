/*
  Warnings:

  - The `question_id` column on the `Response` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Response" DROP COLUMN "question_id",
ADD COLUMN     "question_id" INTEGER;
