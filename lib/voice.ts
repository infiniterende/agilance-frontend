// // api/assessment.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '@/lib/prisma';
// import { calculateRiskScore } from '@/lib/riskCalculation';
// import { AssessmentResponse } from '@/types';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { responses, patientData } = req.body;

//       // Calculate risk score
//       const riskScore = calculateRiskScore(responses as AssessmentResponse);

//       // Extract medical information from responses
//       const medicalInfo = extractMedicalInfo(responses);

//       // Create or update patient
//       const patient = await prisma.patient.create({
//         data: {
//           name: patientData.name || responses.name || 'Unknown',
//           age: parseInt(responses.age) || 0,
//           gender: responses.sex || 'Unknown',
//           phone: responses.phone_number || '',
//           painQuality: medicalInfo.painQuality,
//           painLocation: medicalInfo.painLocation,
//           stress: medicalInfo.stress,
//           shortnessOfBreath: medicalInfo.shortnessOfBreath,
//           hypertension: medicalInfo.hypertension,
//           diabetesMellitus: medicalInfo.diabetes,
//           hyperlipidemia: medicalInfo.hyperlipidemia,
//           smoking: medicalInfo.smoking,
//           probabilityScore: riskScore / 100,
//           chiefComplaint: medicalInfo.chiefComplaint,
//         },
//       });

//       res.status(200).json({
//         success: true,
//         patient,
//         riskScore,
//         riskLevel: getRiskLevel(riskScore),
//       });
//     } catch (error) {
//       console.error('Assessment API Error:', error);
//       res.status(500).json({ error: 'Failed to process assessment' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// function extractMedicalInfo(responses: AssessmentResponse) {
//   const painTypes = ['sharp', 'crushing', 'squeezing', 'pressure', 'burning', 'dull'];
//   const painQuality = painTypes.find(type =>
//     String(responses.pain_type || '').toLowerCase().includes(type)
//   ) || '';

//   const locationKeywords = ['arm', 'jaw', 'neck', 'back', 'shoulder', 'chest'];
//   const painLocation = locationKeywords.find(loc =>
//     String(responses.location || '').toLowerCase().includes(loc)
//   ) || '';

//   const riskFactorsText = String(responses.risk_factors || '').toLowerCase();
//   const associatedText = String(responses.associated_symptoms || '').toLowerCase();
//   const triggerText = String(responses.trigger || '').toLowerCase();

//   return {
//     painQuality,
//     painLocation,
//     stress: triggerText.includes('stress') || triggerText.includes('anxiety'),
//     shortnessOfBreath: associatedText.includes('shortness') || associatedText.includes('breath'),
//     hypertension: riskFactorsText.includes('pressure'),
//     diabetes: riskFactorsText.includes('diabetes'),
//     hyperlipidemia: riskFactorsText.includes('cholesterol'),
//     smoking: riskFactorsText.includes('smoking'),
//     chiefComplaint: `Chest pain - ${painQuality} ${painLocation}`.trim(),
//   };
// }

// function getRiskLevel(score: number): string {
//   if (score >= 80) return 'High';
//   if (score >= 50) return 'Moderate';
//   if (score >= 20) return 'Low';
//   return 'Very Low';
// }

// // api/voice/session.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '@/lib/prisma';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { patientId } = req.body;

//       if (!patientId) {
//         return res.status(400).json({ error: 'Patient ID is required' });
//       }

//       // Create voice session
//       const voiceSession = await prisma.voiceSession.create({
//         data: {
//           patientId,
//           livekitRoomName: `assessment-${patientId}-${Date.now()}`,
//         },
//       });

//       res.status(200).json({
//         sessionId: voiceSession.id,
//         roomName: voiceSession.livekitRoomName,
//       });
//     } catch (error) {
//       console.error('Voice session creation error:', error);
//       res.status(500).json({ error: 'Failed to create voice session' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// // api/voice/process.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '@/lib/prisma';
// import { getOpenAIResponse } from '@/lib/openai';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { sessionId, transcript } = req.body;

//       if (!sessionId || !transcript) {
//         return res.status(400).json({ error: 'Session ID and transcript required' });
//       }

//       // Process transcript with AI
//       const aiAnalysis = await getOpenAIResponse([
//         { role: 'user', content: transcript }
//       ]);

//       // Update voice session
//       const updatedSession = await prisma.voiceSession.update({
//         where: { id: sessionId },
//         data: {
//           transcript,
//           aiAnalysis,
//           confidenceScore: 0.8, // Placeholder confidence score
//         },
//       });

//       res.status(200).json({
//         success: true,
//         analysis: aiAnalysis,
//         session: updatedSession,
//       });
//     } catch (error) {
//       console.error('Voice processing error:', error);
//       res.status(500).json({ error: 'Failed to process voice data' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// // components/VoiceAssessment.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, MicOff, Play, Pause } from 'lucide-react';

// interface VoiceAssessmentProps {
//   onTranscript: (transcript: string) => void;
//   isActive: boolean;
//   currentQuestion: string;
// }

// const VoiceAssessment: React.FC<VoiceAssessmentProps> = ({
//   onTranscript,
//   isActive,
//   currentQuestion
// }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [isSupported, setIsSupported] = useState(false);
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
//       setIsSupported(true);
//       const SpeechRecognition = (window as any).webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();

//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event: any) => {
//         let finalTranscript = '';
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           }
//         }

//         if (finalTranscript) {
//           setTranscript(prev => prev + ' ' + finalTranscript);
//           onTranscript(finalTranscript);
//         }
//       };

