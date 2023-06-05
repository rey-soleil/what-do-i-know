"use client";

import { addMessagesToFirestore } from "@/utils/firestore";
import { fetchFirstMessage, fetchResponse } from "@/utils/messenger";
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
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([]);
  const [firestoreId, setFirestoreId] = useState<string>("");
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(true);

  useEffect(() => {
    fetchFirstMessage().then(({ message, firestoreId }) => {
      message && setMessages([message]);
      firestoreId && setFirestoreId(firestoreId);
      setIsLoadingResponse(false);
    });
  }, []);

  // TODO: refactor this so it's broken up into smaller functions
  async function submitUserMessage(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    let messagesWithUserInput = [
      ...messages,
      {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: userMessage,
      },
    ];
    setMessages(messagesWithUserInput);
    setUserMessage("");

    setIsLoadingResponse(true);
    const start = Date.now();
    const response = await fetchResponse(messagesWithUserInput);
    const responseTime = Date.now() - start;
    setIsLoadingResponse(false);

    const messagesWithBoth = [...messagesWithUserInput, response];
    setMessages([...messagesWithUserInput, response]);

    await addMessagesToFirestore(
      messagesWithBoth.slice(-2),
      firestoreId,
      responseTime
    );
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-light-red outline">
      <ChatHistory messages={messages} isLoadingResponse={isLoadingResponse} />
      <UserInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        submitUserMessage={submitUserMessage}
        isLoadingResponse={isLoadingResponse}
      />
    </div>
  );
}
