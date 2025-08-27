// hooks/useVoiceSession.ts
import { useState, useCallback } from "react";

interface VoiceSessionData {
  sessionId: string;
  roomName: string;
  token?: string;
}

interface UseVoiceSessionReturn {
  sessionData: VoiceSessionData | null;
  isLoading: boolean;
  error: string | null;
  createSession: (patientId: string) => Promise<void>;
  processTranscript: (transcript: string) => Promise<void>;
  endSession: () => Promise<void>;
}

export const useVoiceSession = (): UseVoiceSessionReturn => {
  const [sessionData, setSessionData] = useState<VoiceSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/voice/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create voice session");
      }

      const data = await response.json();
      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processTranscript = useCallback(
    async (transcript: string) => {
      if (!sessionData) {
        setError("No active session");
        return;
      }

      try {
        const response = await fetch("/api/voice/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionData.sessionId,
            transcript,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process transcript");
        }

        const result = await response.json();
        console.log("Transcript processed:", result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Processing error");
      }
    },
    [sessionData]
  );

  const endSession = useCallback(async () => {
    if (!sessionData) return;

    try {
      await fetch(`/api/voice/session/${sessionData.sessionId}/end`, {
        method: "PUT",
      });
      setSessionData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end session");
    }
  }, [sessionData]);

  return {
    sessionData,
    isLoading,
    error,
    createSession,
    processTranscript,
    endSession,
  };
};
