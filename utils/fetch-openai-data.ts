import {
  ChatCompletionResponseMessage,
  CreateChatCompletionResponse,
} from "openai";

export async function getAgentResponse(
  messages: ChatCompletionResponseMessage[]
) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const agentResponse: CreateChatCompletionResponse = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        }
      ).then((response) => response.json());

      throw new Error(
        `Max retry limit exceeded. Unable to get agent response.`
      );

      const message = agentResponse.choices[0].message!;
      return message;
    } catch (error) {
      console.error(`Error querying the API: ${error}`);
      retryCount++;
      await sleep(1000); // Wait for 1 second before retrying
    }
  }

  throw new Error(`Max retry limit exceeded. Unable to get agent response.`);
}

export async function getAgentSummary(
  messages: ChatCompletionResponseMessage[]
) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
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
    } catch (error) {
      console.error(`Error querying the API: ${error}`);
      retryCount++;
      await sleep(1000); // Wait for 1 second before retrying
    }
  }

  throw new Error(`Max retry limit exceeded. Unable to get agent summary.`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
