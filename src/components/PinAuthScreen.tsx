import React, { useState } from 'react';
import { ArrowLeft, Search, Info, Check } from 'lucide-react';
import { TransactionDetails } from '../types';

interface PinAuthScreenProps {
  details: TransactionDetails;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PinAuthScreen({ 
  details, 
  onBack, 
  onSuccess 
}: PinAuthScreenProps) {
  const [pin, setPin] = useState<string>('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      // Auto success when 4 digits are completed
      if (nextPin.length === 4) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col relative overflow-hidden text-slate-800">
      
      {/* Top Header matching reference BAR purple header */}
      <div className="bg-[#7A1B7B] pt-8 pb-4 px-4 flex justify-between items-center text-white shrink-0 z-10 shadow-sm relative">
        <button 
          onClick={onBack}
          aria-label="Back to transfer details"
          className="p-1 px-2 rounded-lg bg-white/10 active:bg-white/25 transition-all text-white flex items-center"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="font-extrabold text-[13px] tracking-widest uppercase">Select Transfer</span>
        <div className="flex items-center gap-2">
          <Search size={15} className="opacity-95" />
          <span className="font-extrabold text-[11px] opacity-90 border border-white/20 px-1.5 py-0.2 rounded-full bg-white/10">EN</span>
        </div>
      </div>

      {/* Internal Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col justify-between select-none scrollbar-none">
        
        {/* Back navigation button as seen in reference */}
        <div className="flex text-left">
          <button 
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200.5 flex items-center justify-center text-slate-600 shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Header Text Blocks */}
        <div className="text-center mt-3 mb-4">
          <h2 className="text-[17px] font-extrabold text-slate-800 tracking-wide">
            Authentication
          </h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-tight">
            Please enter valid PIN to continue the process
          </p>
        </div>

        {/* PIN circle pinholes */}
        <div className="flex justify-center gap-3.5 mb-5">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div 
                key={idx} 
                className={`w-[48px] h-[48px] rounded-2xl border-2 transition-all flex items-center justify-center
                  ${isFilled 
                    ? 'border-[#7A1B7B] bg-purple-50/50 shadow-md ring-2 ring-[#7A1B7B]/10' 
                    : 'border-slate-350 bg-white'
                  }
                `}
              >
                {isFilled && (
                  <div className="w-3 h-3 bg-[#7A1B7B] rounded-full animate-scaleUp"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Verification Cards Stack */}
        <div className="space-y-2 mb-6">
          {/* Card 1: Account Number Check */}
          <div className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200.5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Info size={14} className="stroke-[3]" />
              </div>
              <span className="text-[11.5px] font-extrabold text-slate-700 tracking-wide">
                {details.accountNumber}
              </span>
            </div>
            <div className="text-[#7A1B7B] bg-purple-50 rounded-full p-0.5">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          {/* Card 2: Amount Checking */}
          <div className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200.5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Info size={14} className="stroke-[3]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[7.5px] font-black text-slate-400 tracking-wider uppercase leading-none mb-0.5">
                  Amount
                </span>
                <span className="text-[12px] font-black text-slate-800 tracking-wide leading-none">
                  {details.amount} ETB
                </span>
              </div>
            </div>
            <div className="text-[#7A1B7B] bg-purple-50 rounded-full p-0.5">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Step 5 Keyboard Panel as displayed in Reference */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/50">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="bg-white hover:bg-slate-50 border border-slate-200.5 rounded-2xl h-[44px] flex items-center justify-center text-[18px] font-extrabold text-slate-800 shadow-sm active:scale-95 active:shadow-inner transition-all cursor-pointer"
            >
              {num}
            </button>
          ))}
          {/* Third Row footer keys: empty blank space key, 0, backspace arrow */}
          <div className="opacity-0 cursor-default pointer-events-none"></div>
          
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="bg-white hover:bg-slate-50 border border-slate-200.5 rounded-2xl h-[44px] flex items-center justify-center text-[18px] font-extrabold text-slate-800 shadow-sm active:scale-95 active:shadow-inner transition-all cursor-pointer"
          >
            0
          </button>
          
          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Delete last digit"
            className="bg-gradient-to-br from-[#7A1B7B] to-[#59105A] active:scale-95 text-white rounded-2xl h-[44px] flex items-center justify-center shadow-lg active:shadow transition-all cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
        </div>

      </div>

    </div>
  );
}
