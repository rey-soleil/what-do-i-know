import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { ChatCompletionResponseMessage } from "openai";
import { useState } from "react";

enum FeedbackType {
  Positive,
  Negative,
}

type Feedback = {
  type: FeedbackType;
  explanation?: string;
};

export type FeedbackProps = {
  message: ChatCompletionResponseMessage;
};

export default function Feedback({ message }: FeedbackProps) {
  const [feedback, setFeedback] = useState<Feedback | null>();

  if (message.content === "") return <></>;

  function givePositiveFeedback() {
    // TODO: toast "Thanks for the positive feedback!"
    setFeedback({ type: FeedbackType.Positive });
    // TODO: send feedback to firestore
  }

  function giveNegativeFeedback() {
    // TODO: open negative feedback dialog
    setFeedback({ type: FeedbackType.Negative });
    // TODO: send feedback to firestore
  }

  return (
    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 transform bg-cornsilk outline">
      {!feedback && (
        <>
          <button onClick={givePositiveFeedback}>
            <ThumbUpOutlinedIcon />
          </button>
          <button onClick={giveNegativeFeedback}>
            <ThumbDownOutlinedIcon />
          </button>
        </>
      )}
      {feedback?.type === FeedbackType.Positive && <ThumbUpIcon />}
      {feedback?.type === FeedbackType.Negative && <ThumbDownIcon />}
    </div>
  );
}
