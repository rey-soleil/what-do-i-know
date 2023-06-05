import { CreateChatCompletionResponse } from "openai";
import { addFirstMessageToFirestore } from "./firestore";

export async function fetchFirstMessage() {
  try {
    const start = Date.now();
    const response: CreateChatCompletionResponse = await fetch(
      `/api/chat`
    ).then((response) => response.json());
    const message = response.choices[0].message!;
    const end = Date.now();
    const responseTime = (end - start) / 1000;

    const firestoreReponse = await addFirstMessageToFirestore(message, responseTime);
    const firestoreId = firestoreReponse.id;
    return { message, firestoreId };
  } catch (error) {
    console.error(error);
  }
  return { message: null, firestoreId: null };
}
