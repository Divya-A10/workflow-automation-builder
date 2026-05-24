import React, { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Database } from 'lucide-react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

interface QueryNodeProps {
  id: string;
  data: {
    indexName?: string;
    limit?: number;
  };
}

export const QueryNode: React.FC<QueryNodeProps> = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [indexName, setIndexName] = useState(data?.indexName || 'vectorshift-assessment-db');
  const [limit, setLimit] = useState(data?.limit || 5);

  useEffect(() => {
    updateNodeField(id, 'indexName', indexName);
  }, [indexName]);

  useEffect(() => {
    updateNodeField(id, 'limit', limit);
  }, [limit]);

  const handles = [
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-searchQuery`,
      style: { top: '33%' },
      label: 'query string',
    },
    {
      type: 'target' as const,
      position: Position.Left,
      id: `${id}-filters`,
      style: { top: '66%' },
      label: 'metadata filters',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-records`,
      style: { top: '33%' },
      label: 'records matches',
    },
    {
      type: 'source' as const,
      position: Position.Right,
      id: `${id}-count`,
      style: { top: '66%' },
      label: 'match count',
    },
  ];

  return (
    <BaseNode id={id} title="Vector DB Index Search" icon={<Database className="w-4 h-4 text-emerald-600" />} themeColor="emerald" handles={handles}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Index Cluster
          </label>
          <input
            type="text"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 text-slate-700 font-medium font-mono text-[10px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Output Limit
            </label>
            <span className="text-[10px] font-mono font-bold text-emerald-600 px-1 bg-emerald-50 border border-emerald-100 rounded">
              {limit} records
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    </BaseNode>
  );
};
