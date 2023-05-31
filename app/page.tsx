"use client";

import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import Messenger from "./components/Messenger";
import MindMap from "./components/MindMap";
import WelcomeDialog from "./components/WelcomeDialog";

export default function Home() {
  const [summary, setSummary] = useState<string>(
    "Start talking to Ezra to build up this mind map!"
  );

  return (
    <main className="flex h-full w-full flex-col md:flex-row">
      <WelcomeDialog />
      <div className="h-full p-5 md:w-1/2">
        <Messenger setSummary={setSummary} />
      </div>
      <div className="h-screen p-5 md:h-full md:w-1/2">
        <ReactFlowProvider>
          <MindMap summary={summary} />
        </ReactFlowProvider>
      </div>
    </main>
  );
}
