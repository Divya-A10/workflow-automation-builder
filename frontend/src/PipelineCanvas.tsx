import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type ReactFlowInstance,
} from 'reactflow';
import { useStore } from './store';

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode } from './nodes/apiNode';
import { PromptTemplateNode } from './nodes/promptTemplateNode';
import { QueryNode } from './nodes/queryNode';
import { RouterNode } from './nodes/routerNode';
import { VisionNode } from './nodes/visionNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

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

const getInitNodeData = (nodeID: string, type: string) => {
  if (type === 'customInput') {
    return { id: nodeID, nodeType: type, inputName: 'User Topic', inputType: 'Text' };
  }

  if (type === 'text') {
    return {
      id: nodeID,
      nodeType: type,
      text: 'Write a concise summary for {{ user_topic }}',
      variables: ['user_topic'],
    };
  }

  if (type === 'llm') {
    return { id: nodeID, nodeType: type, model: 'gemini-2.5-pro' };
  }

  if (type === 'customOutput') {
    return { id: nodeID, nodeType: type, outputName: 'final_output', outputType: 'Text' };
  }

  return { id: nodeID, nodeType: type };
};

export const PipelineCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) {
        return;
      }

      try {
        const parsed = JSON.parse(raw) as { nodeType?: string };
        const type = parsed.nodeType;

        if (!type) {
          return;
        }

        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const rf = reactFlowInstance as ReactFlowInstance & {
          screenToFlowPosition?: (position: { x: number; y: number }) => { x: number; y: number };
          project?: (position: { x: number; y: number }) => { x: number; y: number };
        };

        const position = rf.screenToFlowPosition
          ? rf.screenToFlowPosition({ x: event.clientX, y: event.clientY })
          : rf.project
            ? rf.project({
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
              })
            : { x: event.clientX - bounds.left, y: event.clientY - bounds.top };

        const nodeID = getNodeID(type);
        const newNode: Node = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      } catch (error) {
        console.error('Invalid drag payload:', error);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const miniMapNodeColor = useMemo(
    () => (node: Node) => {
      if (node.type === 'customInput') return '#dbeafe';
      if (node.type === 'customOutput') return '#dcfce7';
      if (node.type === 'llm') return '#ede9fe';
      if (node.type === 'text') return '#fef3c7';
      return '#e2e8f0';
    },
    []
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 w-full bg-slate-50 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        snapToGrid
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        className="w-full h-full"
        proOptions={proOptions}
      >
        <Background color="#cbd5e1" gap={gridSize} size={1} />
        <Controls className="!bg-white !rounded-lg !border !border-slate-200/50 !shadow-sm !left-6 !bottom-6" />
        <MiniMap
          className="!bg-white !rounded-lg !border !border-slate-200/50 !shadow-sm !right-6 !bottom-6"
          nodeColor={miniMapNodeColor}
          maskColor="rgba(241, 245, 249, 0.4)"
        />
      </ReactFlow>
    </div>
  );
};
