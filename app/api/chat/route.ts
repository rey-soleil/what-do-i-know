import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT =
  "You are an editor helping me plan out my essay. Please ask me scoping \
  questions about what I want to write about and then follow-up questions on \
  subtopics I've mentioned. Also, start the chat as if we're meeting for the first time.";

export async function GET(request: Request) {
  if (!configuration.apiKey) return new Response("No API key", { status: 500 });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
      ],
      max_tokens: 150,
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

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages,
      max_tokens: 150,
    });

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
