import { FeedbackType } from "@/app/components/Feedback";
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
  responseTime: number
) {
  const time = new Date().toLocaleString();
  const messages = [{ ...message, responseTime, time }];
  const conversationsCollection = collection(db, "conversations");
  return await addDoc(conversationsCollection, {
    messages,
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
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export async function addFeedbackToFirestore(
  message: ChatCompletionResponseMessage,
  feedback: FeedbackType
) {
  const feedbackCollection = collection(db, "feedback");
  return await addDoc(feedbackCollection, {
    message,
    feedback,
    timestamp: Date.now(),
  });
}
