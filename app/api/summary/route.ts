import {
  ChatCompletionResponseMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `You are going to extract all of the topics discussed in the preceding conversation and identify connections between them. For example, if we discussed apple, magenta, and orange, your output would take the form
{
  nodes: [
    {
      id: "node-1",
      data: {
        label: "apple",
      },
    },
    {
      id: "node-2",
      data: {
        label: "magenta",
      },
    },
    {
      id: "node-3",
      data: {
        label: "orange",
      },
    },
  ]
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      label: "fruits",
    },
    {
      id: "edge-2",
      source: "node-2",
      target: "node-3",
      label: "colors",
    }
  ]
}
You do not need to find edges between every node. In fact, only about 25% of node pairs should have edges between them. You should
ONLY return the nodes and edges object. Do not provide any supplementary information.
`;

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
      temperature: 0.5,
      messages: messagesWithPrompt,
    });

    return new Response(JSON.stringify(completion.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
