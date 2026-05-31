import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // 3 seconds loading simulation as seen in real mobile apps
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      
      {/* Premium Loader Frame matching IMG_20260525_150643_673_5.jpg */}
      <div className="relative flex items-center justify-center mb-8">
        
        {/* Outer Pulsing Glow */}
        <div className="absolute inset-0 w-28 h-28 bg-purple-50 rounded-full blur-xl animate-pulse"></div>
        
        {/* Dual Orbit Spinner ring */}
        <div className="w-24 h-24 rounded-full border-[3px] border-slate-100 border-t-[#7A1B7B] border-r-[#7A1B7B] animate-spin ease-linear z-10"></div>
        
        {/* Stationary CBE Birr Icon Box right in the spinner center */}
        <div className="absolute w-[64px] h-[64px] bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-md rounded-2xl flex flex-col items-center justify-center select-none z-20">
          <span className="text-[10px] font-black tracking-widest text-[#7A1B7B] uppercase leading-none">CBE</span>
          <span className="text-[14px] font-extrabold italic text-[#E2B464] tracking-tighter leading-none mt-1 font-sans">Birr</span>
        </div>
      </div>

      {/* Spaced Text stack */}
      <div className="space-y-4 max-w-[250px]">
        
        <h3 className="text-[15px] font-black tracking-[0.2em] text-slate-800 uppercase pl-1">
          SEND MONEY
        </h3>
        
        {/* Animated bounce dots */}
        <div className="flex justify-center items-center gap-1.5 h-3">
          <span className="w-1.5 h-1.5 bg-[#7A1B7B] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-[#7A1B7B] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-[#7A1B7B] rounded-full animate-bounce"></span>
        </div>

        {/* The Exact required string */}
        <p className="text-[8.5px] font-bold text-slate-400 tracking-[0.16em] uppercase leading-relaxed pt-2">
          PLEASE WAIT WHILE WE SECURE YOUR TRANSACTION...
        </p>

      </div>

    </div>
  );
}
