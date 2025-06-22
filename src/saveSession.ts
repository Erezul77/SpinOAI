import { collection, addDoc, Timestamp } from "firebase/firestore"; // ✅ Make sure Timestamp is here
import { db } from "./firebaseConfig";

type ChatMessage = {
  role: string;
  content: string;
};

export async function saveSession(messages: ChatMessage[], userId = "demo-user") {
  try {
    const sessionData = {
      userId,
      messages,
      createdAt: Timestamp.now(), // ✅ Now Timestamp is defined
    };
    await addDoc(collection(db, "sessions"), sessionData);
  } catch (error) {
    console.error("Error saving session:", error);
  }
}
