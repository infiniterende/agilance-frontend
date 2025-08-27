// import OpenAI from "openai";
// import { ASSESSMENT_QUESTIONS } from "./assessment_questions";
// import { Message, MessageType, Response, Conversation } from "@prisma/client";
// import { Chat, ChatCompletionMessageParam } from "openai/resources/index";
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// import { Prisma } from "@prisma/client";

// // Types
// interface Session {
//   id: string;
//   session_id: string;
//   current_question: number | null;
//   responses: Response[];
//   assessment_complete: boolean;
//   risk_score?: number;
//   risk_level?: string;
//   recommendation?: string;
//   messages?: Message[];
//   conversation_history?: Conversation[];
//   answers?: Record<string, string> | Prisma.JsonValue | null;
// }

// interface UserResponse {
//   message: string;
// }

// import prisma from "@/prisma/client";
// // import { calculateRiskScore } from "./calculate_risk_score";
// import { cadc_clinical_risk, classify_chest_pain } from "./calculate_score";

// const SYSTEM_PROMPT = `You are a professional medical AI assistant specializing in chest pain assessment. Your role is to:

// 1. Conduct a structured assessment through specific questions
// 2. Maintain a compassionate, professional tone
// 3. Prioritize patient safety and encourage appropriate care-seeking behavior
// 4. NEVER provide definitive medical diagnoses
// 5. Always emphasize that this is a preliminary assessment

// When asking assessment questions, be conversational but ensure you get the specific information needed for risk calculation. Ask one question at a time and acknowledge their previous response before moving to the next question.

// Current question number will be provided in the conversation context.
// Begin by welcoming the patient and introducing yourself and telling them you can help
//     assess their chest pain symptoms. Tell them if it is an emergency, tell them to call 911.
// `;

// export async function start_chat() {
//   const session_id = `session_${new Date()}`;

//   const initial_context = [
//     {
//       role: "user",
//       content:
//         "I'm experiencing chest pain and would like to get an assessment.",
//     },
//   ];

//   const welcome_response = await getOpenAIResponse(initial_context, {
//     question: ASSESSMENT_QUESTIONS[0]["question"],
//     type: ASSESSMENT_QUESTIONS[0]["type"],
//     number: 1,
//   });
//   console.log(welcome_response);
//   const newSession = await prisma.chatSession.create({
//     data: {
//       session_id: session_id,
//       messages: {
//         create: [
//           {
//             type: "assistant",
//             content: welcome_response,
//             timestamp: new Date(),
//           },
//         ],
//       },
//       current_question: 0,
//       responses: {},
//       risk_score: 0,
//       assessment_complete: false,
//       conversation_history: {
//         create: [
//           ...initial_context.map((c) => ({
//             role: c.role,
//             content: c.content,
//           })),
//           {
//             role: "assistant",
//             content: welcome_response,
//           },
//         ],
//       },
//     },
//   });

//   const session = await prisma.chatSession.findUnique({
//     where: {
//       id: newSession.id!,
//     },
//     include: {
//       messages: true,
//     },
//   });

//   return { session_id: session?.id, messages: session?.messages };
// }

// export async function process_message(
//   sessionId: string,
//   user_response: UserResponse
// ) {
//   const updatedSession = await prisma.chatSession.update({
//     where: { id: sessionId },
//     data: {
//       messages: {
//         create: {
//           type: "user",
//           content: user_response.message,
//         },
//       },
//       conversation_history: {
//         create: {
//           role: "user",
//           content: user_response.message,
//         },
//       },
//     },
//   });

//   // Step 2: Fetch updated session with relations
//   const session = await prisma.chatSession.findUnique({
//     where: { id: sessionId },
//     include: {
//       messages: true,
//       conversation_history: true,
//       responses: true,
//     },
//   });
//   if (!session) throw new Error("Session not found");

//   if (session.assessment_complete) {
//     const response = await getOpenAIResponse(
//       session.conversation_history,
//       undefined
//     );

//     const updatedSession = await prisma.chatSession.update({
//       where: {
//         id: sessionId,
//       },
//       data: {
//         messages: {
//           create: {
//             type: "assistant",
//             content: response,
//           },
//         },
//         conversation_history: {
//           create: {
//             role: "assistant",
//             content: response,
//           },
//         },
//       },
//     });

