import {
  ChatCompletionResponseMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `Please summarize everything we've discussed in one or two words
each. Please split each topic with the pipe (|). There should be no more topics
than there were user messages, and if you have nothing to summarize, just 
return "".`;

export async function POST(request: Request) {
  const { messages } = await request.json();
  if (!messages) return new Response("No messages", { status: 400 });
  if (!configuration.apiKey) return new Response("No API key", { status: 500 });

  let messagesWithPrompt = [
    ...messages,
    {
      role: ChatCompletionResponseMessageRoleEnum.System,
      content: PROMPT,
    },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.0,
      messages: messagesWithPrompt,
    });

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
