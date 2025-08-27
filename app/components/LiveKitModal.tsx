import React, { useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import VoiceMode from "./VoiceMode";
import "../styles/VoiceAgent.css";

type LiveKitModalProps = {
  setShowSupport: Dispatch<SetStateAction<boolean>>;
};

const LiveKitModal = ({ setShowSupport }: LiveKitModalProps) => {
  const [isSubmittingName, setIsSubmittingName] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  console.log(process.env.NEXT_PUBLIC_API_URL);
  const getToken = useCallback(async (userName: string) => {
    try {
      console.log("run");
      const response = await fetch(
        `http://localhost:8000/getToken?name=${encodeURIComponent(userName)}`
      );
      const data = await response.json();
      const token = data.token;
      setToken(token);
      setIsSubmittingName(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      getToken(name);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="support-room">
          {isSubmittingName ? (
            <form onSubmit={handleNameSubmit} className="name-form">
              <h2 className="text-xl">
                Enter your name to connect with Triage
              </h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              <button type="submit">Connect</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowSupport(false)}
              >
                Cancel
              </button>
            </form>
          ) : token ? (
            <LiveKitRoom
              serverUrl={process.env.NEXT_PUBLIC_API_URL}
              token={token}
              connect={true}
              video={false}
              audio={true}
              onDisconnected={() => {
                setShowSupport(false);
                setIsSubmittingName(true);
              }}
            >
              <RoomAudioRenderer />
              <VoiceMode name={name} />
            </LiveKitRoom>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LiveKitModal;