//     const newSession = await prisma.chatSession.findUnique({
//       where: { id: sessionId },
//       include: {
//         messages: true,
//         conversation_history: true,
//         responses: true,
//       },
//     });

//     if (!newSession) {
//       throw new Error("Session not found");
//     }

//     const messages = await handleUserResponse(newSession, user_response);
//     return { messages: newSession?.messages };
//   }

//   async function handleUserResponse(
//     session: Session,
//     user_response?: UserResponse
//   ) {
//     const questionIndex = session.current_question ?? 0;
//     const currentQuestion = ASSESSMENT_QUESTIONS[questionIndex];
//     session!.answers! = session.answers ?? {};
//     (session.answers as Record<string, string>)[currentQuestion.id] =
//       user_response?.message ?? "";
//     session!.current_question! += 1;
//     if (session.current_question! >= ASSESSMENT_QUESTIONS.length) {
//       // Complete assessment
//       session.assessment_complete = true;
//       session.risk_score = calculateRiskScore(session!.answers);

//       const { riskLevel, recommendation } = getRiskLevelAndRecommendation(
//         session.risk_score!
//       );

//       session.risk_level = riskLevel;
//       session.recommendation = recommendation;

//       const assessment_prompt = `The patient has completed the chest pain assessment. Here are their responses:
//     Risk Score: ${session.risk_score}
//     Risk Level : ${riskLevel}
//     Recommendation: ${recommendation}

//     Based on the conversation history, provide a comprehensive but concise summary of the assessmentand and emphasize the commendation. Be empathetic and clear about next steps.
//     `;

//       const msg = [
//         session.conversation_history,
//         { role: "user", content: assessment_prompt },
//       ];
//       const ai_response = await getOpenAIResponse(
//         session!.conversation_history!,
//         undefined
//       );

//       const updatedSession = await prisma.chatSession.update({
//         where: {
//           id: session!.id,
//         },
//         data: {
//           messages: {
//             create: {
//               type: "assistant",
//               content: ai_response,
//             },
//           },
//           conversation_history: {
//             create: {
//               role: "assistant",
//               content: ai_response,
//             },
//           },
//         },
//       });
//     } else {
//       const next_question_info = {
//         question: ASSESSMENT_QUESTIONS[session!.current_question!]["question"],
//         type: ASSESSMENT_QUESTIONS[session!.current_question!]["type"],
//         number: session!.current_question! + 1,
//       };

//       const ai_response = await getOpenAIResponse(
//         session.conversation_history!,
//         next_question_info
//       );

//       const updatedSession = await prisma.chatSession.update({
//         where: {
//           id: session!.id,
//         },
//         data: {
//           messages: {
//             create: {
//               type: "assistant",
//               content: ai_response,
//             },
//           },
//           conversation_history: {
//             create: {
//               role: "assistant",
//               content: ai_response,
//             },
//           },
//         },
//       });
//     }

//     return { messages: session.messages };
//   }

//   function getRiskLevelAndRecommendation(score: number): {
//     riskLevel: string;
//     recommendation: string;
//   } {
//     if (score > 0.15) {
//       return { riskLevel: "high", recommendation: "Go to the ER immediately." };
//     } else if (score > 0.05) {
//       return {
//         riskLevel: "medium",
//         recommendation: "Schedule a doctor visit.",
//       };
//     } else {
//       return { riskLevel: "low", recommendation: "Monitor symptoms at home." };
//     }
//   }

//   const answers = (session.answers as Record<string, string> | undefined) ?? {};
//   session.answers = answers as Prisma.JsonValue;

//   return handleUserResponse(session);
//   const questionIndex = session?.current_question || 0;

//   const isLastQuestion = questionIndex >= ASSESSMENT_QUESTIONS.length;
//   const current_question = ASSESSMENT_QUESTIONS[questionIndex];
//   console.log(current_question, "c");
//   // Step 3: Prepare filtered conversation for AI
//   const filteredConversation = session!.conversation_history.map(
//     ({ role, content }) => ({
//       role: role ?? undefined,
//       content: content ?? undefined,
//     })
//   );

