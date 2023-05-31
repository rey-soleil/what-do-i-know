import firebase_app from "@/utils/firebase-config";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { ChatCompletionResponseMessage } from "openai";
const db = getFirestore(firebase_app);
const auth = getAuth(firebase_app);

export async function addFirstMessageToFirestore(
  message: ChatCompletionResponseMessage,
  name?: string
) {
  const conversationsCollection = collection(db, "conversations");
  return await addDoc(conversationsCollection, {
    message,
    name,
    timestamp: Date.now(),
  });
}

export async function addMessagesToFirestore(
  messages: ChatCompletionResponseMessage[],
  firestoreId: string
) {
  const documentRef = doc(
    collection(db, "continuing_conversations"),
    firestoreId
  );
  try {
    await setDoc(
      documentRef,
      { messages, timestamp: Date.now() },
      { merge: true }
    );
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
