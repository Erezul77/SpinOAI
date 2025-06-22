type ChatMessage = {
  role: string;
  content: string;
};

export async function saveSession(messages: ChatMessage[], userId = "demo-user") {
  try {
    const sessionData = {
      userId,
      messages,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, "sessions"), sessionData);
  } catch (error) {
    console.error("Error saving session:", error);
  }
}
