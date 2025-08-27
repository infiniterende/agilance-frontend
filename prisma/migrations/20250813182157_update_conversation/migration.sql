/*
  Warnings:

  - You are about to drop the column `conversation_history` on the `ChatSession` table. All the data in the column will be lost.
  - You are about to drop the column `responses` on the `ChatSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ChatSession" DROP COLUMN "conversation_history",
DROP COLUMN "responses";

-- CreateTable
CREATE TABLE "public"."Response" (
    "id" TEXT NOT NULL,
    "question_id" TEXT,
    "answer" TEXT,
    "chatSessionId" TEXT,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "role" "public"."MessageType",
    "content" TEXT,
    "chatSessionId" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Response" ADD CONSTRAINT "Response_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
