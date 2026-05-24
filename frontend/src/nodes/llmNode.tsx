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
      id: `${id}-system_prompt`,
      style: { top: '33%' },
      label: 'system_prompt',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-input_text`,
      style: { top: '66%' },
      label: 'input_text',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-output`,
      style: { top: '50%' },
      label: 'output',
    },
  ];

  return (
    <BaseNode id={id} title="Gemini LLM Node" icon={<Sparkles className="w-4 h-4 text-purple-600" />} themeColor="purple" handles={handles}>
      <div className="space-y-2">
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Receives structured system instructions plus user input text and returns generated output.
        </p>
        <div className="bg-purple-50/50 rounded-lg p-2.5 border border-purple-100/50 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[10px] font-bold text-purple-700 tracking-wide uppercase">
            {data?.model || 'gemini-2.5-pro'}
          </span>
        </div>
      </div>
    </BaseNode>
  );
};
