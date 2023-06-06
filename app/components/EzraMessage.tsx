import { ChatCompletionResponseMessage } from "openai";
import TypewriterComponent from "typewriter-effect";
import Feedback from "./Feedback";

type EzraMessageProps = {
  message?: ChatCompletionResponseMessage;
};

export default function EzraMessage({ message }: EzraMessageProps) {
  return (
    <div className="relative max-w-[90%] bg-cornsilk p-2 font-mono font-medium outline">
      <TypewriterComponent
        options={{
          strings: message?.content || "",
          autoStart: true,
          delay: 0,
        }}
      />
      {message && <Feedback message={message} />}
    </div>
  );
}
