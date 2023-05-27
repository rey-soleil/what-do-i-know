import { useMemo } from "react";

type SummaryProps = {
  summary: string;
};

/*
 * This component summarizes topics you've discussed with the agent
 */
export default function Summary({ summary }: SummaryProps) {
  const topics = useMemo(() => summary.split("|"), [summary]);

  return (
    <div>
      <h2 className="mb-3 text-3xl font-bold">Topics We&apos;ve Discussed</h2>
      {topics.length <= 1 && <div>{summary}</div>}
      {topics.length > 1 && (
        <ul className="list-inside list-disc">
          {topics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
