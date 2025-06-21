
export function generateSessionSummary(messages) {
  const assistantMessages = messages.filter(msg => msg.role === "assistant");
  const userMessages = messages.filter(msg => msg.role === "user");

  const summary = {
    totalExchanges: messages.length,
    assistantCount: assistantMessages.length,
    userCount: userMessages.length,
    keywords: [...new Set(messages.map(m => m.content.toLowerCase().split(/\s+/)).flat())].slice(0, 20)
  };

  return summary;
}
