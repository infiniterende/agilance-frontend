// // lib/livekit.ts
// import { RoomServiceClient } from "livekit-server-sdk";
// import prisma from "./prisma";
// import { OpenAI } from "openai";

// const apiKey = process.env.LIVEKIT_API_KEY!;
// const apiSecret = process.env.LIVEKIT_API_SECRET!;
// const livekitHost = process.env.LIVEKIT_HOST!; // e.g. 'https://your-livekit-url.com'

// export const roomService = new RoomServiceClient(
//   livekitHost,
//   apiKey,
//   apiSecret
// );

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // ensure this is in your .env.local
// });

// export async function createRoom(roomName: string) {
//   const room = await roomService.createRoom({
//     name: roomName,
//     emptyTimeout: 300, // seconds
//     maxParticipants: 2,
//   });

//   return room;
// }

// export async function processVoiceTranscript(
//   sessionId: string,
//   transcript: string
// ) {
//   const session = await prisma.voiceSession.findUnique({
//     where: { id: sessionId },
//     include: { patient: true },
//   });

//   if (!session) throw new Error("Voice session not found");

//   const medicalExtraction = await extractMedicalInfo(transcript);

//   const updatedSession = await prisma.voiceSession.update({
//     where: { id: sessionId },
//     data: {
//       transcript,
//       extractedSymptoms: JSON.stringify(medicalExtraction.symptoms),
//       extractedPainInfo: JSON.stringify(medicalExtraction.painInfo),
//       aiAnalysis: medicalExtraction.analysis,
//       confidenceScore: medicalExtraction.confidence,
//     },
//   });

//   await updatePatientFromVoice(session.patientId, medicalExtraction);
//   return updatedSession;
// }

// const ASSESSMENT_QUESTIONS = [
//   {
//     id: "age",
//     question: "What is your age?",
//     type: "number",
//     scoring: { "under 45": 0, "45-65": 1, "over 65": 2 },
//   },
//   {
//     id: "sex",
//     question: "Do you classify as male or female?",
//     type: "text",
//     scoring: { male: 1, female: 0 },
//   },
//   {
//     id: "pain_type",
//     question:
//       "How would you describe your chest pain? Sharp, stabbing pain, Crushing, squeezing, or pressure-like, Burning sensation, Dull ache",
//     type: "multiple_choice",
//     scoring: {
//       A: 1,
//       B: 1,
//       C: 1,
//       D: 1,
//       sharp: 1,
//       crushing: 1,
//       squeezing: 1,
//       pressure: 1,
//       burning: 1,
//       dull: 1,
//     },
//   },
//   {
//     id: "location",
//     question:
//       " Does the pain spread to other areas? If yes, where? (Examples: left arm, jaw, neck, back, both arms)",
//     type: "text",
//     scoring: {
//       center: 1,
//       substernal: 1,
//       left: 1,
//       pressure: 1,
//       squeezing: 1,
//       tightness: 1,
//       heavy: 1,
//       radiate: 1,
//       arm: 1,
//       jaw: 1,
//       neck: 1,
//       back: 1,
//       shoulder: 1,
//       stomach: 1,
//     },
//   },
//   {
//     id: "trigger",
//     question:
//       "Does the pain come on with physical activity or emotional stress? For example when climbing stiars or walking uphill?",
//     type: "text",
//     scoring: {
//       exercise: 1,
//       exertion: 1,
//       walking: 1,
//       hurry: 1,
//       uphill: 1,
//       "physical activity": 1,
//       stress: 1,
//       anxiety: 1,
//     },
//   },
//   {
//     id: "associated_symptoms",
//     question:
//       "Are you experiencing any of these symptoms along with chest pain? (You can mention multiple)\n- Shortness of breath\n- Nausea or vomiting\n- Sweating\n- Dizziness\n- Rapid heartbeat",
//     type: "text",
//     scoring: {
//       shortness: 1,
//       breath: 1,
//       nausea: 1,
//       vomiting: 1,
//       sweating: 1,
//       dizziness: 1,
//       rapid: 1,
//       heartbeat: 1,
//     },
//   },
//   {
//     id: "relief",
//     question: "Does the chest pain go away with rest or nitroglycerin?",
//     type: "text",
//     scoring: {
//       rest: 1,
//       nitro: 1,
//       "goes away in a few minutes": 1,
//       "better after resting": 1,
//     },
//   },
//   {
//     id: "risk_factors",
//     question:
//       "Do you have any of these risk factors? (You can mention multiple)\n- High blood pressure\n- Diabetes\n- High cholesterol\n- Smoking history\n- Family history of heart disease\n- Previous heart problems",
//     type: "text",
//     scoring: {
//       pressure: 1,
//       diabetes: 1,
//       cholesterol: 1,
//       smoking: 1,
//     },
//   },
//   {
//     id: "name",
//     question: "What is your name?",
//     type: "text",
//     scoring: { name: 1 },
//   },
//   {
//     id: "phone_number",
//     question: "What is your phone number?",
//     type: "text",
//     scoring: { phone_number: 1 },
//   },
// ];

