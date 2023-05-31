"use client";

import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
} from "openai";
import { useEffect, useRef } from "react";
import TypewriterComponent from "typewriter-effect";

type ChatHistoryProps = {
  messages: ChatCompletionResponseMessage[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatCompletionResponseMessage[]>
  >;
};

export default function ChatHistory({
  messages,
  setMessages,
}: ChatHistoryProps) {
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
            <div className="w-max-2xl rounded-sm bg-slate-500 p-2 text-white">
              <TypewriterComponent
                options={{
                  strings: message.content,
                  autoStart: true,
                  delay: 0,
                }}
              />
            </div>
          )}
          {message?.role === ChatCompletionResponseMessageRoleEnum.User && (
            <div className="w-max-2xl rounded-sm bg-blue-500 p-2 text-white">
              {message.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
