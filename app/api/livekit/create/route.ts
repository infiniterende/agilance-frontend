// // app/api/livekit/create/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { createRoom } from "@/lib/livekit";

// import prisma from "@/prisma/client";

// export async function POST(req: NextRequest) {
//   const { patientId } = await req.json();

//   const patient = await prisma.patient.findUnique({
//     where: { id: patientId },
//     include: { doctor: true },
//   });
//   if (!patient) throw new Error("Patient not found");

//   const roomName = `patient-${patientId}-${Date.now()}`;

//   try {
//     const room = await createRoom(roomName);

//     const voiceSession = await prisma.voiceSession.create({
//       data: {
//         patientId,
//         livekitSessionId: room.sid,
//         livekitRoomName: roomName,
//       },
//     });
//     return NextResponse.json({ voiceSession });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
