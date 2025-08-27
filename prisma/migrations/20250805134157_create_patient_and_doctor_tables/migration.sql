-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100),
    "gender" VARCHAR(100),
    "age" INTEGER NOT NULL,
    "phone_number" VARCHAR(100),
    "pain_quality" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "stress" BOOLEAN NOT NULL,
    "sob" BOOLEAN NOT NULL,
    "hypertension" BOOLEAN NOT NULL,
    "diabetes" BOOLEAN NOT NULL,
    "hyperlipidemia" BOOLEAN NOT NULL,
    "smoking" BOOLEAN NOT NULL,
    "probability" INTEGER NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "hashed_password" VARCHAR NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ix_patients_id" ON "public"."Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ix_doctors_email" ON "public"."Doctor"("email");

-- CreateIndex
CREATE INDEX "ix_doctors_id" ON "public"."Doctor"("id");
