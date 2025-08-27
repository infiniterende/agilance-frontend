"use server";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const doctors = await prisma.doctor.findMany();
  console.log(doctors);
  return NextResponse.json(doctors);
}

type DoctorProps = {
  name: string;
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, specialty } = body;

  try {
    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        password,
        specialty,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
