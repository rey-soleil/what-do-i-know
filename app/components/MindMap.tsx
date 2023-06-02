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
  const [nodes, edges] = useMemo(() => {
    try {
      const flow = JSON.parse(summary);
      console.log(flow, Object.keys(flow));
      if (flow.nodes && flow.edges) {
        let numCols = Math.ceil(Math.sqrt(flow.nodes.length));
        return [
          flow.nodes.map((node: {}, i: number) => ({
            ...node,
            position: getNodePosition(i, numCols),
          })),
          flow.edges,
        ];
      } else {
        return [[], []];
      }
    } catch (e) {
      console.error(e);
      return [[], []];
    }
  }, [summary]);

  const reactFlowInstance = useReactFlow();

  let numCols = Math.ceil(Math.sqrt(nodes.length));

  // const nodes = useMemo(() => {
  //   return topics.map((topic, i) => ({
  //     id: i.toString(),
  //     data: { label: topic },
  //     position: getNodePosition(i, numCols),
  //   }));
  // }, [topics]);

  useEffect(() => {
    reactFlowInstance.fitBounds(getBounds(numCols));
  }, [summary]);

  console.log(summary, nodes, edges);

  return (
    <div className="h-screen w-full bg-light-red outline md:h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        className="font-mono outline-light-red"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
