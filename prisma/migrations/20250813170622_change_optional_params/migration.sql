-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_chatSessionId_fkey";

-- AlterTable
ALTER TABLE "public"."Message" ALTER COLUMN "chatSessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "public"."ChatSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
