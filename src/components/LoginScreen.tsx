import React from 'react';
import { ChevronDown, ArrowLeft, Shield } from "lucide-react";

export default function LoginScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#7A1B7B] via-[#631464] to-[#4D0D4E] flex flex-col overflow-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
         <button className="p-1">
           <ArrowLeft size={24} className="text-white" />
         </button>
         <div className="flex items-center gap-1 text-white font-bold text-[15px] mr-2 cursor-pointer">
           English <ChevronDown size={18} strokeWidth={3} />
         </div>
      </div>

      <div className="flex-1 flex flex-col px-8 relative z-10 pt-4">
         {/* Custom Stylized Logo */}
         <div className="mt-8 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl flex flex-col items-center justify-center shadow-lg p-2">
              <CbeLogo className="w-12 h-12 mb-1" />
              <div className="flex items-baseline leading-none">
                <span className="text-[9px] font-black text-[#7A1B7B] tracking-wider uppercase">CBE</span>
                <span className="text-sm font-black italic text-[#7A1B7B] ml-0.5">Birr</span>
              </div>
            </div>
         </div>

         {/* Welcome Text */}
         <div className="mt-12 text-center text-white">
           <p className="text-[10px] font-bold opacity-60 tracking-[0.2em] mb-1">WELCOME BACK</p>
           <h2 className="text-2xl font-black">Login</h2>
           <div className="w-8 h-1 bg-[#D4A574] mx-auto mt-2 rounded-full"></div>
         </div>

         {/* Input Box */}
         <div className="mt-10">
           <label className="text-[10px] font-black text-white/70 mb-2 block tracking-widest uppercase">Phone number</label>
           <div className="flex bg-white rounded-2xl overflow-hidden h-14 border-2 border-transparent focus-within:border-[#D4A574] shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#D4A574] px-4 flex items-center justify-center text-white font-black text-sm">
                 +251
              </div>
              <input 
                type="tel" 
                placeholder="enter phone number" 
                className="flex-1 h-full px-4 text-sm font-bold text-slate-800 focus:outline-none placeholder-gray-400 bg-transparent" 
              />
           </div>
         </div>

         {/* Action Button */}
         <button onClick={onNext} className="mt-8 w-full h-14 bg-white text-[#7A1B7B] font-black tracking-widest text-sm rounded-2xl shadow-xl active:scale-95 transition-transform uppercase">
           Next
         </button>

         {/* Sign up Link */}
         <p className="text-center mt-6 text-[11px] text-white font-bold opacity-80 flex justify-center items-center gap-1.5 cursor-pointer">
           <span>Don't have an account?</span> 
           <button className="text-[#D4A574] underline">Create Account</button>
         </p>

         <div className="flex-1"></div>

         {/* Footer Offline Mode Pill */}
         <div className="flex justify-center pb-8 pt-4">
           <button className="bg-white/10 border border-white/20 rounded-full px-7 py-3 flex items-center justify-center gap-3 active:scale-95 transition-transform">
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                 <Shield className="text-white fill-[#D4A574] w-3.5 h-3.5" strokeWidth={0} />
              </div>
              <span className="text-[10px] font-black text-white tracking-widest uppercase">USSD - OFFLINE</span>
           </button>
         </div>
      </div>
      
      {/* Bottom Copyright watermark (barely visible) */}
      <p className="absolute bottom-1 w-full text-center text-[8px] text-white/30 font-medium pb-1">
        © 2024 Commercial Bank of Ethiopia. All Rights Reserved 5.0.0 version.
      </p>
    </div>
  );
}

const CbeLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  const [error, setError] = React.useState(false);

  if (!error) {
    return (
      <img
        src="images (4).jpeg"
        alt="CBE Logo"
        className={`${className} object-contain rounded-full`}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="goldMetallicLogin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE094" />
          <stop offset="30%" stopColor="#DFAC56" />
          <stop offset="60%" stopColor="#92621C" />
          <stop offset="85%" stopColor="#F8D385" />
          <stop offset="100%" stopColor="#A27329" />
        </linearGradient>
        <radialGradient id="purpleGradLogin" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#8A228C" />
          <stop offset="60%" stopColor="#5E115F" />
          <stop offset="100%" stopColor="#300331" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#purpleGradLogin)" stroke="url(#goldMetallicLogin)" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="url(#goldMetallicLogin)" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
      <g transform="translate(50, 50)" stroke="url(#goldMetallicLogin)" strokeWidth="2.5" fill="none">
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(120)" />
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(240)" />
        <circle cx="0" cy="0" r="7" fill="url(#goldMetallicLogin)" stroke="none" />
        <circle cx="0" cy="0" r="14" strokeWidth="1.5" opacity="0.9" />
      </g>
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.15" />
    </svg>
  );
};
