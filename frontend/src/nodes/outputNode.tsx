import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface OutputNodeProps {
  id: string;
  data: {
    outputName?: string;
    outputType?: 'Text' | 'File';
  };
}

export const OutputNode: React.FC<OutputNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useState<'Text' | 'File'>(
    data?.outputType || 'Text'
  );

  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
  }, [currName]);

  useEffect(() => {
    updateNodeField(id, 'outputType', outputType);
  }, [outputType]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-value`,
      label: 'value',
    },
  ];

  return (
    <BaseNode id={id} title="Output Destination" icon={<Upload className="w-4 h-4" />} themeColor="green" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Target Variable
          </label>
          <input
            type="text"
            value={currName}
            onChange={(e) => setCurrName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-slate-50 text-slate-700 font-medium"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Response Mode
          </label>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value as 'Text' | 'File')}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="Text">Formatted Text</option>
            <option value="File">Export File</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
