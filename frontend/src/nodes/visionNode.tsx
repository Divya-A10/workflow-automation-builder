import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Eye } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface VisionNodeProps {
  id: string;
  data: {
    modelName?: string;
    ocrDetail?: string;
  };
}

export const VisionNode: React.FC<VisionNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [modelName, setModelName] = useState(data?.modelName || 'gemini-2.5-flash-vision');
  const [ocrDetail, setOcrDetail] = useState(data?.ocrDetail || 'high');

  useEffect(() => {
    updateNodeField(id, 'modelName', modelName);
  }, [modelName]);

  useEffect(() => {
    updateNodeField(id, 'ocrDetail', ocrDetail);
  }, [ocrDetail]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-imageInput`,
      style: { top: '33%' },
      label: 'media stream',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-ocrInstructions`,
      style: { top: '66%' },
      label: 'ocr prompt',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-extractedText`,
      style: { top: '33%' },
      label: 'parsed text',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-jsonPayload`,
      style: { top: '66%' },
      label: 'json structure',
    },
  ];

  return (
    <BaseNode id={id} title="AI Vision Analyzer" icon={<Eye className="w-4 h-4 text-teal-600" />} themeColor="teal" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Vision Vision Model
          </label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="gemini-2.5-flash-vision">gemini-2.5-flash-vision</option>
            <option value="gemini-2.5-pro-vision">gemini-2.5-pro-vision</option>
            <option value="custom-ocr-v2">Custom OCR Model v2</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            OCR Scanning Quality
          </label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setOcrDetail(d)}
                className={`flex-1 py-1 rounded text-[10px] font-bold tracking-tight uppercase transition-colors border ${
                  ocrDetail === d
                    ? 'bg-teal-500 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
