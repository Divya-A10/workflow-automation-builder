/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './components/ui';
import { SubmitButton } from './components/submit';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

