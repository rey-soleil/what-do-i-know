import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";

// This function fetches Ezra's response to the user's message.
// It retries up to 3 times if there is an error.
export async function getResponse(messages: ChatCompletionResponseMessage[]) {
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

      const message = agentResponse.choices[0].message!;
      return message;
    } catch (error) {
      console.error(`Error querying the API: ${error}`);
      retryCount++;
      await sleep(1000); // Wait for 1 second before retrying
    }
  }
  return {
    content:
      "Sorry, I'm having some trouble understanding. Could you say that again?",
    role: ChatCompletionResponseMessageRoleEnum.Assistant,
  };
}

export async function getSummary(messages: ChatCompletionResponseMessage[]) {
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
    return "Keep talking to Ezra to build up this mind map!";
  }

  throw new Error(`Max retry limit exceeded. Unable to get agent summary.`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
