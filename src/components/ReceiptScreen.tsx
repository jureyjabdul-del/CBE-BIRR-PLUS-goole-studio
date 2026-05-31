import React, { useState } from 'react';
import { Share2, Download, X, ShieldCheck, Home } from 'lucide-react';
import { TransactionDetails } from '../types';

interface ReceiptScreenProps {
  details: TransactionDetails;
  onFinish: () => void;
}

export default function ReceiptScreen({ details, onFinish }: ReceiptScreenProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  // Generate dynamic values if not supplied
  const mockTxId = details.transactionId || 'FT' + Math.floor(10000000000 + Math.random() * 90000000000);
  const formattedDate = details.date || new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const formattedAmount = parseFloat(details.amount || '0').toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="w-full h-full bg-slate-950/90 flex flex-col justify-between p-4 relative overflow-y-auto overflow-x-hidden scrollbar-none text-slate-800 font-sans select-none animate-fadeIn">
      
      {/* Absolute Push Notification Alert overlay on top matching images (3)_2.jpeg */}
      <div className="w-full bg-white/95 rounded-2xl p-3 border border-slate-100 shadow-xl backdrop-blur-md animate-slideDown mb-4 flex gap-2.5 items-start">
        <div className="w-8 h-8 rounded-full bg-[#7A1B7B] text-white flex items-center justify-center shrink-0">
          🔔
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-[#7A1B7B] tracking-wide uppercase">Transaction Completed</span>
            <span className="text-[8px] text-slate-400 font-bold">now</span>
          </div>
          <p className="text-[9.5px] text-slate-600 font-medium truncate mt-0.5">
            ETB {formattedAmount} debited from MUNDINO DUBELA for {details.receiverName}.
          </p>
        </div>
      </div>

      {/* Main Printed Success Receipt Container */}
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col pt-0 pb-4">
        
        {/* Dynamic bright green success header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <ShieldCheck size={16} className="text-white fill-white/10" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-[12.5px] tracking-wide leading-none">Thank You!</span>
              <span className="text-[8.5px] font-bold text-emerald-100 uppercase tracking-widest mt-1">Success</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShared(true)}
              className="p-1.5 bg-white/15 rounded-full hover:bg-white/25 active:scale-90 transition-transform"
              title="Share Receipt"
            >
              <Share2 size={13} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => setDownloaded(true)}
              className="p-1.5 bg-white/15 rounded-full hover:bg-white/25 active:scale-90 transition-transform"
              title="Download Receipt"
            >
              <Download size={13} strokeWidth={2.5} />
            </button>
            <button 
              onClick={onFinish}
              className="p-1.5 bg-white/15 rounded-full hover:bg-white/25 active:scale-90 transition-transform"
              title="Dismiss"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Informative Detailed Logs Text Block */}
        <div className="p-4 pt-4 text-left border-b border-dashed border-slate-150">
          <p className="text-[8px] font-black text-slate-400 tracking-wider uppercase mb-1.5">
            MESSAGE
          </p>
          <div className="text-[10px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner max-h-[120px] overflow-y-auto scrollbar-thin">
            ETB {formattedAmount} debited from <strong className="text-slate-800">MUNDINO DUBELA H/BAMUD</strong> for <strong className="text-slate-900">{details.receiverName}</strong> with destination account <strong className="text-slate-900">{details.accountNumber}</strong> ({details.bank.name}) on <strong className="text-slate-800">{formattedDate}</strong> with transaction id: <strong className="text-[#7A1B7B] font-bold">{mockTxId}</strong>. Total Amount Debited ETB {formattedAmount} with commission of ETB 0.00 and 15% VAT of ETB 0.00.
          </div>
        </div>

        {/* QR Code Segment displayingCentered Bank Emblem */}
        <div className="py-4 flex flex-col items-center">
          <div className="bg-white p-3.5 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center relative select-none">
            
            {/* Custom SVG Vector QR matrix representation */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-slate-900">
              {/* Outer corners markers */}
              <rect x="0" y="0" width="25" height="25" fill="currentColor" rx="2" />
              <rect x="3" y="3" width="19" height="19" fill="white" rx="1.5" />
              <rect x="6" y="6" width="13" height="13" fill="currentColor" rx="1" />

              <rect x="75" y="0" width="25" height="25" fill="currentColor" rx="2" />
              <rect x="78" y="3" width="19" height="19" fill="white" rx="1.5" />
              <rect x="81" y="6" width="13" height="13" fill="currentColor" rx="1" />

              <rect x="0" y="75" width="25" height="25" fill="currentColor" rx="2" />
              <rect x="3" y="78" width="19" height="19" fill="white" rx="1.5" />
              <rect x="6" y="81" width="13" height="13" fill="currentColor" rx="1" />

              {/* Smaller markers */}
              <rect x="75" y="75" width="10" height="10" fill="currentColor" rx="1" />

              {/* Randomized digital QR dot coordinates rows */}
              <path d="M 30,5 H 40 M 45,5 H 55 M 60,5 H 70" stroke="currentColor" strokeWidth="3" />
              <path d="M 30,12 H 35 M 42,12 H 58 M 65,12 H 70" stroke="currentColor" strokeWidth="3" />
              <path d="M 30,19 H 48 M 52,19 H 70" stroke="currentColor" strokeWidth="3" />
              
              <path d="M 5,30 V 40 M 12,30 V 45 M 19,30 V 40" stroke="currentColor" strokeWidth="3" />
              <path d="M 5,50 V 65 M 15,50 V 70 M 22,50 V 60" stroke="currentColor" strokeWidth="3" />

              <path d="M 80,30 V 40 M 88,30 V 55 M 95,30 V 40" stroke="currentColor" strokeWidth="3" />
              <path d="M 80,50 V 65 M 85,55 V 60 M 95,45 V 70" stroke="currentColor" strokeWidth="3" />

              <path d="M 30,80 H 45 M 50,80 H 70" stroke="currentColor" strokeWidth="3" />
              <path d="M 30,88 H 58 M 65,88 H 70" stroke="currentColor" strokeWidth="3" />
              <path d="M 30,95 H 40 M 48,95 H 68" stroke="currentColor" strokeWidth="3" />

              {/* Center Cutout safezone region */}
              <circle cx="50" cy="50" r="18" fill="white" />
            </svg>

            {/* Centered Bank Logo Emblem Over the QR Code */}
            <div className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden transform transition-scale hover:scale-110">
              <img 
                src="images (4).jpeg" 
                alt="CBE Logo" 
                className="w-8.5 h-8.5 object-contain rounded-full referrerPolicy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          {/* Gold button link matching reference "VIEW RECEIPT" */}
          <button
            onClick={() => alert(`Showing high-resolution receipt:\nID: ${mockTxId}\nAmount: ${formattedAmount} ETB\nDate: ${formattedDate}`)}
            className="mt-4 bg-[#DFAC56] hover:bg-[#c9953d] active:scale-95 text-white text-[10px] font-extrabold px-6 py-2.5 rounded-full tracking-wider flex items-center gap-1.5 shadow border border-[#dfac56]/20 uppercase cursor-pointer"
          >
            📋 View Receipt
          </button>
        </div>

        {/* Corporate branding Rely of CBE footer */}
        <div className="bg-slate-50 mx-4 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3.5">
          <img 
            src="images (4).jpeg" 
            alt="CBE Logo" 
            className="w-10 h-10 object-contain rounded-full shadow-inner bg-white shrink-0" 
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col text-left">
            <h5 className="font-black text-[12px] text-slate-800 leading-tight">
              Commercial Bank of Ethiopia
            </h5>
            <p className="text-[8px] font-extrabold text-slate-400 italic">
              The Bank You can always Rely on!
            </p>
          </div>
        </div>

      </div>

      {/* Floating toast alerts for interactive share/download feedback */}
      {downloaded && (
        <div className="bg-emerald-500 text-white rounded-full px-5 py-2 text-[10px] font-extrabold tracking-wider absolute bottom-24 left-1/2 -translate-x-1/2 shadow-lg animate-bounce uppercase">
          💾 RECEIPT SAVED IN GALLERY!
        </div>
      )}
      {shared && (
        <div className="bg-blue-500 text-white rounded-full px-5 py-2 text-[10px] font-extrabold tracking-wider absolute bottom-24 left-1/2 -translate-x-1/2 shadow-lg animate-bounce uppercase">
          📤 RECEIPT COPIED TO CLIPBOARD!
        </div>
      )}

      {/* Home Return Button */}
      <div className="my-3 flex justify-center">
        <button
          onClick={onFinish}
          className="w-14 h-14 bg-[#7A1B7B] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl ring-4 ring-white/10 active:ring-white/20 animate-pulse uppercase select-none font-bold"
        >
          <Home size={22} fill="currentColor" strokeWidth={1} />
        </button>
      </div>

    </div>
  );
}