// export async function extractMedicalInfo(transcript: string) {
//   try {
//     let currentQuestionIndex = 0;

//     let messages = [
//       {
//         role: "system",
//         content:
//           "You are a medical assistant AI. You will ask the patient one predefined chest pain assessment question at a time. After each answer, ask the next question. If all questions are done, say 'Thank you, I have all the information I need for now.' Do not add extra commentary.",
//       },
//     ];
//     async function askNextQuestion(userInput) {
//       // If user answered something, store it
//       if (userInput) {
//         messages.push({ role: "user", content: userInput });
//         currentQuestionIndex++;
//       }

//       const response = await openai.chat.completions.create({
//         model: "gpt-4",
//         messages: messages,
//         temperature: 0.1,
//       });

//       const aiMessage = response.choices[0].message.content;

//       // Check if we're done
//       if (currentQuestionIndex >= ASSESSMENT_QUESTIONS.length) {
//         const closingMessage =
//           "Thank you, I have all the information I need for now.";
//         messages.push({ role: "assistant", content: closingMessage });
//         return closingMessage;
//       }

//       // Next question
//       const nextQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex].question;

//       // Store and return
//       messages.push({ role: "assistant", content: nextQuestion });
//       return nextQuestion;
//     }

//     return JSON.parse(response.choices[0].message.content || "{}");
//   } catch (error) {
//     console.error("Error extracting medical info:", error);
//     return {
//       symptoms: [],
//       painInfo: {},
//       medicalHistory: [],
//       medications: [],
//       lifestyle: {},
//       vitalSigns: {},
//       analysis: "Extraction failed",
//       confidence: 0,
//       riskScore: 0,
//     };
//   }
// }

// export async function updatePatientFromVoice(
//   patientId: string,
//   extractedData: any
// ) {
//   const updateData: any = {};

//   if (extractedData.painInfo?.quality)
//     updateData.painQuality = extractedData.painInfo.quality;
//   if (extractedData.painInfo?.location)
//     updateData.painLocation = extractedData.painInfo.location;
//   if (extractedData.lifestyle?.smoking !== undefined)
//     updateData.smoking = extractedData.lifestyle.smoking;
//   if (extractedData.lifestyle?.stress !== undefined)
//     updateData.stress = extractedData.lifestyle.stress;
//   if (extractedData.vitalSigns?.shortnessOfBreath !== undefined)
//     updateData.shortnessOfBreath = extractedData.vitalSigns.shortnessOfBreath;
//   if (extractedData.riskScore)
//     updateData.probabilityScore = extractedData.riskScore;
//   if (extractedData.medicalHistory?.length)
//     updateData.medicalHistory = extractedData.medicalHistory.join(", ");
//   if (extractedData.medications?.length)
//     updateData.currentMedications = extractedData.medications.join(", ");
//   if (extractedData.symptoms?.length)
//     updateData.chiefComplaint = extractedData.symptoms.join(", ");

//   return prisma.patient.update({
//     where: { id: patientId },
//     data: updateData,
//   });
// }

// export async function endVoiceSession(sessionId: string) {
//   const session = await prisma.voiceSession.findUnique({
//     where: { id: sessionId },
//   });
//   if (!session) throw new Error("Voice session not found");

//   if (session.livekitRoomName) {
//     await livekit.deleteRoom({ room: session.livekitRoomName });
//   }

//   return prisma.voiceSession.update({
//     where: { id: sessionId },
//     data: { sessionEnd: new Date() },
//   });
// }
