import { ChatCompletionResponseMessage } from "openai";
import TypewriterComponent from "typewriter-effect";
import Feedback from "./Feedback";

type EzraMessageProps = {
  message?: ChatCompletionResponseMessage;
};

/*
 * This component renders Ezra's unique messages, which use the typewriter
 * component to simulate typing. If no message is passed in (as in when we're
 * fetching Ezra's message), then we just show the typing cursor.
 */
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
