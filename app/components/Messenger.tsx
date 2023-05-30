"use client";

import { getAgentResponse, getAgentSummary } from "@/utils/fetch-openai-data";
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

  async function onSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    let newMessages = [
      ...messages,
      {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: userMessage,
      },
      {
        role: ChatCompletionResponseMessageRoleEnum.Assistant,
        content: "",
      },
    ];
    setMessages(newMessages);
    setUserMessage("");

    Promise.all([getAgentResponse(newMessages), getAgentSummary(newMessages)])
      .then(([message, summary]) => {
        setMessages(() => {
          newMessages[newMessages.length - 1] = message;
          return newMessages;
        });
        setSummary(summary);
      })
      .catch(([messageError, summaryError]) => {
        console.log(messageError);
        console.log(summaryError);
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
