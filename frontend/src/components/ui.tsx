import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from '../store';

// Import all 9 custom node types
import { InputNode } from '../nodes/inputNode';
import { LLMNode } from '../nodes/llmNode';
import { OutputNode } from '../nodes/outputNode';
import { TextNode } from '../nodes/textNode';
import { ApiNode } from '../nodes/apiNode';
import { PromptTemplateNode } from '../nodes/promptTemplateNode';
import { QueryNode } from '../nodes/queryNode';
import { RouterNode } from '../nodes/routerNode';
import { VisionNode } from '../nodes/visionNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Register node mapping
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  apiNode: ApiNode,
  promptTemplateNode: PromptTemplateNode,
  queryNode: QueryNode,
  routerNode: RouterNode,
  visionNode: VisionNode,
};

export const PipelineUI: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Retrieve store actions and properties cleanly
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);

  const getInitNodeData = (nodeID: string, type: string) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      
      if (rawData) {
        try {
          const appData = JSON.parse(rawData);
          const type = appData?.nodeType;

          if (!type) {
            return;
          }

          // Compute exact drag position matching canvas bounds
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const nodeID = getNodeID(type);
          const newNode = {
            id: nodeID,
            type,
            position,
            data: getInitNodeData(nodeID, type),
          };

          addNode(newNode);
        } catch (e) {
          console.error('Failure parsing React Flow dropping dataTransfer:', e);
        }
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex-1 w-full bg-slate-50 relative overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        className="w-full h-full"
      >
        <Background color="#cbd5e1" gap={gridSize} size={1} />
        <Controls className="!bg-white !rounded-lg !border !border-slate-200/50 !shadow-sm !left-6 !bottom-6" />
        <MiniMap 
          className="!bg-white !rounded-lg !border !border-slate-200/50 !shadow-sm !right-6 !bottom-6" 
          nodeColor={(n) => {
            if (n.type === 'customInput') return '#eff6ff';
            if (n.type === 'customOutput') return '#f0fdf4';
            if (n.type === 'llm') return '#f5f3ff';
            if (n.type === 'text') return '#fffbeb';
            return '#f8fafc';
          }}
          maskColor="rgba(241, 245, 249, 0.4)"
        />
      </ReactFlow>
    </div>
  );
};
