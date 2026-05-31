import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle, 
  ArrowLeft,
  Search,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Bank, SavedAccount, TransactionDetails } from '../types';

// Supported banks exactly from the screenshot reference
export const BANK_LIST: Bank[] = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', type: 'ETHIOPIAN LOCAL BANK', color: '#7A1B7B', textColor: '#FFE3A1', iconColor: 'bg-gradient-to-br from-[#7A1B7B] to-[#59105A]' },
  { id: 'awash', name: 'Awash Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#005E9C', textColor: '#FFFFFF', iconColor: 'bg-blue-600' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', type: 'ETHIOPIAN LOCAL BANK', color: '#E29E00', textColor: '#FFFFFF', iconColor: 'bg-amber-500' },
  { id: 'dashen', name: 'Dashen Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#D21E1E', textColor: '#FFFFFF', iconColor: 'bg-red-600' },
  { id: 'hibret', name: 'Hibret Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#E0DE05', textColor: '#595959', iconColor: 'bg-yellow-400' },
  { id: 'wegagen', name: 'Wegagen Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#E25E03', textColor: '#FFFFFF', iconColor: 'bg-orange-500' },
  { id: 'nib', name: 'Nib International Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#0393E2', textColor: '#FFFFFF', iconColor: 'bg-cyan-500' },
  { id: 'coop', name: 'Cooperative Bank of Oromia', type: 'ETHIOPIAN LOCAL BANK', color: '#0C9F4E', textColor: '#FFFFFF', iconColor: 'bg-emerald-600' },
  { id: 'lion', name: 'Lion International Bank', type: 'ETHIOPIAN LOCAL BANK', color: '#DFAC56', textColor: '#FFFFFF', iconColor: 'bg-amber-600' },
];

// Seed names for interactive lookup simulation
const MOCK_RECIPIENT_DATABASE: Record<string, string> = {
  '1000685600308': 'MR MELKAMU MEKURIA BITEW',
  '1000884432211': 'MR MUNDINO DUBELA H/BAMUD',
  '1000123456789': 'MS SABA GHEBREYESUS DESTA',
  '1000987654321': 'MR KEBEDE ABEBE BALCHA',
};

interface SendMoneyScreenProps {
  onBack: () => void;
  onSubmit: (details: TransactionDetails) => void;
  savedAccounts: SavedAccount[];
  prefilledAccount?: string;
  prefilledName?: string;
}

