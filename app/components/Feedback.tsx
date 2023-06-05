import { addFeedbackToFirestore } from "@/utils/firestore";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { ChatCompletionResponseMessage } from "openai";
import { useState } from "react";
import FeedbackDialog from "./FeedbackDialog";

export enum FeedbackPolarity {
  Positive = "+",
  Negative = "-",
}

export type FeedbackType = {
  polarity: FeedbackPolarity;
  explanation?: string;
};

export type FeedbackProps = {
  message: ChatCompletionResponseMessage;
};

/*
 * This component is responsible for rendering the thumbs up/down icons that
 * allow the user to provide feedback on the assistant's response.
 *
 * If the user clicks the thumbs down icon, a dialog will open that allows the
 * user to provide more detailed feedback.
 *
 * If the user clicks either icon, the feedback will be submitted to Firestore.
 */
export default function Feedback({ message }: FeedbackProps) {
  // Eventually we'll want to pass in all messages and store them in Firestore
  // so we can fine-tune the model
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  if (message.content === "") return <></>;

  function givePositiveFeedback() {
    const updatedFeedback = { polarity: FeedbackPolarity.Positive };
    setFeedback(updatedFeedback);
    addFeedbackToFirestore(message, updatedFeedback);
    // TODO: toast "Thanks for the positive feedback!"
  }

  function giveNegativeFeedback() {
    setFeedback({ polarity: FeedbackPolarity.Negative });
    setIsDialogOpen(true);
  }

  return (
    <div
      className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 transform bg-cornsilk outline"
      title="Provide feedback"
    >
      <FeedbackDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        message={message}
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
