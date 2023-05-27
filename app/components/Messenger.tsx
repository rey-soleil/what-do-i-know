"use client";

import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";
import { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import UserInput from "./UserInput";

type MessengerProps = {
  setSummary: React.Dispatch<React.SetStateAction<string>>;
};

export default function Messenger({ setSummary }: MessengerProps) {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([
    { role: ChatCompletionResponseMessageRoleEnum.Assistant, content: "" },
  ]);

  async function fetchFirstMessage() {
    const response: CreateChatCompletionResponse = await fetch("/api/chat")
      .then((response) => response.json())
      .catch((error) => console.log(error));
    const message = response.choices[0].message!;
    return message;
  }

  useEffect(() => {
    fetchFirstMessage().then((message) => setMessages([message]));
  }, []);

  async function getAgentResponse(messages: ChatCompletionResponseMessage[]) {
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
  }

  async function getAgentSummary(messages: ChatCompletionResponseMessage[]) {
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

  async function onSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    let newMessages = [
      ...messages,
      {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: userMessage,
      },
    ];
    setMessages(newMessages);
    setUserMessage("");

    Promise.all([
      getAgentResponse(newMessages),
      getAgentSummary(newMessages),
    ]).then(([message, summary]) => {
      setMessages([...newMessages, message]);
      setSummary(summary);
    });
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden outline">
      <ChatHistory messages={messages} setMessages={setMessages} />
      <UserInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        onSubmit={onSubmit}
      />
    </div>
  );
}
