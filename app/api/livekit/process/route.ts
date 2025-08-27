// // app/api/livekit/create/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { createRoom } from "@/lib/livekit";

// import prisma from "@/prisma/client";

//   async processVoiceTranscript(sessionId: number, transcript: string) {
//     const session = await prisma.voiceSession.findUnique({
//       where: { id: sessionId },
//       include: { patient: true }
//     });

//     if (!session) throw new Error('Voice session not found');

//     return updatedSession;
//   }
