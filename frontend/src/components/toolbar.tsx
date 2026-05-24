import React from 'react';
import {
  Download,
  Upload,
  Sparkles,
  AlignLeft,
  Globe,
  Terminal,
  Database,
  GitFork,
  Eye,
  Layers,
} from 'lucide-react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar: React.FC = () => {
  return (
    <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm">
      <div className="max-w-[1400px] mx-auto space-y-3.5">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none">
              VectorShift Canvas Workspace
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
              Drag elements onto the grid canvas to model and validate your pipeline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
          {/* Core Blocks */}
          <div className="space-y-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-1">
              Core Connectors
            </span>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/50">
              <DraggableNode type="customInput" label="Input Source" themeColor="blue" icon={<Download className="w-3.5 h-3.5" />} />
              <DraggableNode type="customOutput" label="Output Dest" themeColor="green" icon={<Upload className="w-3.5 h-3.5" />} />
              <DraggableNode type="text" label="Text Template" themeColor="amber" icon={<AlignLeft className="w-3.5 h-3.5" />} />
              <DraggableNode type="llm" label="Gemini LLM" themeColor="purple" icon={<Sparkles className="w-3.5 h-3.5" />} />
            </div>
          </div>

          {/* Database & API */}
          <div className="space-y-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-1">
              Integrations & Data
            </span>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/50">
              <DraggableNode type="apiNode" label="REST Client" themeColor="cyan" icon={<Globe className="w-3.5 h-3.5" />} />
              <DraggableNode type="queryNode" label="Index Query" themeColor="emerald" icon={<Database className="w-3.5 h-3.5" />} />
            </div>
          </div>

          {/* Processing and AI */}
          <div className="space-y-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block px-1">
              Execution Logic
            </span>
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/50">
              <DraggableNode type="promptTemplateNode" label="Prompt Decorator" themeColor="rose" icon={<Terminal className="w-3.5 h-3.5" />} />
              <DraggableNode type="routerNode" label="Route Split" themeColor="indigo" icon={<GitFork className="w-3.5 h-3.5" />} />
              <DraggableNode type="visionNode" label="AI Vision" themeColor="teal" icon={<Eye className="w-3.5 h-3.5" />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
