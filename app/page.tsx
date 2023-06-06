"use client";

import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import Messenger from "./components/Messenger";
import MindMap from "./components/MindMap";
import WelcomeDialog from "./components/WelcomeDialog";

export default function Home() {
  // Uncomment this line for debugging purposes
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  const [name, setName] = useState<string>("");

  const [summary, setSummary] = useState<string>(
    "Start talking to Ezra to build up this mind map!"
  );

  return (
    <main className="flex h-full w-full flex-col bg-green-sheen md:flex-row">
      <WelcomeDialog
        name={name}
        setName={setName}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <div className="h-full md:w-1/2 md:p-5">
        <Messenger
          setSummary={setSummary}
          isDialogOpen={isDialogOpen}
          name={name}
        />
      </div>
      <div className="hidden h-screen p-5 md:flex md:h-full md:w-1/2">
        <ReactFlowProvider>
          <MindMap summary={summary} />
        </ReactFlowProvider>
      </div>
    </main>
  );
}
