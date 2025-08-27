// Frontend: Next.js Voice Agent Component
// components/VoiceAgent.tsx

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Phone, RotateCcw, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  riskScore?: number;
}

interface TriageResult {
  transcript: string;
  risk_score: number;
  risk_level: "low" | "medium" | "high" | "emergency";
  recommendation: string;
  next_question?: string;
  is_emergency: boolean;
}

export default function VoiceAgent() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRiskScore, setCurrentRiskScore] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [transcript, setTranscript] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize audio recording
  const initializeAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        processAudioWithWhisper();
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      addMessage(
        "Microphone access denied. Please allow microphone access to continue.",
        "agent"
      );
    }
  }, []);

  // Process audio with Whisper backend
  const processAudioWithWhisper = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsProcessing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      audioChunksRef.current = [];

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append(
        "conversation_context",
        JSON.stringify({
          messages: messages.slice(-5), // Send last 5 messages for context
          current_risk_score: currentRiskScore,
        })
      );

      const response = await fetch("/api/triage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: TriageResult = await response.json();

      // Add user message
      addMessage(result.transcript, "user");

      // Update risk score
      setCurrentRiskScore(result.risk_score);

      // Check for emergency
      if (result.is_emergency) {
        setIsEmergency(true);
      }

      // Add agent response
      addMessage(result.recommendation, "agent", result.risk_score);

      // Speak the response
      speakText(result.recommendation);

      // Ask next question if available
      if (result.next_question && !result.is_emergency) {
        setTimeout(() => {
          addMessage(result.next_question!, "agent");
          speakText(result.next_question!);
        }, 2000);
      }
    } catch (error) {
      console.error("Whisper processing error:", error);
      addMessage(
        "Sorry, I had trouble understanding that. Please try again.",
        "agent"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = volume;

      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") || voice.name.includes("Natural")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    }
  };

  // Add message to conversation
  const addMessage = (
    text: string,
    sender: "user" | "agent",
    riskScore?: number
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      riskScore,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Toggle recording
  const toggleRecording = async () => {
    if (!mediaRecorderRef.current) {
      await initializeAudioRecording();
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setCurrentRiskScore(0);
    setIsEmergency(false);
    addMessage(
      "Hello! I'm here to help assess your chest pain symptoms. Please describe what you're experiencing. Remember, if this is a medical emergency, call 911 immediately.",
      "agent"
    );
  };

  // Emergency call
  const handleEmergencyCall = () => {
    window.open("tel:911");
  };

  // Initialize component
  useEffect(() => {
    addMessage(
      "Hello! I'm here to help assess your chest pain symptoms using advanced AI speech recognition. Please describe what you're experiencing. Remember, if this is a medical emergency, call 911 immediately.",
      "agent"
    );
    speakText(
      "Hello! I'm here to help assess your chest pain symptoms. Please describe what you're experiencing."
    );
  }, []);

  // Risk level styling
  const getRiskLevelColor = (score: number) => {
    if (score >= 6) return "text-red-600 bg-red-100";
    if (score >= 4) return "text-orange-600 bg-orange-100";
    if (score >= 2) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏥 Medical Triage Voice Assistant
        </h1>
        <p className="text-gray-600">AI-Powered Chest Pain Assessment</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="text-yellow-600 mr-2 mt-1" size={20} />
          <div>
            <p className="text-yellow-800 text-sm">
              <strong>MEDICAL DISCLAIMER:</strong> This is for demonstration
              purposes only. In a real emergency, call 911 immediately. This
              tool does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      {isEmergency && (
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-2" size={24} />
              <div>
                <h3 className="text-red-800 font-bold">
                  🚨 SEEK IMMEDIATE MEDICAL ATTENTION
                </h3>
                <p className="text-red-700">
                  Based on your symptoms, please call 911 or go to the nearest
                  emergency room immediately.
                </p>
              </div>
            </div>
            <button
              onClick={handleEmergencyCall}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Phone size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Risk Score Display */}
      <div className="flex justify-center mb-6">
        <div
          className={`px-4 py-2 rounded-full ${getRiskLevelColor(
            currentRiskScore
          )}`}
        >
          <span className="font-semibold">Risk Score: {currentRiskScore}</span>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`w-32 h-32 rounded-full border-none text-white text-4xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : isProcessing
              ? "bg-yellow-500 animate-spin cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-1"
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin">⚙️</div>
          ) : isRecording ? (
            <MicOff />
          ) : (
            <Mic />
          )}
        </button>
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        <p
          className={`text-lg font-medium ${
            isRecording
              ? "text-red-600"
              : isProcessing
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {isRecording
            ? "🎤 Recording... Speak clearly"
            : isProcessing
            ? "🤖 Processing with AI..."
            : "📱 Click microphone to speak"}
        </p>
      </div>

      {/* Conversation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
        {transcript}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-100 ml-8 text-right"
                : "bg-white mr-8 border-l-4 border-purple-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-800">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.riskScore !== undefined && (
                <div
                  className={`ml-2 px-2 py-1 rounded text-xs ${getRiskLevelColor(
                    message.riskScore
                  )}`}
                >
                  Risk: {message.riskScore}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center mb-6">
        <label className="mr-2 text-gray-600">🔊 Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-32"
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={clearConversation}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} />
          Clear Chat
        </button>
        <button
          onClick={handleEmergencyCall}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Phone size={16} />
          🚨 Call 911
        </button>
      </div>
    </div>
  );
}
