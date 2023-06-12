import { ChatCompletionResponseMessage } from "openai";
import { useState } from "react";
import {
  default as Typewriter,
  default as TypewriterComponent,
} from "typewriter-effect";
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
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="relative max-w-[90%] bg-cornsilk p-2 font-mono font-medium outline">
      {!message && <TypewriterComponent />}
      {message && (
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .start()
              .changeDelay(10)
              .typeString(message?.content || "")
              .callFunction(() => {
                document.querySelector(".Typewriter__cursor")?.remove();
                setShowFeedback(true);
              });
          }}
        />
      )}
      {message && showFeedback && <Feedback message={message} />}
    </div>
  );
}
