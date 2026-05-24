import React from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useStore } from '../store';

export interface NodeHandleDefinition {
  type: 'target' | 'source';
  position: Position;
  id: string;
  style?: React.CSSProperties;
  label?: string;
}

export interface BaseNodeProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  themeColor?: 'blue' | 'green' | 'purple' | 'amber' | 'cyan' | 'rose' | 'emerald' | 'indigo' | 'teal';
  handles: NodeHandleDefinition[];
  children?: React.ReactNode;
}

const themeClasses = {
  blue: {
    border: 'border-blue-200 focus-within:ring-2 focus-within:ring-blue-500',
    header: 'bg-blue-50 text-blue-800 border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    handle: 'bg-blue-500 border-white',
  },
  green: {
    border: 'border-green-200 focus-within:ring-2 focus-within:ring-green-500',
    header: 'bg-green-50 text-green-800 border-green-100',
    badge: 'bg-green-100 text-green-700',
    handle: 'bg-green-500 border-white',
  },
  purple: {
    border: 'border-purple-200 focus-within:ring-2 focus-within:ring-purple-500',
    header: 'bg-purple-50 text-purple-800 border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    handle: 'bg-purple-500 border-white',
  },
  amber: {
    border: 'border-amber-200 focus-within:ring-2 focus-within:ring-amber-500',
    header: 'bg-amber-50 text-amber-800 border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    handle: 'bg-amber-500 border-white',
  },
  cyan: {
    border: 'border-cyan-200 focus-within:ring-2 focus-within:ring-cyan-500',
    header: 'bg-cyan-50 text-cyan-800 border-cyan-100',
    badge: 'bg-cyan-100 text-cyan-700',
    handle: 'bg-cyan-500 border-white',
  },
  rose: {
    border: 'border-rose-200 focus-within:ring-2 focus-within:ring-rose-500',
    header: 'bg-rose-50 text-rose-800 border-rose-100',
    badge: 'bg-rose-100 text-rose-700',
    handle: 'bg-rose-500 border-white',
  },
  emerald: {
    border: 'border-emerald-200 focus-within:ring-2 focus-within:ring-emerald-500',
    header: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    handle: 'bg-emerald-500 border-white',
  },
  indigo: {
    border: 'border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-500',
    header: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    badge: 'bg-indigo-100 text-indigo-700',
    handle: 'bg-indigo-500 border-white',
  },
  teal: {
    border: 'border-teal-200 focus-within:ring-2 focus-within:ring-teal-500',
    header: 'bg-teal-50 text-teal-800 border-teal-100',
    badge: 'bg-teal-100 text-teal-700',
    handle: 'bg-teal-500 border-white',
  },
};

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  title,
  icon,
  themeColor = 'blue',
  handles = [],
  children,
}) => {
  const deleteNode = useStore((state) => state.deleteNode);
  const colorSet = themeClasses[themeColor] || themeClasses.blue;

  return (
    <div
      className={`min-w-[240px] max-w-[400px] bg-white rounded-xl border-2 shadow-sm pointer-events-auto transition-all duration-200 hover:shadow-md ${colorSet.border}`}
      id={`node-${id}`}
    >
      {/* Dynamic Handles Mapping */}
      {handles.map((h, i) => {
        const isLeft = h.position === Position.Left;
        const isRight = h.position === Position.Right;

        return (
          <div key={`${h.id}-${i}`} className="relative">
            <Handle
              type={h.type}
              position={h.position}
              id={h.id}
              style={{
                width: '12px',
                height: '12px',
                border: '2px solid #ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'crosshair',
                ...h.style,
              }}
              className={`hover:scale-125 hover:brightness-95 transition-transform ${colorSet.handle}`}
            />
            {/* Elegant label floating above or next to the handle */}
            {h.label && (
              <span
                style={{
                  position: 'absolute',
                  top: h.style?.top ?? '50%',
                  transform: 'translateY(-50%)',
                  [isLeft ? 'left' : 'right']: '14px',
                }}
                className="text-[10px] font-semibold text-slate-500 select-none bg-white px-1 rounded shadow-sm border border-slate-100 tracking-wider uppercase pointer-events-none"
              >
                {h.label}
              </span>
            )}
          </div>
        );
      })}

      {/* Node Header */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-t-xl border-b font-medium text-sm ${colorSet.header}`}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-600 shrink-0">{icon}</div>}
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-slate-800">{title}</span>
            <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tight leading-none">
              {id}
            </span>
          </div>
        </div>
        <button
          onClick={() => deleteNode(id)}
          className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
          title="Delete Node"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Node Body Content */}
      <div className="p-4 space-y-3.5 text-xs text-slate-600">{children}</div>
    </div>
  );
};
