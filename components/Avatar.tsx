import React, { useCallback, useEffect, useState } from "react";
import {
  DailyAudio,
  DailyVideo,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
} from "@daily-co/daily-react";

interface AvatarProps {
  conversationUrl: string;
  onLeave?: () => void;
}

export default function Avatar({ conversationUrl, onLeave }: AvatarProps) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (remoteParticipantIds.length && !start) {
      setStart(true);
      setTimeout(() => daily?.setLocalAudio(true), 4000);
    }
  }, [remoteParticipantIds, start, daily]);

  useEffect(() => {
    if (!conversationUrl) return;
    
    daily
      ?.join({
        url: conversationUrl,
        startVideoOff: false,
        startAudioOff: true,
      })
      .then(() => {
        daily?.setLocalVideo(true);
        daily?.setLocalAudio(false);
      });

    return () => {
      daily?.leave();
      daily?.destroy();
    };
  }, [conversationUrl, daily]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const leaveConversation = useCallback(() => {
    daily?.leave();
    daily?.destroy();
    onLeave?.();
  }, [daily, onLeave]);

  return (
    <div className="relative w-full h-full">
      {remoteParticipantIds?.length > 0 ? (
        <>
          <DailyVideo
            automirror
            sessionId={remoteParticipantIds[0]}
            type="video"
            className="w-full h-full object-cover"
          />
        </>
      ) : (
        <div className="flex h-full items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-white/80 text-sm">Connecting avatar…</p>
          </div>
        </div>
      )}
      
      {localSessionId && (
        <div className="absolute bottom-4 right-4 aspect-video h-32 w-20 overflow-hidden rounded-lg border-2 border-blue-400 shadow-lg bg-black">
          <DailyVideo
            automirror
            sessionId={localSessionId}
            type="video"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={toggleAudio}
          className="p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600"
        >
          {isMicEnabled ? "🎤" : "🔇"}
        </button>
        <button
          onClick={toggleVideo}
          className="p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600"
        >
          {isCameraEnabled ? "📹" : "📷"}
        </button>
        <button
          onClick={leaveConversation}
          className="p-3 rounded-full bg-red-600/80 hover:bg-red-500/80 text-white border border-red-500"
        >
          📞
        </button>
      </div>
      
      <DailyAudio />
    </div>
  );
}
