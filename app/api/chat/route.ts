import firebase_app from "@/utils/firebase-config";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
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
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.0,
      messages: [
        {
          role: ChatCompletionResponseMessageRoleEnum.System,
          content: PROMPT,
        },
      ],
    });

    await addMessagesToFirestore([completion.data.choices[0].message!]);

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
  const { messages } = await request.json();
  if (!messages) return new Response("No messages", { status: 400 });
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

    await addMessagesToFirestore([
      // Remove the last message, which is the question reminder.
      ...messages.slice(0, -1),
      completion.data.choices[0].message,
    ]);

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

async function addMessagesToFirestore(
  messages: ChatCompletionResponseMessage[]
) {
  const messagesCollection = collection(db, "messages");
  return await addDoc(messagesCollection, { messages, timestamp: Date.now() });
}
