import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { ChatCompletionResponseMessage } from "openai";
import { useState } from "react";
import FeedbackDialog from "./FeedbackDialog";

export enum FeedbackPolarity {
  Positive,
  Negative,
}

export type FeedbackType = {
  polarity: FeedbackPolarity;
  explanation?: string;
};

export type FeedbackProps = {
  message: ChatCompletionResponseMessage;
};

export default function Feedback({ message }: FeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  if (message.content === "") return <></>;

  function givePositiveFeedback() {
    setFeedback({ polarity: FeedbackPolarity.Positive });
    // TODO: toast "Thanks for the positive feedback!"
    // TODO: send feedback to firestore
  }

  function giveNegativeFeedback() {
    setFeedback({ polarity: FeedbackPolarity.Negative });
    setIsDialogOpen(true);
    // TODO: send feedback to firestore
  }

  return (
    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 transform bg-cornsilk outline">
      <FeedbackDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        feedback={feedback}
        setFeedback={setFeedback}
      />
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
      {feedback?.polarity === FeedbackPolarity.Positive && <ThumbUpIcon />}
      {feedback?.polarity === FeedbackPolarity.Negative && <ThumbDownIcon />}
    </div>
  );
}
