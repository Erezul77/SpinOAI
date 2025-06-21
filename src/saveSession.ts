
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function saveSession(messages, userId = "demo-user") {
  try {
    const sessionData = {
      userId,
      messages,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "sessions"), sessionData);
    console.log("✅ Session saved with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Error saving session:", e);
  }
}
