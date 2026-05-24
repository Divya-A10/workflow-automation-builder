import React, { useEffect, useMemo, useState } from 'react';
import { Position } from 'reactflow';
import { AlignLeft } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface TextNodeProps {
  id: string;
  data: {
    text?: string;
  };
}

export const TextNode: React.FC<TextNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currText, setCurrText] = useState(
    data?.text || 'Write a short summary for {{ user_topic }}'
  );

  const variables = useMemo(() => {
    const variableSet = new Set<string>();
    const variableRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
    let match: RegExpExecArray | null;

    while ((match = variableRegex.exec(currText)) !== null) {
      variableSet.add(match[1]);
    }

    return Array.from(variableSet);
  }, [currText]);

  useEffect(() => {
    updateNodeField(id, 'text', currText);
    updateNodeField(id, 'variables', variables);
  }, [id, currText, variables, updateNodeField]);

  const lines = currText.split('\n');
  const maxLineLength = Math.max(...lines.map((l) => l.length));

  const calculatedRows = Math.max(3, Math.min(12, lines.length));
  const calculatedCols = Math.max(25, Math.min(50, maxLineLength));

  const dynamicHandles = variables.map((varName, idx) => {
    const topPercent = variables.length === 1 ? 50 : 22 + (idx * 56) / (variables.length - 1);

    return {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-${varName}`,
      style: { top: `${topPercent}%` },
      label: varName,
    };
  });

  const handles = [
    ...dynamicHandles,
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-template`,
      label: 'output',
    },
  ];

  return (
    <BaseNode id={id} title="Text Template" icon={<AlignLeft className="w-4 h-4 text-amber-600" />} themeColor="amber" handles={handles}>
      <div className="space-y-2 flex flex-col">
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
          Edit Template ({variables.length} var{variables.length === 1 ? '' : 's'})
        </label>
        <textarea
          rows={calculatedRows}
          cols={calculatedCols}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          placeholder="Use variables like {{ user_topic }} and {{ audience }}"
          className="w-full p-2 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-700 font-medium font-mono text-[11px] resize-none leading-relaxed transition-all"
        />
        <div className="text-[10px] text-slate-400 font-medium leading-tight">
          Parsed variables: {variables.length > 0 ? variables.join(', ') : 'none'}
        </div>
      </div>
    </BaseNode>
  );
};
