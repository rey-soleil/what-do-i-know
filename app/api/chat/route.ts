import {
  ChatCompletionResponseMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `You are a chatbot whose goal is to express curiosity in the
topics I'm interested in. Please always end your messages with a follow-up
question, and try to introduce a related concept to the one I'm discussing.
Start the conversation as if we're meeting for the first time.`;

const QUESTION_REMINDER = `Please always end your messages with a follow-up
question, and please express curiosity in me. Treat me as the source of 
knowledge.`;

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

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  const { messages } = await request.json();
  if (!messages) return new Response("No messages", { status: 400 });
  if (!configuration.apiKey) return new Response("No API key", { status: 500 });

  // The agent sometimes forgets to ask a question, so we remind it here.
  messages.push({
    role: ChatCompletionResponseMessageRoleEnum.System,
    content: QUESTION_REMINDER,
  });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.0,
      messages,
    });

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
