const exampleTopics = [
  "Rust",
  "Labyrinths in Medieval Europe",
  "How to make a website",
];

/*
 * This component summarizes topics you've discussed with the agent
 * TODO: use actual topics obtained by asking the agent to summarize
 */
export default function Summary() {
  return (
    <div className="mx-5">
      <h2 className="text-2xl font-bold">We&apos;ve discussed</h2>
      <ul className="list-inside list-disc">
        {exampleTopics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}
