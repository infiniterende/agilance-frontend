"use server";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const patients = await prisma.patient.findMany();
  console.log(patients);
  return NextResponse.json(patients);
}
