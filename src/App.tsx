/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import DashboardScreen from './components/DashboardScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-zinc-100 to-slate-200 flex flex-col items-center justify-center font-sans p-4 sm:p-8">
      
      {/* Screen Container resembling an elegant mobile bezel */}
      <div className="w-full max-w-[340px] h-[640px] bg-slate-50 rounded-[40px] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative transition-all">
         <DashboardScreen />
      </div>

      <p className="mt-4 text-[10px] text-slate-400 font-bold tracking-widest uppercase text-center max-w-[300px]">
        Commercial Bank of Ethiopia (CBE) Mobile Banking Prototype
      </p>
    </div>
  );
}
