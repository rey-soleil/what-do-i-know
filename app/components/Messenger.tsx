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

  // TODO: rename variables more clearly
  async function submitUserMessage(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    // Update messages to include userMessage
    const userMessageObj = {
      role: ChatCompletionResponseMessageRoleEnum.User,
      content: userMessage,
    };
    let messagesWithUserInput = [...messages, userMessageObj];
    setMessages(messagesWithUserInput);
    setUserMessage("");

    // Fetch Ezra's response to the user
    setIsLoadingResponse(true);
    const start = Date.now();
    const response = await fetchResponse(messagesWithUserInput);
    const responseTime = (Date.now() - start) / 1000;
    setIsLoadingResponse(false);

    // Update messages to include Ezra's response
    setMessages([...messagesWithUserInput, response]);

    // Append userMessage and Ezra's response to firestore
    await addMessagesToFirestore(
      [userMessageObj, response],
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
