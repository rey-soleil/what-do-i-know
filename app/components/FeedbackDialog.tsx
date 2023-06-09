import { addFeedbackToFirestore } from "@/utils/firestore";
import { Dialog, DialogContent } from "@mui/material";
import { ChatCompletionResponseMessage } from "openai";
import { FeedbackPolarity, FeedbackType } from "./Feedback";

type FeedbackDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: ChatCompletionResponseMessage;
  feedback: FeedbackType | null;
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackType | null>>;
};

export default function FeedbackDialog({
  isDialogOpen,
  setIsDialogOpen,
  message,
  feedback,
  setFeedback,
}: FeedbackDialogProps) {
  function submitFeedback() {
    setIsDialogOpen(false);
    addFeedbackToFirestore(message, feedback!);
  }

  return (
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogContent className="space-y-4 bg-cornsilk">
        <div className="flex items-center font-mono text-xl font-bold">
          Provide negative feedback
        </div>
        <textarea
          placeholder="What didn't you like about this answer?"
          className="h-15 w-full p-2 font-mono outline"
          value={feedback?.explanation}
          onChange={({ target }) =>
            setFeedback({
              polarity: FeedbackPolarity.Negative,
              explanation: target.value,
            })
          }
        ></textarea>
        <div className="text-right">
          <button
            className="h-fit bg-bright-lilac p-2 px-3 font-mono outline hover:cursor-pointer"
            onClick={submitFeedback}
          >
            SUBMIT FEEDBACK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
