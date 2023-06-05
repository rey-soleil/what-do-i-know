import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { ChatCompletionResponseMessage } from "openai";

type Feedback = {
  type: "positive" | "negative";
  content: string;
};

export type FeedbackProps = {
  message: ChatCompletionResponseMessage & Partial<Feedback>;
};

export default function Feedback({ message }: FeedbackProps) {
  if (message.content === "") return <></>;

  return (
    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 transform bg-cornsilk outline">
      <ThumbUpOutlinedIcon />
      <ThumbDownOutlinedIcon />
    </div>
  );
}
