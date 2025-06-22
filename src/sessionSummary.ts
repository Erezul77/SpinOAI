// src/sessionSummary.ts

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function generateSessionSummary(messages: ChatMessage[]) {
  const assistantMessages = messages.filter(msg => msg.role === "assistant");
  const userMessages = messages.filter(msg => msg.role === "user");

  const summary = {
    userCount: userMessages.length,
    assistantCount: assistantMessages.length,
    lastAssistantReply: assistantMessages[assistantMessages.length - 1]?.content || "",
  };

  return summary;
}