export default function SendMoneyScreen({ 
  onBack, 
  onSubmit, 
  savedAccounts,
  prefilledAccount = "",
  prefilledName = ""
}: SendMoneyScreenProps) {
  const [accountNumber, setAccountNumber] = useState(prefilledAccount);
  const [selectedBank, setSelectedBank] = useState<Bank>(BANK_LIST[0]);
  const [receiverName, setReceiverName] = useState(prefilledName);
  const [amount, setAmount] = useState('50');
  const [reason, setReason] = useState('Transfer');
  const [saveAccount, setSaveAccount] = useState(false);
  
  const [bankListOpen, setBankListOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');

  // Fallback state if logo image can't be fetched
  const [logoHasError, setLogoHasError] = useState(false);

  // Auto-verify if prefilled
  useEffect(() => {
    if (prefilledAccount) {
      setAccountNumber(prefilledAccount);
      const match = savedAccounts.find(acc => acc.accountNumber === prefilledAccount.trim());
      if (match) {
        setVerifiedName(match.receiverName);
        setReceiverName(match.receiverName);
        setIsVerified(true);
      } else {
        const dbName = MOCK_RECIPIENT_DATABASE[prefilledAccount] || "MR MELKAMU MEKURIA BITEW";
        setVerifiedName(dbName);
        setReceiverName(dbName);
        setIsVerified(true);
      }
    }
  }, [prefilledAccount, savedAccounts]);

  // Monitor typed account number to auto-verify
  useEffect(() => {
    const cleanNum = accountNumber.trim();
    if (!cleanNum) {
      setIsVerified(false);
      setVerifiedName('');
      return;
    }

    // Direct match against mock recipients database
    if (MOCK_RECIPIENT_DATABASE[cleanNum]) {
      setIsVerified(true);
      setVerifiedName(MOCK_RECIPIENT_DATABASE[cleanNum]);
      setReceiverName(MOCK_RECIPIENT_DATABASE[cleanNum]);
    } else {
      // Find inside saved accounts state
      const matchSaved = savedAccounts.find(acc => acc.accountNumber === cleanNum);
      if (matchSaved) {
        setIsVerified(true);
        setVerifiedName(matchSaved.receiverName);
        setReceiverName(matchSaved.receiverName);
        // Autofill bank and reason
        const bankMatch = BANK_LIST.find(b => b.name === matchSaved.bankName);
        if (bankMatch) {
          setSelectedBank(bankMatch);
        }
      } else {
        // If it's a random 13-digit number, don't auto-verify immediately until they press verify/reload
        setIsVerified(false);
      }
    }
  }, [accountNumber, savedAccounts]);

  // Handle simulated lookup on reload click
  const handleVerifyLookup = () => {
    if (!accountNumber) return;
    setIsVerifying(true);
    setIsVerified(false);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanNum = accountNumber.trim();
      // Generate a nice name if not inside database
      const matchedName = MOCK_RECIPIENT_DATABASE[cleanNum] || "MR MELKAMU MEKURIA BITEW";
      setVerifiedName(matchedName);
      setReceiverName(matchedName);
      setIsVerified(true);
    }, 600);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) return;
    if (!receiverName) return;
    if (!amount || parseFloat(amount) <= 0) return;

    onSubmit({
      bank: selectedBank,
      accountNumber,
      receiverName,
      amount,
      reason: reason || 'Transfer',
      saveAccount
    });
  };

  // Filter bank search terms
  const filteredBanks = BANK_LIST.filter(bank => 
    bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
    bank.type.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#F8F9FD] flex flex-col relative overflow-hidden text-slate-800 font-sans">
      
      {/* Top Header matching reference BAR purple header */}
      <div className="bg-[#7A1B7B] pt-8 pb-4 px-4 flex justify-between items-center text-white shrink-0 z-10 shadow-sm relative">
        <button 
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="p-1.5 rounded-xl bg-white/10 active:bg-white/25 transition-all text-white flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="font-extrabold text-[12px] tracking-widest uppercase">Send to CBE</span>
        <div className="flex items-center gap-2">
          <Search size={15} className="opacity-95" />
          <span className="font-black text-[10px] opacity-90 border border-white/20 px-2 py-0.5 rounded-full bg-white/10">EN</span>
        </div>
      </div>

      {/* Main Form content container styled with exact visual details */}
      <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto px-4.5 py-4 space-y-4 pb-24 scrollbar-none select-none">
        
        {/* Step 1: Account Number Entry Section with strict image placements */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-[#7A1B7B] tracking-wider uppercase">
            * Receivers Account Number
          </label>
          
          <div className={`flex items-center relative rounded-[20px] bg-white border transition-all p-1 shadow-sm ${
            isVerified ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200 focus-within:border-[#7A1B7B]'
          }`}>
            
            {/* CBE Bank Logo Container display exactly next to the account number */}
            <div className="flex items-center gap-1 pl-1.5 pr-1 py-1.5">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-white flex justify-center items-center relative shadow-sm">
                {!logoHasError ? (
                  <img 
                    src="images (4).jpeg" 
                    alt="CBE logo" 
                    onError={() => setLogoHasError(true)}
                    className="w-full h-full object-cover rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#7A1B7B] flex items-center justify-center text-[9px] font-black text-white rounded-full">
                    CBE
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black text-slate-400 pl-1 select-none">▼</span>
            </div>

            {/* Input Field Area */}
            <input 
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setAccountNumber(val);
              }}
              placeholder="1000685600308"
              required
              className="flex-1 min-w-0 px-2.5 py-2.5 focus:outline-none text-[13px] font-black text-slate-800 tracking-wider placeholder:text-slate-300"
            />

            {/* Clear Input */}
            {accountNumber && (
              <button 
                type="button" 
                onClick={() => {
                  setAccountNumber('');
                  setIsVerified(false);
                  setReceiverName('');
                }}
                className="p-1 px-1.5 text-slate-300 hover:text-slate-500 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}

            {/* Lookup refresh icon trigger - spins on click to verify account owner */}
            <button 
              type="button"
              disabled={isVerifying || !accountNumber}
              onClick={handleVerifyLookup}
              className="p-2.5 mr-1 rounded-xl text-[#7A1B7B] active:scale-90 transition-all hover:bg-purple-50 disabled:opacity-40 cursor-pointer"
              title="Lookup Account Name"
            >
              {isVerifying ? (
                <Loader2 size={16} className="animate-spin text-[#7A1B7B]" />
              ) : (
                <RotateCcw size={16} strokeWidth={2.5} className="font-extrabold" />
              )}
            </button>
          </div>

          {/* Quick Select Bank Link */}
          <div className="flex justify-between items-center px-1">
            <button
              type="button"
              onClick={() => setBankListOpen(true)}
              className="text-[10px] text-[#7A1B7B] font-extrabold flex items-center gap-1 py-1 cursor-pointer select-none active:opacity-75 transition-opacity"
            >
              <span className="text-slate-400 font-bold">Bank:</span> 
              <span className="underline decoration-dotted">{selectedBank.name}</span>
              <ChevronRight size={11} strokeWidth={3} />
            </button>
          </div>

          {/* Verification labels next to/below input */}
          {isVerified && (
            <div className="text-[10px] text-emerald-600 font-black tracking-wide flex items-center gap-1 px-1.5 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIED: <span className="uppercase text-slate-700">{verifiedName}</span>
            </div>
          )}

          {/* High Fidelity verified block matched to image `Screenshot_20260531-233908_Chrome.jpg` */}
          {isVerified && (
            <div className="bg-[#f4fcf7] rounded-[24px] p-4.5 border border-emerald-100/60 text-emerald-950 shadow-sm animate-fadeIn space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="bg-emerald-100/90 text-emerald-800 text-[8.5px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 justify-center leading-none">
                  ✓ VERIFIED ACCOUNT
                </div>
              </div>
              <div className="space-y-0.5 pt-0.5 text-left">
                <div className="text-slate-800 text-[13.5px] font-black tracking-tight leading-tight uppercase">
                  {verifiedName}
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono font-bold tracking-wider">
                  {accountNumber}
                </div>
                {/* Check in saved state */}
                {savedAccounts.some(x => x.accountNumber === accountNumber) && (
                  <div className="text-[8.5px] text-emerald-600 font-black uppercase pt-1 tracking-widest leading-none">
                    Saved Recipient Folder
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Receiver Name Entry */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 tracking-wider uppercase">
            * Receiver Name
          </label>
          <div className="flex items-center relative rounded-[20px] bg-white border border-slate-200 shadow-sm focus-within:border-[#7A1B7B] transition-all p-1">
            <div className="p-2 border-r border-slate-100">
              <User size={16} className="text-slate-400 fill-slate-100" />
            </div>
            <input 
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="MR MELKAMU MEKURIA BITEW"
              required
              disabled={isVerified} // Auto locked to verified receiver name but lets user toggle off if needed
              className="flex-1 px-3 py-2.5 focus:outline-none text-[12.5px] font-black text-slate-700 uppercase placeholder:text-slate-300 disabled:bg-slate-50/20 disabled:text-slate-800"
            />
          </div>
        </div>

        {/* Step 3: Amount Element */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-[#7A1B7B] tracking-wider uppercase">
            * Amount (Birr)
          </label>
          <div className="flex items-center relative rounded-[20px] bg-white border border-slate-200 shadow-sm focus-within:border-[#7A1B7B] transition-all p-1">
            <div className="p-1 px-2 mb-0.5 shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#7A1B7B] font-black text-[13px] border border-purple-100/50">
                $
              </div>
            </div>
            <input 
              type="number"
              min="10"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (e.g. 50)"
              required
              className="flex-1 px-2.5 py-2.5 focus:outline-none text-[14px] font-black text-slate-800 text-left"
            />
            <span className="text-[11px] font-black text-slate-400 tracking-widest pr-4">ETB</span>
          </div>
        </div>

        {/* Step 3: Reason Element */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 tracking-wider uppercase">
            Reason (Optional)
          </label>
          <div className="flex items-center relative rounded-[20px] bg-white border border-slate-200 shadow-sm focus-within:border-[#7A1B7B] transition-all p-1">
            <div className="p-2.5 border-r border-slate-100">
              <HelpCircle size={15} className="text-slate-400" />
            </div>
            <input 
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (e.g. Gift, Salary)"
              className="flex-1 px-3 py-2.5 focus:outline-none text-[11px] font-bold text-slate-600"
            />
          </div>
        </div>

        {/* Save Accounts toggle checkbox */}
        <div className="flex items-center gap-3 pt-2 select-none">
          <label className="relative flex items-center cursor-pointer">
            <input 
              type="checkbox"
              checked={saveAccount}
              disabled={isVerified && savedAccounts.some(acc => acc.accountNumber === accountNumber.trim())} // Pre-saved already
              onChange={(e) => setSaveAccount(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5.5 h-5.5 bg-white border-2 border-slate-300 rounded-lg peer-checked:bg-[#7A1B7B] peer-checked:border-[#7A1B7B] transition-all flex items-center justify-center shadow-inner">
              <svg className="w-3.5 h-3.5 text-white stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
          <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
            Save this account for later
          </span>
        </div>

        {/* Bank Transfer CTA button */}
        <div className="pt-4 pb-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7A1B7B] to-[#59105A] hover:opacity-95 text-white active:scale-[0.98] font-black py-4 px-4 rounded-[20px] shadow-lg border border-purple-900/10 tracking-widest uppercase text-[12px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Bank Transfer
          </button>
        </div>

      </form>

      {/* Slide-Up Bottom Drawer for professional Select Bank pop-up list */}
      {bankListOpen && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end transition-opacity duration-300 animate-fadeIn">
          {/* Backdrop Touch Dismiss */}
          <div className="absolute inset-0 z-0" onClick={() => setBankListOpen(false)}></div>
          
          {/* Scrollable Drawer Window */}
          <div className="relative z-10 w-full max-h-[85%] bg-white rounded-t-[32px] flex flex-col overflow-hidden animate-slideUp">
            
            {/* Header select bank */}
            <div className="px-5 pt-5 pb-3.5 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white">
                <h4 className="text-[14px] font-black text-slate-800 tracking-wide uppercase">Select Recipient Bank</h4>
                <button 
                  type="button"
                  onClick={() => setBankListOpen(false)}
                  className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Real-time filter search bar inside bank list drawer */}
              <div className="bg-slate-100 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-slate-200">
                <Search size={14} className="text-slate-400" />
                <input 
                  type="text"
                  placeholder="Type Bank name to filter..."
                  value={bankSearchTerm}
                  onChange={(e) => setBankSearchTerm(e.target.value)}
                  className="w-full text-[11px] font-bold text-slate-700 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Scrollable Banks List container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[380px] scrollbar-none">
              {filteredBanks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-extrabold text-[11px] uppercase">
                  No matching banks found
                </div>
              ) : (
                filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank);
                      setBankListOpen(false);
                      setBankSearchTerm('');
                    }}
                    type="button"
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border text-left active:scale-[0.99] transition-all cursor-pointer
                      ${selectedBank.id === bank.id 
                        ? 'border-[#7A1B7B] bg-purple-50/40 ring-1 ring-[#7A1B7B]' 
                        : 'border-slate-150 hover:bg-slate-50'
                      }
                    `}
                  >
                    {/* Circle Bank Icon with matching colors */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-[12px] shadow-sm shrink-0 ${bank.iconColor}`}>
                      <Building2 size={16} />
                    </div>
                    
                    {/* Info details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-black text-[11.5px] text-slate-800 tracking-tight leading-snug truncate">
                        {bank.name}
                      </h5>
                      <p className="text-[7.5px] font-black text-slate-400 tracking-wider uppercase">
                        {bank.type}
                      </p>
                    </div>

                    {/* Radio Indicator */}
                    <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0
                      ${selectedBank.id === bank.id 
                        ? 'border-[#7A1B7B] bg-[#7A1B7B]' 
                        : 'border-slate-300'
                      }
                    `}>
                      {selectedBank.id === bank.id && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
