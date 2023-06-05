"use client";

import { getResponse, getSummary } from "@/utils/fetch-openai-data";
import { addMessagesToFirestore } from "@/utils/firestore";
import { fetchFirstMessage } from "@/utils/messenger";
import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
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

  useEffect(() => {
    fetchFirstMessage().then(({ message, firestoreId }) => {
      message && setMessages([message]);
      firestoreId && setFirestoreId(firestoreId);
    });
  }, []);

  // TODO: refactor this so it's broken up into smaller functions
  async function submitUserMessage(event?: React.FormEvent<HTMLFormElement>) {
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
        submitUserMessage={submitUserMessage}
      />
    </div>
  );
}
