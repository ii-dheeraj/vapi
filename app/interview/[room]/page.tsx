"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import "@livekit/components-styles";
import { LiveKitRoom, VideoTrack, RoomAudioRenderer, StartAudio, useTracks, TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { Track } from "livekit-client";

async function fetchToken(roomName: string, userName: string) {
  try {
    const res = await fetch("/api/livekit-token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Request-ID": (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) },
      body: JSON.stringify({ roomName, userName }),
    });
    
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to fetch token: ${error}`);
    }
    
    const data = await res.json();
    return { token: data.token, wsUrl: data.wsUrl };
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

function AvatarPane() {
  // Subscribe to remote video tracks (avatar may publish as Camera or ScreenShare)
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
  const remoteTracks = tracks.filter((t) => {
    // Prefer non-local participants
    // TrackReferenceOrPlaceholder has participant with isLocal in livekit types; fallback if unknown
    const isLocal = (t as any)?.participant?.isLocal;
    return isLocal === undefined ? true : !isLocal;
  });
  const primary: TrackReferenceOrPlaceholder | undefined = remoteTracks[0] ?? tracks[0];
  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center">
      {primary ? (
        <VideoTrack trackRef={primary} className="w-full h-full object-cover" />
      ) : (
        <p className="text-white/80 text-sm">Connecting avatar…</p>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const [token, setToken] = useState<string>("");
  const [wsUrl, setWsUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { room } = useParams<{ room: string }>();
  const roomName = room as string;
  // Generate a stable userName only once
  const [userName] = useState(() => "user-" + Math.random().toString(36).substring(2, 9));

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!roomName || fetchedRef.current) return;
    fetchedRef.current = true;
    const connect = async () => {
      try {
        const result = await fetchToken(roomName, userName);
        setToken(result.token);
        setWsUrl(result.wsUrl);
      } catch (err) {
        console.error("Connection error:", err);
        setError("Failed to connect to the room. Please try again.");
      }
    };
    connect();
  }, [roomName, userName]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Connecting to room...</div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={wsUrl}
      connect={true}
      video={false}
      audio={{
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }}
      className="flex flex-col h-screen"
    >
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Interview with AI Avatar</h1>
            <p className="text-sm text-white/60">Room: <span className="font-mono">{roomName}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => window.location.assign('/')}>Exit</button>
            <StartAudio label="Click to allow audio" />
          </div>
        </div>

        <div className="card p-3">
          <AvatarPane />
        </div>

        <RoomAudioRenderer />
        <p className="text-sm text-white/70 text-center">Your mic is live—speak naturally. You can interrupt; the avatar will yield and continue.</p>
      </div>
    </LiveKitRoom>
  );
}
