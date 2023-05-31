import firebase_app from "@/utils/firebase-config";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const db = getFirestore(firebase_app);
const auth = getAuth(firebase_app);

const PROMPT = `You are a chatbot named Ezra whose goal is to express 
curiosity in the topics I'm interested in. Please always end your messages with
a follow-up question, and try to introduce a related concept to the one I'm 
discussing. Start the conversation as if we're meeting for the first time.`;

const QUESTION_REMINDER = `Please always end your messages with a follow-up
question, and please express curiosity in me. Treat me as the source of 
knowledge.`;

/*
 * This function is called when the user first opens the chatbot.
 * It sends a prompt to OpenAI's API, which returns a response.
 * The response is then sent to the user.
 * The response is also saved to Firestore.
 */
export async function GET(request: Request) {
  if (!configuration.apiKey) return new Response("No API key", { status: 500 });

  try {
    const name = new URL(request.url).searchParams.get("name") || undefined;
    const content = `${PROMPT} ${name ? `My name is ${name}.` : ""}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.0,
      messages: [
        {
          role: ChatCompletionResponseMessageRoleEnum.System,
          content,
        },
      ],
      user: name,
    });

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

/*
 * This function is called when the user sends a message to the chatbot.
 * The message is sent to OpenAI's API, which returns a response.
 * The response is then sent to the user.
 * The message and response are also saved to Firestore.
 */
export async function POST(request: Request) {
  const { messages, firestoreId } = await request.json();
  if (!messages) return new Response("No messages", { status: 400 });
  if (!firestoreId) return new Response("No id", { status: 400 });
  if (!configuration.apiKey) return new Response("No API key", { status: 500 });

  // The agent sometimes forgets to ask a question, so we remind it here.
  messages[messages.length - 1] = {
    role: ChatCompletionResponseMessageRoleEnum.System,
    content: QUESTION_REMINDER,
  };

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.0,
      messages,
    });

    addMessagesToFirestore(
      [
        // Remove the last message, which is the question reminder.
        ...messages.slice(0, -1),
        completion.data.choices[0].message,
      ],
      firestoreId
    );

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

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

async function addMessagesToFirestore(
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
