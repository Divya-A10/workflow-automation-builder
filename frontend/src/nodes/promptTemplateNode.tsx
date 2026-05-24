import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Terminal } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface PromptTemplateNodeProps {
  id: string;
  data: {
    role?: string;
    temperature?: number;
  };
}

export const PromptTemplateNode: React.FC<PromptTemplateNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [role, setRole] = useState(data?.role || 'system');
  const [temperature, setTemperature] = useState(data?.temperature || 0.7);

  useEffect(() => {
    updateNodeField(id, 'role', role);
  }, [role]);

  useEffect(() => {
    updateNodeField(id, 'temperature', temperature);
  }, [temperature]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-context`,
      style: { top: '33%' },
      label: 'context docs',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-variables`,
      style: { top: '66%' },
      label: 'variables map',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-promptOut`,
      style: { top: '50%' },
      label: 'assembled text',
    },
  ];

  return (
    <BaseNode id={id} title="Agent Prompt Decorator" icon={<Terminal className="w-4 h-4 text-rose-600" />} themeColor="rose" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Target Actor Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="system">System Core Instructions</option>
            <option value="user">User Message Prompt</option>
            <option value="assistant">Assistant Response Simulation</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Temperature Preset
            </label>
            <span className="text-[10px] font-mono font-bold text-rose-600 px-1 bg-rose-50 border border-rose-100 rounded">
              {temperature}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>
    </BaseNode>
  );
};
