"use client";

import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
} from "openai";
import { useEffect, useRef, useState } from "react";
import TypewriterComponent from "typewriter-effect";
import Feedback from "./Feedback";

type ChatHistoryProps = {
  messages: ChatCompletionResponseMessage[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatCompletionResponseMessage[]>
  >;
};

/*
 * This component is responsible for rendering the chat history.
 * It is a scrollable div that contains the messages.
 */
export default function ChatHistory({
  messages,
  setMessages,
}: ChatHistoryProps) {
  const [isPositiveFeedbackModalOpen, setIsPositiveFeedbackModalOpen] =
    useState(false);

  const messengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messengerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex h-screen flex-col overflow-y-scroll"
      id="messenger"
      ref={messengerRef}
    >
      {messages?.map((message, index) => (
        <div
          key={index}
          className={`flex w-full p-4 ${
            message?.role === ChatCompletionResponseMessageRoleEnum.User &&
            "justify-end"
          }`}
        >
          {message?.role ===
            ChatCompletionResponseMessageRoleEnum.Assistant && (
            <div className="relative max-w-[90%] bg-cornsilk p-2 font-mono font-medium outline">
              <TypewriterComponent
                options={{
                  strings: message.content,
                  autoStart: true,
                  delay: 0,
                }}
              />
              <Feedback message={message} />
            </div>
          )}
          {message?.role === ChatCompletionResponseMessageRoleEnum.User && (
            <div className="max-w-[90%] bg-orange-yellow p-2 font-mono font-medium outline">
              {message.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
