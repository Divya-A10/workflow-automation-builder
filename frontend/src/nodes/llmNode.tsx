import React from 'react';
import { Position } from 'reactflow';
import { Sparkles, Cpu } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';

interface LLMNodeProps {
  id: string;
  data: any;
}

export const LLMNode: React.FC<LLMNodeProps> = ({ id, data }) => {
  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-system`,
      style: { top: '33%' },
      label: 'system instructions',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: '66%' },
      label: 'prompt input',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-response`,
      style: { top: '50%' },
      label: 'response',
    },
  ];

  return (
    <BaseNode id={id} title="Gemini / LLM Engine" icon={<Sparkles className="w-4 h-4 text-purple-600" />} themeColor="purple" handles={handles}>
      <div className="space-y-2">
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Large Language Model core node. Takes customized instructions and input prompts, passing results forward.
        </p>
        <div className="bg-purple-50/50 rounded-lg p-2.5 border border-purple-100/50 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[10px] font-bold text-purple-700 tracking-wide uppercase">
            gemini-2.5-pro
          </span>
        </div>
      </div>
    </BaseNode>
  );
};
