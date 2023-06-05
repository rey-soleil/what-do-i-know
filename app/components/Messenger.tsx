"use client";

import { getResponse, getSummary } from "@/utils/fetch-openai-data";
import {
  addFirstMessageToFirestore,
  addMessagesToFirestore,
} from "@/utils/firestore";
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
  isDialogOpen: boolean;
  name: string;
};

export default function Messenger({
  setSummary,
  isDialogOpen,
  name,
}: MessengerProps) {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([
    { role: ChatCompletionResponseMessageRoleEnum.Assistant, content: "" },
  ]);
  const [firestoreId, setFirestoreId] = useState<string>("");

  async function fetchFirstMessage() {
    // Get the first message from openai
    const url = `/api/chat?name=${encodeURIComponent(name)}`;
    const response: CreateChatCompletionResponse = await fetch(url)
      .then((response) => response.json())
      .catch((error) => console.log(error));
    const message = response.choices[0].message!;
    setMessages([message]);

    // Add the first message to firestore
    const firestoreReponse = await addFirstMessageToFirestore(message, name);
    setFirestoreId(firestoreReponse.id);
  }

  // TODO: refactor this so it's broken up into smaller functions
  useEffect(() => {
    if (isDialogOpen) return;
    fetchFirstMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

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

    await getResponse(newMessages)
      .then((message) => {
        setMessages(() => {
          newMessages[newMessages.length - 1] = message;
          return newMessages;
        });
      })
      .catch((messageError) => {
        console.error(messageError);
      });

    await addMessagesToFirestore(newMessages, firestoreId);

    await getSummary(newMessages)
      .then((summary) => {
        setSummary(summary);
      })
      .catch((summaryError) => {
        console.error(summaryError);
      });
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-light-red outline">
      <ChatHistory messages={messages} setMessages={setMessages} />
      <UserInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        onSubmit={onSubmit}
      />
    </div>
  );
}
