import React from 'react';
import { Landmark, X, Check } from 'lucide-react';
import { TransactionDetails } from '../types';

interface ConfirmTransferDrawerProps {
  details: TransactionDetails;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmTransferDrawer({ 
  details, 
  onConfirm, 
  onClose 
}: ConfirmTransferDrawerProps) {
  return (
    <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end transition-opacity duration-300 animate-fadeIn">
      {/* Tap outside to dismiss */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Slide-Up White Dialog Board as seen in IMG_20260525_150644_265_3.jpg */}
      <div className="relative z-10 w-full bg-white rounded-t-[32px] px-5 pt-6 pb-7 shadow-2xl animate-slideUp text-slate-800 border-t border-slate-100 flex flex-col items-center">
        
        {/* Close Button "X" */}
        <button 
          onClick={onClose}
          aria-label="Dismiss confirmation"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Small subtitle header */}
        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-4 text-center">
          SELECT TRANSFER
        </p>

        {/* Big Landmark Icon sphere */}
        <div className="w-16 h-16 bg-slate-50 border-4 border-white shadow-md rounded-full flex items-center justify-center text-[#7A1B7B] ring-4 ring-slate-100/50 mb-3">
          <Landmark size={26} strokeWidth={2.2} />
        </div>

        {/* Large Amount display */}
        <h3 className="text-[25px] font-extrabold tracking-tight text-slate-800 leading-none mb-6">
          {details.amount} <span className="text-[14px] font-black text-slate-500 uppercase">ETB</span>
        </h3>

        {/* Payment Method section */}
        <div className="w-full text-left space-y-2 mb-6">
          <p className="text-[8.5px] font-black text-slate-400 tracking-wider uppercase pl-1">
            PAYMENT METHOD
          </p>
          
          {/* Main Info Box */}
          <div className="w-full flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Purple/Bank themed mini icon */}
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#7A1B7B]">
                <Landmark size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-black text-slate-800 tracking-wide leading-snug">
                  {details.bank.name}
                </span>
                <span className="text-[9px] font-bold text-slate-500">
                  Acct: {details.accountNumber}
                </span>
              </div>
            </div>
            
            {/* Green verification circles checkmark */}
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md ring-4 ring-emerald-100 flex-shrink-0">
              <Check size={11} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Confirm Purple Button */}
        <button
          onClick={onConfirm}
          className="w-full bg-[#7A1B7B] hover:bg-[#630f64] text-white py-3.5 px-6 rounded-2xl font-black text-[12.5px] uppercase tracking-widest hover:scale-98 active:scale-[0.96] transition-all shadow-lg active:shadow shadow-purple-800/25 border border-purple-900/15 uppercase cursor-pointer text-center"
        >
          Confirm
        </button>

      </div>
    </div>
  );
}
