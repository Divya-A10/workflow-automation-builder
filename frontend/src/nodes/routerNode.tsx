import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { GitFork } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface RouterNodeProps {
  id: string;
  data: {
    condition?: string;
    operator?: string;
  };
}

export const RouterNode: React.FC<RouterNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [condition, setCondition] = useState(data?.condition || 'response_score >= 0.8');
  const [operator, setOperator] = useState(data?.operator || 'numerical');

  useEffect(() => {
    updateNodeField(id, 'condition', condition);
  }, [condition]);

  useEffect(() => {
    updateNodeField(id, 'operator', operator);
  }, [operator]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-inputData`,
      style: { top: '50%' },
      label: 'payload in',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-matchTrue`,
      style: { top: '33%' },
      label: 'true',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-matchFalse`,
      style: { top: '66%' },
      label: 'false',
    },
  ];

  return (
    <BaseNode id={id} title="Conditional Route Split" icon={<GitFork className="w-4 h-4 text-indigo-600" />} themeColor="indigo" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Match Criteria Format
          </label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="numerical">Numerical Range Comparison</option>
            <option value="regex">Regular Expression Match</option>
            <option value="contains">Text Substring Filter</option>
            <option value="empty">Null or Non-Empty Check</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Split Condition
          </label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-700 font-medium font-mono text-[10px]"
          />
        </div>
      </div>
    </BaseNode>
  );
};
