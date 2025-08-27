// // components/LiveKitVoice.tsx
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Room,
//   RoomEvent,
//   Track,
//   RemoteTrack,
//   RemoteAudioTrack,
//   LocalAudioTrack,
//   AudioCaptureOptions,
//   RoomOptions,
//   VideoCaptureOptions,
//   createLocalAudioTrack,
// } from "livekit-client";
// import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

// interface LiveKitVoiceProps {
//   serverUrl: string;
//   token: string;
//   onTranscript?: (transcript: string) => void;
//   onConnect?: () => void;
//   onDisconnect?: () => void;
// }

// export const LiveKitVoice: React.FC<LiveKitVoiceProps> = ({
//   serverUrl,
//   token,
//   onTranscript,
//   onConnect,
//   onDisconnect,
// }) => {
//   const [room, setRoom] = useState<Room | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   //   const connectToRoom = useCallback(async () => {
//   //     try {
//   //       setConnectionError(null);
//   //       const roomInstance = new Room();

//   //       roomInstance.on(RoomEvent.Connected, () => {
//   //         console.log("Connected to LiveKit room");
//   //         setIsConnected(true);
//   //         onConnect?.();
//   //       });

//   //       roomInstance.on(RoomEvent.Disconnected, () => {
//   //         console.log("Disconnected from LiveKit room");
//   //         setIsConnected(false);
//   //         onDisconnect?.();
//   //       });

//   //       roomInstance.on(
//   //         RoomEvent.TrackSubscribed,
//   //         (
//   //           track: RemoteTrack,
//   //           publication: RemoteTrackPublication,
//   //           participant: RemoteParticipant
//   //         ) => {
//   //           if (track.kind === "audio") {
//   //             // Handle incoming audio track
//   //             const audioElement = track.attach();
//   //             document.body.appendChild(audioElement);
//   //           }
//   //         }
//   //       );

//   // Connect with audio enabled
//   //   const connectOptions: ConnectOptions = {
//   //     autoSubscribe: true,
//   //   };

//   //   await roomInstance.connect(serverUrl, token, connectOptions);

//   //   // Enable microphone
//   //   await roomInstance.localParticipant.enableCameraAndMicrophone(
//   //     false,
//   //     true
//   //   );

//   //       setRoom(roomInstance);
//   //     } catch (error) {
//   //       console.error("Failed to connect to LiveKit room:", error);
//   //       setConnectionError(
//   //         error instanceof Error ? error.message : "Connection failed"
//   //       );
//   //     }
//   //   }, [serverUrl, token, onConnect, onDisconnect]);

//   const [participants, setParticipants] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   //   const recognitionRef = useRef<SpeechRecognition | null>(null);
//   const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const transcriptionIdRef = useRef(0);

//   // Connect to LiveKit room
//   const connectToRoom = useCallback(async () => {
//     try {
//       const newRoom = new Room({
//         adaptiveStream: true,
//         dynacast: true,
//       } as RoomOptions);

//       // Set up event listeners
//       newRoom.on(RoomEvent.Connected, () => {
//         console.log("Connected to room");
//         setIsConnected(true);
//         setError(null);
//       });

//       newRoom.on(RoomEvent.Disconnected, () => {
//         console.log("Disconnected from room");
//         setIsConnected(false);
//       });

//       newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
//         console.log("Participant connected:", participant.identity);
//         setParticipants((prev) => [...prev, participant.identity]);
//       });

//       newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
//         console.log("Participant disconnected:", participant.identity);
//         setParticipants((prev) =>
//           prev.filter((p) => p !== participant.identity)
//         );
//       });

//       newRoom.on(
//         RoomEvent.TrackSubscribed,
//         (track, publication, participant) => {
//           if (track.kind === Track.Kind.Audio) {
//             const audioTrack = track as RemoteAudioTrack;
//             const audioElement = audioTrack.attach();
//             document.body.appendChild(audioElement);

//             // Start transcribing remote audio (this would require additional setup)
//             console.log(
//               "Remote audio track subscribed from:",
//               participant.identity
//             );
//           }
//         }
//       );

//       newRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
//         track.detach();
//       });

//       // Connect to the room
//       await newRoom.connect(serverUrl, token);
//       setRoom(newRoom);

//       // Create and publish local audio track
//       const audioTrack = await createLocalAudioTrack({
//         echoCancellation: true,
//         noiseSuppression: true,
//         autoGainControl: true,
//       } as AudioCaptureOptions);

//       localAudioTrackRef.current = audioTrack;
//       await newRoom.localParticipant.publishTrack(audioTrack);
//     } catch (err) {
//       console.error("Failed to connect to room:", err);
//       setError(
//         `Failed to connect: ${
//           err instanceof Error ? err.message : "Unknown error"
//         }`
//       );
//     }
//   }, [serverUrl, token]);

//   const disconnectFromRoom = useCallback(() => {
//     if (room) {
//       room.disconnect();
//       setRoom(null);
//       setIsConnected(false);
//     }
//   }, [room]);

//   //   const toggleMute = useCallback(async () => {
//   //     if (room && room.localParticipant) {
//   //       if (isMuted) {
//   //         await room.localParticipant.unmuteMicrophone();
//   //       } else {
//   //         await room.localParticipant.muteMicrophone();
//   //       }
//   //       setIsMuted(!isMuted);
//   //     }
//   //   }, [room, isMuted]);

//   useEffect(() => {
//     return () => {
//       if (room) {
//         room.disconnect();
//       }
//     };
//   }, [room]);

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         LiveKit Voice Session
//       </h3>

//       {connectionError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//           <p className="text-red-800">Connection Error: {connectionError}</p>
//         </div>
//       )}

//       <div className="flex items-center space-x-4">
//         {!isConnected ? (
//           <button
//             onClick={connectToRoom}
//             className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Phone size={20} className="mr-2" />
//             Connect
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={disconnectFromRoom}
//               className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               <PhoneOff size={20} className="mr-2" />
//               Disconnect
//             </button>

//             <button
//               //   onClick={toggleMute}
//               className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
//                 isMuted
//                   ? "bg-gray-600 text-white hover:bg-gray-700"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               {isMuted ? (
//                 <>
//                   <MicOff size={20} className="mr-2" />
//                   Unmute
//                 </>
//               ) : (
//                 <>
//                   <Mic size={20} className="mr-2" />
//                   Mute
//                 </>
//               )}
//             </button>
//           </>
//         )}

//         {isConnected && (
//           <div className="flex items-center text-green-600">
//             <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse mr-2"></div>
//             Connected
//           </div>
//         )}
//       </div>

//       {isConnected && (
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <p className="text-blue-800 text-sm">
//             Voice session is active. Speak naturally to provide your medical
//             information.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };
