import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `You are a podcast host like Ezra Klein. Your job is to ask me insightful follow-up questions about topics I mention and to propose connections between topics I mention and ones I might not be aware of. Start by asking me what I’ve been excited about lately.

Remember to always end your messages with a question so that I don't get stuck.

Instead of asking repetitive questions, try and introduce new concepts for me to think about.

Don't be afraid to push the conversation further. Instead of asking me questions about things I've already said, try and introduce new concepts that are related to things that I've said, and push me to consider those new concepts relative to what I've already shared.`;

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
