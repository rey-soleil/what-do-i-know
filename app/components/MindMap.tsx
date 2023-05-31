import { getBounds, getNodePosition } from "@/utils/mind-map";
import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, useReactFlow } from "reactflow";

import "reactflow/dist/style.css";

type MindMapProps = {
  summary: string;
};

/*
 * This component displays the topics you've mentioned in a graph using
 * ReactFlow.
 */
export default function MindMap({ summary }: MindMapProps) {
  const topics = useMemo(() => summary.split("|"), [summary]);
  const reactFlowInstance = useReactFlow();

  let numCols = Math.ceil(Math.sqrt(topics.length));

  const nodes = useMemo(() => {
    return topics.map((topic, i) => ({
      id: i.toString(),
      data: { label: topic },
      position: getNodePosition(i, numCols),
    }));
  }, [topics]);

  useEffect(() => {
    reactFlowInstance.fitBounds(getBounds(numCols));
  }, [nodes]);

  return (
    <div className="h-screen w-full md:h-full">
      <ReactFlow nodes={nodes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
