"use server";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { start_chat } from "@/lib/openai";

export async function POST(request: NextRequest) {
  const session = await start_chat();

  return NextResponse.json(session);
}
