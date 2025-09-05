import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, conversationId } = await req.json();
    const apiKey = process.env.TAVUS_API_KEY;
    const personaId = "p0f105b5b82e";

    console.log("API Key exists:", !!apiKey);
    console.log("Persona ID:", personaId);
    console.log("Action:", action);

    if (!apiKey) {
      console.error("Tavus API key not configured");
      return NextResponse.json(
        { error: 'Tavus API key not configured' },
        { status: 500 }
      );
    }

    if (action === 'create') {
      const payload = {
        persona_id: personaId,
        custom_greeting: "Hey there! I'm your AI interview assistant. Let's get started with your interview!",
        conversational_context: "You are conducting a technical interview. Ask relevant questions and provide helpful feedback."
      };

      console.log("Making request to Tavus API with payload:", payload);

      const response = await fetch("https://tavusapi.com/v2/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      console.log("Tavus API response status:", response.status);
      
      if (!response?.ok) {
        const errorText = await response.text();
        console.error("Tavus API error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log("Tavus API success response:", data);
      return NextResponse.json(data);
    }

    if (action === 'end' && conversationId) {
      console.log("Ending conversation:", conversationId);
      
      const response = await fetch(
        `https://tavusapi.com/v2/conversations/${conversationId}/end`,
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
          },
        }
      );

      console.log("End conversation response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to end conversation:", errorText);
        throw new Error(`Failed to end conversation: ${response.status} - ${errorText}`);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error("Tavus API error:", error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
