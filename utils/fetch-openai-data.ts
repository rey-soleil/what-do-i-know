import {
  ChatCompletionResponseMessage,
  CreateChatCompletionResponse,
} from "openai";

export async function getAgentResponse(
  messages: ChatCompletionResponseMessage[]
) {
  const agentResponse: CreateChatCompletionResponse = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  }).then((response) => response.json());

  const message = agentResponse.choices[0].message!;
  return message;
}

export async function getAgentSummary(
  messages: ChatCompletionResponseMessage[]
) {
  const agentResponse: CreateChatCompletionResponse = await fetch(
    "/api/summary",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    }
  ).then((response) => response.json());

  const summary = agentResponse.choices[0].message?.content!;
  return summary;
}
