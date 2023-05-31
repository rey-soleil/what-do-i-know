import HubIcon from "@mui/icons-material/Hub";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useState } from "react";

const WELCOME_CONTENT = [
  {
    icon: <QuestionAnswerIcon />,
    text: "Meet Ezra.",
  },
  {
    icon: <LightbulbIcon />,
    text: "Ezra is a chatbot who is curious to learn about what excites you!",
  },
  {
    icon: <HubIcon />,
    text: "As you share more, Ezra will build up a mind map of your interests. The more you share, the more your mind map will grow!",
  },
];

export default function WelcomeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  return (
    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogContent>
        <div className="flex flex-col">
          {WELCOME_CONTENT.map(({ icon, text }, index) => (
            <div
              className={`flex items-center ${
                index !== WELCOME_CONTENT.length && "mb-5"
              }`}
              key={index}
            >
              <div className="mx-4">{icon}</div>
              <h3>{text}</h3>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpen(false)}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}
