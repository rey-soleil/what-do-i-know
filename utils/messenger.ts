import {
  ChatCompletionResponseMessage,
  CreateChatCompletionResponse,
} from "openai";
import { addFirstMessageToFirestore } from "./firestore";

// This function fetches Ezra's first message
export async function fetchFirstMessage() {
  try {
    const start = Date.now();
    const response: CreateChatCompletionResponse = await fetch(
      `/api/chat`
    ).then((response) => response.json());
    const message = response.choices[0].message!;
    const end = Date.now();
    const responseTime = (end - start) / 1000;

    const firestoreResponse = await addFirstMessageToFirestore(
      message,
      responseTime
    );
    const firestoreId = firestoreResponse.id;
    return { message, firestoreId };
  } catch (error) {
    console.error(error);
  }
  return { message: null, firestoreId: null };
}

// This function fetches Ezra's response to the user's message
export async function fetchResponse(messages: ChatCompletionResponseMessage[]) {
  try {
    const data = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    }).then((data) => data.json());
    const response = data.choices[0].message!;
    return response;
  } catch (error) {
    console.error(error);
  }
  return "";
}
