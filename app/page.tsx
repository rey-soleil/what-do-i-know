"use client";

import { useState } from "react";
import Messenger from "./components/Messenger";
import Summary from "./components/Summary";
import WelcomeDialog from "./components/WelcomeDialog";

export default function Home() {
  const [summary, setSummary] = useState<string>(
    "Start talking to the agent to get a summary of your conversation!"
  );

  return (
    <main className="flex h-full w-full flex-col md:flex-row">
      <WelcomeDialog />
      <div className="h-full p-5 md:w-1/2">
        <Messenger setSummary={setSummary} />
      </div>
      <div className="m-3 p-5 md:w-1/2">
        <Summary summary={summary} />
      </div>
    </main>
  );
}
