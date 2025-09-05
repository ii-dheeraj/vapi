"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [room, setRoom] = useState("demo");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.trim()) return;
    window.location.assign(`/interview/${encodeURIComponent(room.trim())}`);
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Run structured technical interviews with an AI Avatar
          </h1>
          <p className="mt-3 text-white/70">
            LiveKit + Tavus + Google. Low-latency voice, expressive avatar, and a guided interview flow.
          </p>
        </div>

        <div className="card p-6">
          <form className="flex flex-col md:flex-row gap-3" onSubmit={go}>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name (e.g., demo)"
              className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" className="btn-primary">Start Interview</button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/70">
            <Link className="hover:text-white transition-colors" href="/interview/demo">Try demo</Link>
            <span>•</span>
            <Link className="hover:text-white transition-colors" href="/interview/interview-room">Sample room</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
