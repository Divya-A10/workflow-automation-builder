import React, { useState, useEffect } from 'react';
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

  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState<string[]>([]);

  // Parse curly-braces variables dynamically
  useEffect(() => {
    const foundVars: string[] = [];
    // Matches JavaScript identifier inside double curly braces: e.g. {{ varName }}
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    let match;
    while ((match = regex.exec(currText)) !== null) {
      if (!foundVars.includes(match[1])) {
        foundVars.push(match[1]);
      }
    }
    setVariables(foundVars);
  }, [currText]);

  // Sync state to Zustand store
  useEffect(() => {
    updateNodeField(id, 'text', currText);
    updateNodeField(id, 'variables', variables);
  }, [currText, variables]);

  // Dynamically calculate sizes to expand with text rows and columns
  const lines = currText.split('\n');
  const maxLineLength = Math.max(...lines.map((l) => l.length));
  
  const calculatedRows = Math.max(3, Math.min(12, lines.length));
  const calculatedCols = Math.max(25, Math.min(50, maxLineLength));

  // Position dynamic variables on the left evenly spaced out
  const dynamicHandles = variables.map((varName, idx) => {
    const topPercent =
      variables.length > 1
        ? 20 + (idx * 60) / (variables.length - 1)
        : 50;

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
      id: `${id}-output`,
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
          placeholder="Enter text with variables, e.g., {{ input }} is parsed..."
          className="w-full p-2 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-700 font-medium font-mono text-[11px] resize-none leading-relaxed transition-all"
        />
        <span className="text-[9px] text-slate-400 italic font-medium leading-none">
          Tip: Wrap any parameter inside double brackets like {"{{ my_variable }}"} to feed it here.
        </span>
      </div>
    </BaseNode>
  );
};