//       recognitionRef.current.onerror = (event: any) => {
//         console.error('Speech recognition error:', event.error);
//         setIsRecording(false);
//       };
//     }
//   }, [onTranscript]);

//   const startRecording = () => {
//     if (recognitionRef.current && isSupported) {
//       recognitionRef.current.start();
//       setIsRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   if (!isSupported) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//         <p className="text-yellow-800">
//           Voice recognition is not supported in your browser. Please use the text input instead.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Assessment</h3>
//         <p className="text-gray-600 mb-4">{currentQuestion}</p>
//       </div>

//       <div className="flex items-center space-x-4">
//         <button
//           onClick={isRecording ? stopRecording : startRecording}
//           disabled={!isActive}
//           className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
//             isRecording
//               ? 'bg-red-600 text-white hover:bg-red-700'
//               : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
//           }`}
//         >
//           {isRecording ? (
//             <>
//               <MicOff size={20} className="mr-2" />
//               Stop Recording
//             </>
//           ) : (
//             <>
//               <Mic size={20} className="mr-2" />
//               Start Recording
//             </>
//           )}
//         </button>

//         {isRecording && (
//           <div className="flex items-center text-red-600">
//             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
//             Recording...
//           </div>
//         )}
//       </div>

//       {transcript && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//           <h4 className="font-medium text-gray-800 mb-2">Transcript:</h4>
//           <p className="text-gray-700">{transcript}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VoiceAssessment;

// // components/AssessmentForm.tsx
// import React, { useState } from 'react';
// import { ASSESSMENT_QUESTIONS } from '@/lib/assessmentQuestions';
// import VoiceAssessment from './VoiceAssessment';

// const AssessmentForm: React.FC = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [responses, setResponses] = useState<Record<string, string>>({});
//   const [isVoiceMode, setIsVoiceMode] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [results, setResults] = useState<any>(null);

//   const handleResponse = (questionId: string, value: string) => {
//     setResponses(prev => ({
//       ...prev,
//       [questionId]: value
//     }));
//   };

//   const handleVoiceTranscript = (transcript: string) => {
//     const questionId = ASSESSMENT_QUESTIONS[currentQuestion].id;
//     handleResponse(questionId, transcript);
//   };

//   const nextQuestion = () => {
//     if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     } else {
//       submitAssessment();
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const submitAssessment = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch('/api/assessment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           responses,
//           patientData: {
//             name: responses.name,
//             phone: responses.phone_number,
//           }
//         }),
//       });

//       const result = await response.json();
//       setResults(result);
//     } catch (error) {
//       console.error('Error submitting assessment:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (results) {
//     return (
//       <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessment Results</h2>

//         <div className="space-y-4">
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h3 className="font-semibold text-blue-800">Risk Score</h3>
//             <p className="text-2xl font-bold text-blue-600">{results.riskScore.toFixed(1)}%</p>
//             <p className="text-blue-700">Risk Level: {results.riskLevel}</p>
//           </div>

//           <div className="p-4 bg-gray-50 rounded-lg">
//             <h3 className="font-semibold text-gray-800">Patient Information</h3>
//             <p><strong>Name:</strong> {results.patient.name}</p>
//             <p><strong>Age:</strong> {results.patient.age}</p>
//             <p><strong>Gender:</strong> {results.patient.gender}</p>
//           </div>

//           <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//             <h3 className="font-semibold text-yellow-800">Important Note</h3>
//             <p className="text-yellow-700">
//               This is a preliminary assessment. Please consult with a healthcare professional
//               for proper medical evaluation and treatment.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const question = ASSESSMENT_QUESTIONS[currentQuestion];
//   const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm text-gray-600">
//             Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
//           </span>
//           <button
//             onClick={() => setIsVoiceMode(!isVoiceMode)}
//             className="text-sm text-blue-600 hover:text-blue-800"
//           >
//             {isVoiceMode ? 'Switch to Text' : 'Switch to Voice'}
//           </button>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       </div>

//       {isVoiceMode ? (
//         <VoiceAssessment
//           onTranscript={handleVoiceTranscript}
//           isActive={true}
//           currentQuestion={question.question}
//         />
//       ) : (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             {question.question}
//           </h3>

//           {question.type === 'number' ? (
//             <input
//               type="number"
//               value={responses[question.id] || ''}
//               onChange={(e) => handleResponse(question.id, e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your age"
//             />
//           ) : (
//             <textarea
//               value={responses[question.id] || ''}
//               onChange={(e) => handleResponse(question.id, e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
//               placeholder="Enter your response..."
//             />
//           )}
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={prevQuestion}
//           disabled={currentQuestion === 0}
//           className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>

//         <button
//           onClick={nextQuestion}
//           disabled={!responses[question.id] || isSubmitting}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {currentQuestion === ASSESSMENT_QUESTIONS.length - 1
//             ? (isSubmitting ? 'Submitting...' : 'Submit Assessment')
//             : 'Next'
//           }
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AssessmentForm;

// // pages/assessment.tsx
// import React from 'react';
// import Head from 'next/head';
// import AssessmentForm from '@/components/AssessmentForm';

// const AssessmentPage: React.FC = () => {
//   return (
//     <>
//       <Head>
//         <title>Medical Assessment - Chest Pain Evaluation</title>
//         <meta name="description" content="AI-powered medical assessment for chest pain evaluation" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>

//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               Medical Assessment
//             </h1>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               This AI-powered assessment will help evaluate your chest pain symptoms.
//               Please answer all questions honestly and thoroughly. This is not a substitute
//               for professional medical care.
//             </p>
//           </div>

//           <AssessmentForm />
//         </div>
//       </div>
//     </>
//   );
// };
