// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync("prisma/patients.json", "utf8"));

  for (const patient of data) {
    console.log(patient.probability);
    await prisma.patient.create({
      data: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone_number: patient.phone_number,
        pain_quality: patient.pain_quality,
        location: patient.location,
        stress: patient.stress,
        sob: patient.sob,
        hypertension: patient.hypertension,
        diabetes: patient.diabetes,
        hyperlipidemia: patient.hyperlipidemia,
        smoking: patient.smoking,
        probability: patient.probability,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeding complete.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
