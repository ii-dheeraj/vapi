export interface IConversation {
  conversation_id: string;
  conversation_url: string;
}

export const createConversation = async (
  token: string,
  options?: {
    persona_id?: string;
    custom_greeting?: string;
    conversational_context?: string;
  }
): Promise<IConversation> => {
  const payload = {
    persona_id: options?.persona_id || "pd43ffef",
    custom_greeting: options?.custom_greeting || "Hey there! I'm your AI interview assistant. Let's get started!",
    conversational_context: options?.conversational_context || "You are an AI interview assistant helping with technical interviews."
  };

  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const endConversation = async (
  token: string,
  conversationId: string,
) => {
  try {
    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/end`,
      {
        method: "POST",
        headers: {
          "x-api-key": token,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to end conversation");
    }

    return null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
