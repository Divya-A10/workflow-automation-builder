import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Download } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface InputNodeProps {
  id: string;
  data: {
    inputName?: string;
    inputType?: 'Text' | 'File';
  };
}

export const InputNode: React.FC<InputNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useState<'Text' | 'File'>(
    data?.inputType || 'Text'
  );

  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
  }, [currName]);

  useEffect(() => {
    updateNodeField(id, 'inputType', inputType);
  }, [inputType]);

  const handles = [
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-value`,
      label: 'value',
    },
  ];

  return (
    <BaseNode id={id} title="Input Source" icon={<Download className="w-4 h-4" />} themeColor="blue" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Field Name
          </label>
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-700 font-medium"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Input Class
          </label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'Text' | 'File')}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="Text">Plain Text</option>
            <option value="File">Uploaded File</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
