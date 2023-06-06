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
  const [userInput, setUserInput] = useState<string>("");
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

  // Note(06/06/23): I want to decompose this function, but it relies on so many
  // state variables that passing them around as arguments would probably make
  // the code less readable. Maybe when I learn more about Context it'll be
  // easier.
  async function submitUserInput(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    // Update messages to include userInput
    const userMessage = {
      role: ChatCompletionResponseMessageRoleEnum.User,
      content: userInput,
    };
    let messagesWithUserInput = [...messages, userMessage];
    setMessages(messagesWithUserInput);
    setUserInput("");

    // Fetch Ezra's response to the user
    setIsLoadingResponse(true);
    const start = Date.now();
    const response = await fetchResponse(messagesWithUserInput);
    const responseTime = (Date.now() - start) / 1000;
    setIsLoadingResponse(false);

    // Update messages to include Ezra's response
    setMessages([...messagesWithUserInput, response]);

    // Append userInput and Ezra's response to firestore
    await addMessagesToFirestore(
      [userMessage, response],
      firestoreId,
      responseTime
    );
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-light-red outline">
      <ChatHistory messages={messages} isLoadingResponse={isLoadingResponse} />
      <UserInput
        userInput={userInput}
        setUserInput={setUserInput}
        submitUserInput={submitUserInput}
        isLoadingResponse={isLoadingResponse}
      />
    </div>
  );
}