//   //   let isComplete = false;
//   //   let riskScore: number | undefined;

//   //   // Step 4: If assessment complete
//   //   if (isLastQuestion) {
//   //     isComplete = true;

//   //     const variables = await extractVariablesFromConversation(
//   //       filteredConversation
//   //     );
//   //     const {
//   //       age,
//   //       male,
//   //       location,
//   //       trigger,
//   //       relief,
//   //       diabetes,
//   //       hypertension,
//   //       hyperlipidemia,
//   //       smoking,
//   //     } = variables;

//   //     const chest_pain_type =
//   //       classify_chest_pain({ location, trigger, relief }) ?? "atypical";

//   //     riskScore = cadc_clinical_risk({
//   //       age,
//   //       male,
//   //       chest_pain_type,
//   //       diabetes,
//   //       hypertension,
//   //       hyperlipidemia,
//   //       smoking,
//   //     });

//   //     // Save completion & risk score
//   //     await prisma.chatSession.update({
//   //       where: { id: session.id },
//   //       data: {
//   //         assessment_complete: true,
//   //         risk_score: riskScore,
//   //       },
//   //     });

//   //     // Save patient record
//   //     const patientData = await extractPatientDataFromConversation(
//   //       filteredConversation
//   //     );
//   //     await prisma.patient.create({
//   //       data: {
//   //         ...patientData,
//   //         probability: riskScore * 100,
//   //       },
//   //     });

//   //     const assessment_prompt = `
//   // The patient has completed the chest pain assessment.

//   // Risk Score: ${riskScore}
//   // Risk Level: HIGH if riskScore > 0.15, MEDIUM if 0.15 > riskScore > 0.05, LOW if riskScore < 0.05
//   // Recommendation: {recommendation}

//   // Based on the conversation history, provide a comprehensive but concise summary of the assessment and emphasize the recommendation. Be empathetic and clear about next steps.
//   //     `;

//   //     return;
//   //   } else {
//   //     // Step 5: Continue assessment
//   //     const next_question_info = {
//   //       question: ASSESSMENT_QUESTIONS[questionIndex].question,
//   //       type: ASSESSMENT_QUESTIONS[questionIndex].type,
//   //       number: questionIndex,
//   //     };

//   //     const ai_response = await getOpenAIResponse(
//   //       filteredConversation,
//   //       next_question_info
//   //     );

//   //     // Step 6: Save assistant's reply & response to question
//   //     await prisma.chatSession.update({
//   //       where: { id: sessionId },
//   //       data: {
//   //         messages: {
//   //           create: {
//   //             type: "assistant",
//   //             content: ai_response,
//   //           },
//   //         },
//   //         conversation_history: {
//   //           create: {
//   //             role: "assistant",
//   //             content: ai_response,
//   //           },
//   //         },
//   //         responses: {
//   //           create: {
//   //             question_id: questionIndex,
//   //             answer: user_response.message,
//   //           },
//   //         },
//   //         current_question: { increment: 1 },
//   //       },
//   //     });
//   //   }
//   //   const processedSession = await prisma.chatSession.findUnique({
//   //     where: {
//   //       id: sessionId,
//   //     },
//   //     include: {
//   //       messages: true,
//   //       conversation_history: true,
//   //     },
//   //   });

//   //   return { messages: processedSession?.messages };
// }

// export async function getOpenAIResponse(
//   messagesHistory: { role?: string | null; content?: string | null }[],
//   currentQuestionInfo?: {
//     question: string;
//     type: string;
//     number: number;
//   }
// ): Promise<string> {
//   try {
//     let systemMessage = SYSTEM_PROMPT;

//     if (currentQuestionInfo) {
//       systemMessage += `\n\nCURRENT QUESTION TO ASK: ${currentQuestionInfo.question}`;
//       systemMessage += `\nQUESTION TYPE: ${currentQuestionInfo.type}`;
//       systemMessage += `\nQUESTION NUMBER: ${currentQuestionInfo.number} of ${ASSESSMENT_QUESTIONS.length}`;
//     }
//     console.log(currentQuestionInfo);

