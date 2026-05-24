import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Globe } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface ApiNodeProps {
  id: string;
  data: {
    method?: string;
    url?: string;
  };
}

export const ApiNode: React.FC<ApiNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [method, setMethod] = useState(data?.method || 'POST');
  const [url, setUrl] = useState(data?.url || 'https://api.vectorshift.ai/v1/run');

  useEffect(() => {
    updateNodeField(id, 'method', method);
  }, [method]);

  useEffect(() => {
    updateNodeField(id, 'url', url);
  }, [url]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-requestBody`,
      style: { top: '33%' },
      label: 'body',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-headers`,
      style: { top: '66%' },
      label: 'headers',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-response`,
      style: { top: '33%' },
      label: 'response',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-statusCode`,
      style: { top: '66%' },
      label: 'status',
    },
  ];

  return (
    <BaseNode id={id} title="HTTP REST Client" icon={<Globe className="w-4 h-4 text-cyan-600" />} themeColor="cyan" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            HTTP Verb
          </label>
          <div className="flex gap-2">
            {['GET', 'POST', 'PUT'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 py-1 rounded text-[10px] font-bold tracking-tight transition-colors border ${
                  method === m
                    ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Endpoint URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50 text-slate-700 font-medium font-mono text-[10px]"
          />
        </div>
      </div>
    </BaseNode>
  );
};
