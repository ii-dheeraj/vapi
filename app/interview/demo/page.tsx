"use client";
import React, { useState, useEffect } from "react";
import Avatar from "../../../components/Avatar";

export default function DemoInterviewPage() {
  const [conversation, setConversation] = useState<{
    conversation_id: string;
    conversation_url: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("Starting conversation request...");
      
      const response = await fetch("/api/tavus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create" }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.details || errorData.error || "Failed to create conversation");
      }

      const conv = await response.json();
      console.log("Conversation created:", conv);
      setConversation(conv);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to start conversation: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const stopConversation = async () => {
    if (conversation) {
      try {
        await fetch("/api/tavus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "end", 
            conversationId: conversation.conversation_id 
          }),
        });
      } catch (err) {
        console.error("Failed to end conversation:", err);
      }
    }
    setConversation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Starting Interview</h2>
          <p className="text-gray-400">Connecting to your AI avatar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-6 bg-red-900/20 rounded-2xl border border-red-700">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-200">Connection Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={startConversation}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (conversation) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold">Interview with AI Avatar</h1>
            <p className="text-sm text-white/60">Conversation ID: <span className="font-mono">{conversation.conversation_id}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => window.location.assign('/')}>Home</button>
            <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={stopConversation}>End Interview</button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-black">
            <Avatar 
              conversationUrl={conversation.conversation_url} 
              onLeave={stopConversation}
            />
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-sm text-white/70">Your mic is live—speak naturally. You can interrupt; the avatar will yield and continue.</p>
        </div>
      </div>
    );
  }

  return null;
}