//     const msgHistory: ChatCompletionMessageParam[] = messagesHistory.map(
//       ({ role, content }) => ({
//         role: (role ?? "user") as "system" | "user" | "assistant",
//         content: content ?? "",
//       })
//     );
//     let conversation: ChatCompletionMessageParam[] = [
//       {
//         role: "system",
//         content: systemMessage,
//       },
//     ];

//     conversation = [...conversation, ...msgHistory];

//     // Step 2: If we’re still in the questioning phase, add the next question verbatim
//     if (currentQuestionInfo) {
//       const questionText = `Question ${currentQuestionInfo.number} of ${ASSESSMENT_QUESTIONS.length}:\n${currentQuestionInfo.question}`;
//       conversation.push({
//         role: "assistant",
//         content: questionText, // <-- exact question string
//       });
//     }

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: conversation,
//       max_tokens: 300,
//       temperature: 0.7,
//       presence_penalty: 0.1,
//       frequency_penalty: 0.1,
//     });

//     return (
//       response.choices[0].message.content ||
//       "I'm sorry, I didn't receive a response."
//     );
//   } catch (error) {
//     console.error("OpenAI API Error:", error);
//     return "I'm experiencing technical difficulties. For immediate medical concerns, please contact your healthcare provider or call 911 if this is an emergency.";
//   }
// }

// export async function extractVariablesFromConversation(
//   conversationHistory: Conversation[]
// ) {
//   const prompt = `
//         You are a medical data extractor.
// From the conversation below, extract the following variables:

// - age: integer
// - male: 1 if male, 0 if female
// - location: 1 if any of these keywords
//      center: 1,
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
//     else location : 0
// - trigger: 1 if any of these keywords
// exercise: 1,
//       exertion: 1,
//       walking: 1,
//       hurry: 1,
//       uphill: 1,
//       physical activity: 1,
//       stress: 1,
//       anxiety: 1,
//     else trigger : 0
// - relief: 1 if any of these:
// rest: 1,
//       nitro: 1,
//       "goes away in a few minutes": 1,
//       "better after resting": 1,
//     else relief: 0
// - diabetes: 1 if has diabetes, else 0
// - hypertension: 1 if has hypertension, else 0
// - hyperlipidemia: 1 if has hyperlipidemia, else 0
// - smoking: 1 if smokes, else 0
// - name
// - phone_number

// Return ONLY valid JSON with these exact keys.

// Conversation:
// ${JSON.stringify(conversationHistory, null, 2)}
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini", // can use gpt-4o for better accuracy
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a strict JSON data extractor. Return only JSON. Extract structured variables as valid JSON only. Do not include code fences or explanations.",
//       },
//       { role: "user", content: prompt },
//     ],
//     temperature: 0,
//   });

//   let raw = response.choices[0].message?.content ?? "{}";

//   // 🔥 Remove Markdown fences if present
//   raw = raw
//     .trim()
//     .replace(/^```json/i, "")
//     .replace(/^```/, "")
//     .replace(/```$/, "")
//     .trim();

//   try {
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("Failed to parse JSON from OpenAI:", e);
//     return null;
//   }
// }

// export async function extractPatientDataFromConversation(
//   conversationHistory: Conversation[]
// ) {
//   const prompt = `
//         You are a medical data extractor.
// From the conversation below, extract the following variables:
// - name: string
// - age: integer
// - gender: string (male or female)
// - phone_number: string
// - pain_quality: string;
// - location: string (yes or no)
// - stress : string (yes or no)
// - sob: string (shortness of breath? yes or no)
// - hypertension: string (yes or no)
// - diabetes: string (yes or no)
// - hyperlipidemia: string (yes or no)
// - smoking: string (yes or no)

// Return ONLY valid JSON with these exact keys.

// Conversation:
// ${JSON.stringify(conversationHistory, null, 2)}
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini", // can use gpt-4o for better accuracy
//     messages: [
//       {
//         role: "system",
//         content: "You are a strict JSON data extractor. Return only JSON.",
//       },
//       { role: "user", content: prompt },
//     ],
//     temperature: 0,
//   });

//   try {
//     if (response.choices[0].message.content) {
//       return JSON.parse(response.choices[0].message.content);
//     }
//   } catch (e) {
//     console.error("Failed to parse JSON from OpenAI:", e);
//     return null;
//   }
// }
