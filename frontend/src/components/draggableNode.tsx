import React from 'react';

interface DraggableNodeProps {
  type: string;
  label: string;
  icon?: React.ReactNode;
  themeColor?: 'blue' | 'green' | 'purple' | 'amber' | 'cyan' | 'rose' | 'emerald' | 'indigo' | 'teal';
}

const themeClasses = {
  blue: 'bg-blue-50/75 text-blue-800 hover:bg-blue-100/90 border-blue-200 text-blue-700 hover:scale-[1.03]',
  green: 'bg-green-50/75 text-green-800 hover:bg-green-100/90 border-green-200 text-green-700 hover:scale-[1.03]',
  purple: 'bg-purple-50/75 text-purple-800 hover:bg-purple-100/90 border-purple-200 text-purple-700 hover:scale-[1.03]',
  amber: 'bg-amber-50/75 text-amber-800 hover:bg-amber-100/90 border-amber-200 text-amber-700 hover:scale-[1.03]',
  cyan: 'bg-cyan-50/75 text-cyan-800 hover:bg-cyan-100/90 border-cyan-200 text-cyan-700 hover:scale-[1.03]',
  rose: 'bg-rose-50/75 text-rose-800 hover:bg-rose-100/90 border-rose-200 text-rose-700 hover:scale-[1.03]',
  emerald: 'bg-emerald-50/75 text-emerald-800 hover:bg-emerald-100/90 border-emerald-200 text-emerald-700 hover:scale-[1.03]',
  indigo: 'bg-indigo-50/75 text-indigo-800 hover:bg-indigo-100/90 border-indigo-200 text-indigo-700 hover:scale-[1.03]',
  teal: 'bg-teal-50/75 text-teal-800 hover:bg-teal-100/90 border-teal-200 text-teal-700 hover:scale-[1.03]',
};

export const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  label,
  icon,
  themeColor = 'blue',
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    const appData = { nodeType };
    // Set a lightweight visual cue for dragging cursor
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const styleClass = themeClasses[themeColor] || themeClasses.blue;

  return (
    <div
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-dashed text-xs font-bold leading-none cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:shadow-sm ${styleClass}`}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <span className="tracking-tight">{label}</span>
    </div>
  );
};
