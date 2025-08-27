-- AlterTable
ALTER TABLE "public"."Patient" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- RenameIndex
ALTER INDEX "public"."ix_doctors_email" RENAME TO "Doctor_email_key";
