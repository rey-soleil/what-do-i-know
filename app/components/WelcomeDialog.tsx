import HubIcon from "@mui/icons-material/Hub";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Dialog, DialogContent } from "@mui/material";

const WELCOME_CONTENT = [
  {
    icon: <QuestionAnswerIcon />,
    text: "Meet Ezra, a chatbot who is curious to learn about what excites you!",
  },
  {
    icon: <HubIcon />,
    text: "As you share more, Ezra will build up a mind map of your interests.",
  },
  {
    icon: <PersonSearchIcon />,
    text: "You can share your name to personalize your experience. It's completely optional!",
  },
];

type WelcomeDialogProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WelcomeDialog({
  name,
  setName,
  isDialogOpen,
  setIsDialogOpen,
}: WelcomeDialogProps) {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      className="bg-green-sheen"
    >
      <DialogContent className="bg-cornsilk">
        <div className="flex flex-col">
          {WELCOME_CONTENT.map(({ icon, text }, index) => (
            <div className="mb-5 flex items-center font-mono" key={index}>
              <div className="mx-4">{icon}</div>
              <h3>{text}</h3>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center space-x-4 p-4">
          <input
            type="text"
            placeholder="Your name"
            className="h-10 w-full px-2 font-mono outline"
            value={name}
            onChange={({ target }) => setName(target.value)}
          ></input>
          <button
            className="h-fit bg-bright-lilac p-2 px-3 font-mono outline hover:cursor-pointer"
            onClick={() => setIsDialogOpen(false)}
          >
            GO
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
