"use client";

import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
  CreateChatCompletionResponse,
} from "openai";
import { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import UserInput from "./UserInput";

export default function Messenger() {
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let newMessages = [
      ...messages,
      {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: userMessage,
      },
    ];
    setMessages(newMessages);
    setUserMessage("");

    const response: CreateChatCompletionResponse = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessages }),
    }).then((response) => response.json());
    const message = response.choices[0].message!;
    newMessages = [...newMessages, message];
    setMessages(newMessages);
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden outline md:w-[700px]">
      <ChatHistory messages={messages} setMessages={setMessages} />
      <UserInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        onSubmit={onSubmit}
      />
    </div>
  );
}
