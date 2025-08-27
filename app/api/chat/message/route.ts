"use server";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { process_message, start_chat } from "@/lib/openai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("b", body);
  const { session_id, message } = body;

  const response = await process_message(session_id, message);

  return NextResponse.json(response);
}
