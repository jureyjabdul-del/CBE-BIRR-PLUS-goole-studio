import React, { useState } from 'react';
import { 
  Building2, 
  Send, 
  Landmark, 
  Smartphone, 
  Wallet, 
  Gift, 
  CalendarClock, 
  QrCode, 
  Play, 
  CreditCard, 
  LayoutGrid, 
  Menu, 
  Home, 
  Eye,
  EyeOff, 
  Phone, 
  Bell, 
  Paintbrush,
  Zap,
  Building,
  Sparkles,
  UserPlus,
  FolderHeart,
  Clock,
  Plus,
  X
} from "lucide-react";

import SendMoneyScreen from './SendMoneyScreen';
import ConfirmTransferDrawer from './ConfirmTransferDrawer';
import PinAuthScreen from './PinAuthScreen';
import LoadingScreen from './LoadingScreen';
import ReceiptScreen from './ReceiptScreen';
import SavedAccountsScreen from './SavedAccountsScreen';
import HistoryScreen from './HistoryScreen';
import { SavedAccount, TransactionDetails } from '../types';

export default function DashboardScreen() {
  // Balance Toggles
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [showReward, setShowReward] = useState<boolean>(false);
  
  // Custom Card Themes (midnight purple vs cosmic grape is switchable!)
  const [cardTheme, setCardTheme] = useState<'default' | 'cosmic'>('default');

  // Sub routing state machine: 'main' | 'send_money' | 'confirm_transfer' | 'authentication' | 'loading' | 'receipt' | 'saved_accounts' | 'history'
  const [currentView, setCurrentView] = useState<'main' | 'send_money' | 'confirm_transfer' | 'authentication' | 'loading' | 'receipt' | 'saved_accounts' | 'history'>('main');

  // Quick Save Modal fields
  const [showQuickSaveModal, setShowQuickSaveModal] = useState<boolean>(false);
  const [quickSaveName, setQuickSaveName] = useState<string>('');
  const [quickSaveAcct, setQuickSaveAcct] = useState<string>('');

  // Default / Persistent Saved Accounts state in localStorage
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    const raw = localStorage.getItem('cbe_saved_accounts');
    if (raw) {
       try { return JSON.parse(raw); } catch (e) {}
    }
    // High-fidelity pre-populated list
    const defaultAccounts: SavedAccount[] = [
      {
        id: '1',
        accountNumber: '1000884432211',
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        receiverName: 'MUNDINO DUBELA',
        date: '28-Nov-2025',
        time: '04:54 PM',
        lastAmount: '10',
        reason: 'Lunch Pay'
      },
      {
        id: '2',
        accountNumber: '1000998877665',
        bankName: 'Awash Bank',
        receiverName: 'CHALA KEBEBE',
        date: '27-Nov-2025',
        time: '11:20 AM',
        lastAmount: '250',
        reason: 'Family Support'
      }
    ];
    localStorage.setItem('cbe_saved_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  const [currentTransfer, setCurrentTransfer] = useState<TransactionDetails | null>(null);
  const [prefilledAccount, setPrefilledAccount] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Trigger floating on-screen notifications block
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleCardTheme = () => {
    setCardTheme(prev => prev === 'default' ? 'cosmic' : 'default');
  };

  // Saved accounts handler logic
  const handleDeleteAccount = (id: string) => {
    const updated = savedAccounts.filter(acc => acc.id !== id);
    setSavedAccounts(updated);
    localStorage.setItem('cbe_saved_accounts', JSON.stringify(updated));
    triggerToast('ACCOUNT DELETED');
  };

  const handleUpdateAccount = (updatedAcc: SavedAccount) => {
    const updated = savedAccounts.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc);
    setSavedAccounts(updated);
    localStorage.setItem('cbe_saved_accounts', JSON.stringify(updated));
    triggerToast('ACCOUNT UPDATED');
  };

  const handleAddAccount = (newAcc: Omit<SavedAccount, 'id' | 'date' | 'time'>) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const fullAcc: SavedAccount = {
      ...newAcc,
      id: Math.random().toString(36).substr(2, 9),
      date: formattedDate,
      time: formattedTime
    };

    const updated = [fullAcc, ...savedAccounts];
    setSavedAccounts(updated);
    localStorage.setItem('cbe_saved_accounts', JSON.stringify(updated));
    triggerToast('ACC SAVED');
  };

  // Quick Send connector
  const handleSelectForTransfer = (accountNo: string) => {
    setPrefilledAccount(accountNo);
    setCurrentView('send_money');
  };

  // Send Money flow form submit
  const handleSendMoneySubmit = (details: TransactionDetails) => {
    setCurrentTransfer(details);
    setCurrentView('confirm_transfer');
  };

  // Confirmation screen accepted
  const handleConfirmTransfer = () => {
    setCurrentView('authentication');
  };

  // Pin entry screen authenticated
  const handlePinSuccess = () => {
    // If "Save this account for later" is checked, trigger 'ACC SAVED' notification and commit to db
    if (currentTransfer?.saveAccount) {
      const alreadySaved = savedAccounts.some(acc => acc.accountNumber === currentTransfer.accountNumber);
      
      if (!alreadySaved) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        const formattedTime = today.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        const savedItem: SavedAccount = {
          id: Math.random().toString(36).substr(2, 9),
          accountNumber: currentTransfer.accountNumber,
          bankName: currentTransfer.bank.name,
          receiverName: currentTransfer.receiverName,
          date: formattedDate,
          time: formattedTime,
          lastAmount: currentTransfer.amount,
          reason: currentTransfer.reason
        };

        const updated = [savedItem, ...savedAccounts];
        setSavedAccounts(updated);
        localStorage.setItem('cbe_saved_accounts', JSON.stringify(updated));
        
        // Instant required notification popup
        triggerToast('ACC SAVED');
      } else {
        // Just update default amount
        const updated = savedAccounts.map(acc => {
          if (acc.accountNumber === currentTransfer.accountNumber) {
            return { ...acc, lastAmount: currentTransfer.amount, reason: currentTransfer.reason };
          }
          return acc;
        });
        setSavedAccounts(updated);
        localStorage.setItem('cbe_saved_accounts', JSON.stringify(updated));
      }
    }

    // Serialize successful transaction to history listing
    if (currentTransfer) {
      const storedHistoryText = localStorage.getItem('cbe_tx_history');
      let historyList = [];
      if (storedHistoryText) {
        try {
          historyList = JSON.parse(storedHistoryText);
        } catch (e) {}
      }
      
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = today.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const txRecord = {
        transactionId: currentTransfer.transactionId || 'FT' + Math.floor(Math.random() * 899999999999 + 100000000000),
        accountNumber: currentTransfer.accountNumber,
        receiverName: currentTransfer.receiverName,
        amount: currentTransfer.amount,
        date: formattedDate,
        time: formattedTime,
        bank: { name: currentTransfer.bank.name },
        reason: currentTransfer.reason || 'Transfer',
        status: 'SUCCESS'
      };

      const updatedHistory = [txRecord, ...historyList];
      localStorage.setItem('cbe_tx_history', JSON.stringify(updatedHistory));
    }

    // Progress to Step 6 Loading Secure Screen
    setCurrentView('loading');
  };

  // Secure Loading Spinner done
  const handleLoadingComplete = () => {
    // Progress to Step 7 final success receipt Screen
    setCurrentView('receipt');
  };

  // Completion workflow returning home
  const handleFinishTransaction = () => {
    setCurrentTransfer(null);
    setPrefilledAccount('');
    setCurrentView('main');
  };

  // Switch Sub-Views dynamically
  if (currentView === 'send_money') {
    return (
      <div className="w-full h-full relative">
        <SendMoneyScreen 
          onBack={() => setCurrentView('main')}
          onSubmit={handleSendMoneySubmit}
          savedAccounts={savedAccounts}
          prefilledAccount={prefilledAccount}
        />
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce leading-none">
            🚀 {toast}
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'confirm_transfer' && currentTransfer) {
    return (
      <div className="w-full h-full relative">
        {/* Render Send Money as underlying inactive screen inside the device wrapper */}
        <SendMoneyScreen 
          onBack={() => setCurrentView('main')}
          onSubmit={handleSendMoneySubmit}
          savedAccounts={savedAccounts}
          prefilledAccount={prefilledAccount}
        />
        {/* Confirms Drawer Slider Overlays */}
        <ConfirmTransferDrawer 
          details={currentTransfer}
          onConfirm={handleConfirmTransfer}
          onClose={() => setCurrentView('send_money')}
        />
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce leading-none">
            🚀 {toast}
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'authentication' && currentTransfer) {
    return (
      <div className="w-full h-full relative">
        <PinAuthScreen 
          details={currentTransfer}
          onBack={() => setCurrentView('send_money')}
          onSuccess={handlePinSuccess}
        />
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce leading-none">
            🚀 {toast}
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'loading') {
    return (
      <LoadingScreen onComplete={handleLoadingComplete} />
    );
  }

  if (currentView === 'receipt' && currentTransfer) {
    return (
      <ReceiptScreen 
        details={currentTransfer}
        onFinish={handleFinishTransaction}
      />
    );
  }

  if (currentView === 'history') {
    return (
      <div className="w-full h-full relative">
        <HistoryScreen 
          onBack={() => setCurrentView('main')}
          historyTransactions={[]}
          onClearHistoryProps={() => {
            triggerToast('HISTORY CLEARED');
          }}
        />
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce leading-none">
            🚀 {toast}
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'saved_accounts') {
    return (
      <div className="w-full h-full relative">
        <SavedAccountsScreen 
          onBack={() => setCurrentView('main')}
          savedAccounts={savedAccounts}
          onDeleteAccount={handleDeleteAccount}
          onUpdateAccount={handleUpdateAccount}
          onAddAccount={handleAddAccount}
          onSelectForTransfer={handleSelectForTransfer}
        />
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-[#E2B464]/30 text-[#FFE3A1] font-black text-[10.5px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-pulse leading-none bg-gradient-to-tr from-[#7A1B7B] to-[#59105A]">
            ✨ {toast}
          </div>
        )}
      </div>
    );
  }

  // Otherwise, default home page screen ('main')
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* Extended Header Purple Backdrop with gradient fade down to a soft pastel lavender */}
      <div className="absolute top-0 left-0 right-0 h-[290px] bg-gradient-to-b from-[#7A1B7B] to-[#59105A] rounded-b-[40px] z-0 shadow-sm"></div>
      
      {/* Scrollable Main Area */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-24 scrollbar-none">
         
         {/* Top Bar Header (App Logo + Name + Lang + Notification Alert) */}
         <div className="flex justify-between items-center px-5 pt-8 pb-5 text-white">
            <div className="flex items-center gap-2.5">
               {/* High-Fidelity CBEBirr App Launcher Icon Box */}
               <CbeBirrSquareLogo className="w-11 h-11 drop-shadow-md select-none transition-transform active:scale-95" />
               <div className="flex flex-col ml-0.5">
                  <h1 className="text-[15px] font-black leading-none tracking-wide text-white flex items-center gap-1">
                    CBEBirr
                  </h1>
                  <p className="text-[10px] text-white/80 font-bold mt-1 tracking-tight">ባለበት ሁሉ አለ!</p>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <span className="font-extrabold text-[11px] opacity-90 tracking-wide bg-white/10 px-2 py-0.5 rounded-full border border-white/5 cursor-pointer hover:bg-white/20 transition-all uppercase">
                 EN
               </span>
               <button 
                 onClick={() => {
                   setCurrentView('history');
                 }}
                 title="Transaction History"
                 className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all text-white relative cursor-pointer flex items-center justify-center"
               >
                  <Clock size={16} className="opacity-95" />
               </button>
               <button 
                 onClick={() => triggerToast("ALL NOTIFICATIONS CLEAR")}
                 title="Notifications"
                 className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all text-white relative cursor-pointer flex items-center justify-center"
               >
                  <Bell size={16} fill="white" className="opacity-90 animate-pulse" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#E2B464] rounded-full"></span>
               </button>
            </div>
         </div>

         {/* Premium Floating Account Card */}
         <div className="mx-4 mt-1 mb-6 text-white relative z-10">
            <div className={`relative rounded-3xl p-5 shadow-2xl border border-white/15 overflow-hidden transition-all duration-700
              ${cardTheme === 'default' 
                ? 'bg-gradient-to-br from-[#6A166C] via-[#4D0D4E] to-[#360137]' 
                : 'bg-gradient-to-br from-[#7B1AA7] via-[#52107C] to-[#2E024F]'
              }
            `}>
               
               {/* Glossy radial overlay card background */}
               <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,186,101,0.12),transparent_60%)] pointer-events-none"></div>
               <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[70%] bg-white/5 rounded-full blur-[80px]"></div>

               {/* Inner Card Card Header Info */}
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 flex-shrink-0 drop-shadow-md">
                       <CbeLogo className="w-12 h-12" />
                    </div>
                    <div className="flex flex-col text-left justify-center">
                       <h2 className="text-[12px] font-black tracking-wide leading-snug text-[#FFE3A1] drop-shadow-sm font-sans">
                         የኢትዮጵያ ንግድ ባንክ
                       </h2>
                       <h3 className="text-[8px] font-extrabold tracking-wider leading-none text-[#FFE3A1] opacity-90 uppercase">
                         Commercial Bank of Ethiopia
                       </h3>
                    </div>
                 </div>

                 {/* Brush theme selector on the right */}
                 <button 
                   onClick={toggleCardTheme}
                   aria-label="Toggle card theme"
                   className="p-1.5 rounded-full bg-white/5 border border-white/10 active:scale-90 active:bg-white/10 transition-all text-[#FFE3A1]"
                 >
                   <Paintbrush size={13} className="opacity-90" />
                 </button>
               </div>

               {/* Center Phone Block with gold color */}
               <div className="text-center mb-5 relative">
                  <div className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#FFE3A1] tracking-wider drop-shadow-sm">
                    <Phone size={11} className="text-[#FFE3A1]" /> +251 9********
                  </div>
                  <div className="text-[8.5px] font-black tracking-[0.25em] text-white/60 uppercase mt-0.5">
                     Welcome Back
                  </div>
               </div>

               {/* Interactive Frosted Glass Balances */}
               <div className="flex gap-3 justify-center mb-0.5">
                  
                  {/* Balance card */}
                  <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white shadow-md flex flex-col justify-center relative transition-shadow hover:shadow-lg">
                     <div className="flex items-center justify-between text-[8px] font-extrabold text-[#FFE3A1] opacity-90 uppercase tracking-tighter mb-1.5">
                       <span>Balance (ETB)</span>
                       <button 
                         onClick={() => setShowBalance(!showBalance)}
                         aria-label="toggle balance"
                         className="p-0.5 hover:text-white transition-colors"
                       >
                         {showBalance ? <Eye size={11} /> : <EyeOff size={11} />}
                       </button>
                     </div>
                     <div className="text-[14px] font-black tracking-wide drop-shadow-md transition-all">
                       {showBalance ? "14,580.45" : "******"}
                     </div>
                  </div>

                  {/* Reward card */}
                  <div className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white shadow-md flex flex-col justify-center relative transition-shadow hover:shadow-lg">
                     <div className="flex items-center justify-between text-[8px] font-extrabold text-[#FFE3A1] opacity-90 uppercase tracking-tighter mb-1.5">
                       <span>Reward (ETB)</span>
                       <button 
                         onClick={() => setShowReward(!showReward)}
                         aria-label="toggle reward"
                         className="p-0.5 hover:text-white transition-colors"
                       >
                         {showReward ? <Eye size={11} /> : <EyeOff size={11} />}
                       </button>
                     </div>
                     <div className="text-[14px] font-black tracking-wide drop-shadow-md transition-all">
                       {showReward ? "250.00" : "******"}
                     </div>
                  </div>

               </div>
               
               {/* Quick Sparkle design accent */}
               <div className="absolute right-3.5 bottom-3.5 opacity-10">
                 <Sparkles size={16} />
               </div>

            </div>
         </div>

         {/* Quick Access White Panel Layout */}
         <div className="px-5 w-full relative z-10 pt-1">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">QUICK ACCESS</h3>
               <button 
                 onClick={() => setCurrentView('saved_accounts')}
                 className="text-[#7A1B7B] font-extrabold text-[10px] flex items-center gap-1 active:opacity-70 transition-opacity uppercase tracking-wider cursor-pointer"
               >
                 Saved Folders <Play size={8} className="fill-current" />
               </button>
            </div>

            {/* Standard Primary Features in 4x3 Grid (including Save Acc and Saved Acc Folder) */}
            <div className="grid grid-cols-4 gap-3 mb-[22px]">
               <QuickAccessItem icon={<Building2/>} label="Linked Bank Acct" />
               <QuickAccessItem icon={<Send/>} label="Send Money" onClick={() => setCurrentView('send_money')} />
               <QuickAccessItem icon={<Landmark/>} label="To CBE Acct" onClick={() => setCurrentView('send_money')} />
               <QuickAccessItem icon={<Smartphone/>} label="Air Time" />
               
               <QuickAccessItem icon={<Wallet/>} label="Cash Out" />
               <QuickAccessItem icon={<Gift/>} label="Airtime Package" />
               <QuickAccessItem icon={<CalendarClock/>} label="Scheduled Pay" />
               <QuickAccessItem icon={<QrCode/>} label="MagicPay" />

               {/* Core New Requirements: Save Acc and Saved Acc Folder */}
               <QuickAccessItem 
                 icon={<UserPlus/>} 
                 label="Save Acc" 
                 highlighted={true}
                 longPressLabel="Hold 1s"
                 onClick={() => {
                   setQuickSaveName('');
                   setQuickSaveAcct('');
                   setShowQuickSaveModal(true);
                 }}
                 onLongPress={() => {
                   setQuickSaveName('');
                   setQuickSaveAcct('');
                   setShowQuickSaveModal(true);
                 }}
               />
               <QuickAccessItem 
                 icon={<FolderHeart/>} 
                 label="Saved Acc" 
                 highlighted={true}
                 longPressLabel="Hold 1s"
                 onClick={() => setCurrentView('saved_accounts')} 
                 onLongPress={() => setCurrentView('saved_accounts')} 
               />
            </div>

            {/* Premium Interactive Fuel Promotional Banner */}
            <div className="bg-[#7A1B7B] rounded-[22px] p-4 flex justify-between items-center relative overflow-hidden mb-5 shadow-lg border border-purple-800">
               {/* Subtle background curved sweep in rich gold */}
               <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[140%] bg-gradient-to-br from-[#E2B464]/25 to-transparent transform rotate-12 rounded-full z-0 pointer-events-none"></div>
               <div className="absolute top-0 left-[-20%] w-[60%] h-[120%] bg-purple-900/40 transform -skew-x-12 z-0 pointer-events-none"></div>
               
               <div className="z-10 relative left-1 w-[68%]">
                  <p className="text-[8px] font-black text-[#E2B464] mb-1.5 uppercase tracking-widest flex items-center gap-1">
                     <Sparkles size={8} fill="currentColor" /> Promotion
                  </p>
                  <h4 className="text-white font-extrabold leading-tight text-[12.5px] tracking-wide mb-2.5">
                     የነዳጅ ክፍያዎችን በሲቢኢ ብር
                  </h4>
                  <button className="bg-white text-[#7A1B7B] active:scale-95 px-3 py-1.5 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-sm transition-transform hover:bg-[#FFE3A1]">
                     Details
                  </button>
               </div>
               
               {/* Custom SVG Realistic Yellow Fuel Dispenser Nozzle Graphic */}
               <div className="z-10 relative w-16 h-16 bg-gradient-to-tr from-slate-900 to-indigo-950 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
                  <svg viewBox="0 0 64 64" className="w-13 h-13">
                     {/* Circular indicator light ring */}
                     <circle cx="32" cy="32" r="28" fill="none" stroke="#E2B464" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />
                     {/* Sparkle sparkles */}
                     <path d="M12,18 L14,20 M52,48 L54,50" stroke="#FFE094" strokeWidth="1.5" strokeLinecap="round" />
                     
                     {/* Yellow Fuel Dispenser Nozzle gun visual */}
                     <g stroke="#F8D385" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        {/* Hose pipe black cord */}
                        <path d="M50,15 C45,20 42,28 38,36" stroke="#4B5563" strokeWidth="3" />
                        
                        {/* Main Gun Handle Body in Gold/Yellow */}
                        <path d="M22,34 L32,30 L38,36 L30,42 Z" fill="#DFAC56" stroke="#FFE094" strokeWidth="1.5" />
                        
                        {/* Trigger guard */}
                        <path d="M20,38 Q24,44 28,40" stroke="#FFE094" strokeWidth="1.2" />
                        
                        {/* Golden Fuel Dispenser Nozzle Pipe Spout */}
                        <path d="M22,34 L12,32 L8,35" stroke="#FFE094" strokeWidth="2.5" />
                        
                        {/* Liquid fuel drops spraying or dropping */}
                        <circle cx="6" cy="39" r="1.5" fill="#FFE094" stroke="none" />
                        <circle cx="10" cy="45" r="1" fill="#FFE094" stroke="none" />
                     </g>
                     
                     {/* Small white shine droplet */}
                     <path d="M8,32 A 4 4 0 0 1 14,35" stroke="#FFF" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
               </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-1.5 mb-7">
               <div className="w-5 h-1.5 bg-[#7A1B7B] rounded-full shadow-inner"></div>
               <div className="w-1.5 h-1.5 bg-[#7A1B7B] opacity-20 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-[#7A1B7B] opacity-20 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-[#7A1B7B] opacity-20 rounded-full"></div>
               <div className="w-1.5 h-1.5 bg-[#7A1B7B] opacity-20 rounded-full"></div>
            </div>

            {/* Secondary Services Area in 4-column Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <QuickAccessItem icon={<Building/>} label="Other Bank" />
                <QuickAccessItem icon={<Wallet/>} label="Other Wallet" />
                <QuickAccessItem icon={<Zap/>} label="Quick" />
                <QuickAccessItem icon={<QrCode/>} label="Fuel Pay" highlighted />
            </div>
         </div>
      </div>

      {/* Step 2: Quick Save Modal Overlay as requested */}
      {showQuickSaveModal && (
        <div className="absolute inset-0 bg-black/60 z-[99] flex flex-col justify-end transition-opacity duration-300 animate-fadeIn">
          {/* Backdrop Touch Dismiss */}
          <div className="absolute inset-0 z-0" onClick={() => setShowQuickSaveModal(false)}></div>
          
          <div className="relative z-10 w-full bg-white rounded-t-[32px] p-5 pb-6 space-y-4 animate-slideUp text-slate-800">
             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                   <UserPlus className="text-[#7A1B7B]" size={18} />
                   <h4 className="text-[13px] font-black tracking-wide uppercase text-slate-800">Quick Save Recipient</h4>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowQuickSaveModal(false)}
                  className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
             </div>

             <div className="space-y-3.5">
                <div className="space-y-1">
                   <label className="block text-[8.5px] font-black tracking-wider text-[#7A1B7B] uppercase font-sans">
                     * Account Holder Name
                   </label>
                   <input 
                     type="text" 
                     value={quickSaveName}
                     onChange={(e) => setQuickSaveName(e.target.value)}
                     placeholder="MR MELKAMU MEKURIA BITEW"
                     className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-black text-slate-800 uppercase focus:outline-none focus:border-[#7A1B7B]"
                   />
                </div>

                <div className="space-y-1">
                   <label className="block text-[8.5px] font-black tracking-wider text-[#7A1B7B] uppercase font-sans">
                     * CBE Account Number
                   </label>
                   <input 
                     type="text" 
                     pattern="[0-9]*"
                     inputMode="numeric"
                     value={quickSaveAcct}
                     onChange={(e) => setQuickSaveAcct(e.target.value.replace(/\D/g, ''))}
                     placeholder="1000685600308"
                     className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-black tracking-wider text-slate-800 focus:outline-none focus:border-[#7A1B7B]"
                   />
                </div>
             </div>

             <button
               type="button"
               disabled={!quickSaveName || !quickSaveAcct}
               onClick={() => {
                 handleAddAccount({
                   accountNumber: quickSaveAcct,
                   receiverName: quickSaveName.toUpperCase(),
                   bankName: 'Commercial Bank of Ethiopia (CBE)',
                   lastAmount: '50',
                   reason: 'Transfer'
                 });
                 setShowQuickSaveModal(false);
                 setQuickSaveName('');
                 setQuickSaveAcct('');
               }}
               className="w-full bg-[#7A1B7B] text-white font-black text-[11px] tracking-widest uppercase py-3 rounded-2xl active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
             >
               Save Account
             </button>
          </div>
        </div>
      )}

      {/* Floating notifications for interactive feedback */}
      {toast && (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce leading-none border border-white/5 whitespace-nowrap">
          🚀 {toast}
        </div>
      )}

      {/* High-Fidelity Deep Purple curved Navigation Bar */}
      <div className="absolute bottom-0 w-full z-20 bg-[#7A1B7B] h-[72px] flex items-center justify-between px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] rounded-t-[20px] select-none text-white">
        
        {/* Curved Pocket Design for Home Button on Left side */}
        <div className="w-[74px] h-[74px] -mt-[38px] relative flex flex-col items-center select-none">
           {/* White Backdrop Pocket notch */}
           <div className="absolute top-[4px] w-[58px] h-[58px] bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-100 ring-2 ring-[#7A1B7B]/20">
              <button 
                className="w-[46px] h-[46px] bg-gradient-to-br from-[#7A1B7B] to-[#59105A] rounded-full flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                onClick={() => setCurrentView('main')}
              >
                 <Home size={20} fill="currentColor" strokeWidth={1} />
              </button>
           </div>
           
           {/* Labels aligned under */}
           <span className="absolute bottom-1 text-[9px] font-black text-white tracking-[0.1em] uppercase drop-shadow-sm">
              Home
           </span>
        </div>

        {/* The other four navigation tab buttons */}
        <button 
          onClick={() => setCurrentView('send_money')}
          className="flex-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-95 cursor-pointer"
        >
           <CreditCard size={18} strokeWidth={2.2} />
           <span className="text-[8.5px] font-bold mt-1 tracking-widest uppercase">Pay</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('saved_accounts')}
          className="flex-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-95 cursor-pointer"
        >
           <Smartphone size={18} strokeWidth={2.2} />
           <span className="text-[8.5px] font-bold mt-1 tracking-widest uppercase">Saved Folder</span>
        </button>
        
        <button 
          onClick={() => alert("Mini Apps under development.")}
          className="flex-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-95 cursor-pointer"
        >
           <LayoutGrid size={18} strokeWidth={2.2} />
           <span className="text-[8.5px] font-bold mt-1 tracking-widest uppercase">Mini Apps</span>
        </button>
        
        <button 
          onClick={() => alert("Commercial Bank of Ethiopia (CBE) - Always Trustworthy.")}
          className="flex-1 flex flex-col items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-95 cursor-pointer"
        >
           <Menu size={18} strokeWidth={2.2} />
           <span className="text-[8.5px] font-bold mt-1 tracking-widest uppercase">Others</span>
        </button>
      </div>

    </div>
  );
}

const QuickAccessItem = ({ 
  icon, 
  label, 
  highlighted = false,
  onClick,
  onLongPress,
  longPressLabel = ""
}: { 
  icon: React.ReactElement; 
  label: string; 
  highlighted?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
  longPressLabel?: string;
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [percent, setPercent] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent double triggers
    if (timerRef.current) return;
    
    setIsPressing(true);
    setPercent(0);
    
    const startTime = Date.now();
    const duration = 800; // 800ms
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPercent(progress);
    }, 20);

    timerRef.current = setTimeout(() => {
      stopPress();
      if (onLongPress) {
        onLongPress();
      } else if (onClick) {
        onClick();
      }
    }, duration);
  };

  const stopPress = () => {
    setIsPressing(false);
    setPercent(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleRelease = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPressing) {
      const wasHolding = percent > 15;
      stopPress();
      // If they release quickly, treat it as a standard tap/click!
      if (!wasHolding && onClick) {
        onClick();
      } else if (wasHolding && onLongPress) {
        // Under rapid release but enough hold, trigger long press directly
        onLongPress();
      } else if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div 
      onMouseDown={startPress}
      onMouseUp={handleRelease}
      onMouseLeave={stopPress}
      onTouchStart={startPress}
      onTouchEnd={handleRelease}
      className="flex flex-col items-center gap-1 outline-none group active:scale-95 transition-all select-none cursor-pointer relative"
    >
       <div className={`w-[60px] h-[60px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow hover:border-slate-350 transition-all relative
          ${highlighted ? 'border-[#7A1B7B]/35 text-[#7A1B7B] shadow-lg shadow-purple-800/10' : 'text-[#7A1B7B]'}
       `}>
          {/* Active Press Progress circular ring */}
          {isPressing && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 36 36">
              <path
                className="text-purple-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#E2B464]"
                strokeWidth="3.5"
                strokeDasharray={`${percent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          )}

          {React.cloneElement(icon, { size: 21, strokeWidth: 2.2 })}
          {highlighted && (
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7A1B7B] rounded-full border border-white text-[8px] text-[#FFE3A1] flex items-center justify-center font-black animate-bounce shadow">!</span>
          )}
          
          {/* Hold tag cue */}
          {isPressing && (
            <div className="absolute -top-6 bg-slate-900/90 text-white font-black text-[7px] text-center px-1.5 py-0.5 rounded uppercase leading-none whitespace-nowrap tracking-wider shadow-md pointer-events-none z-30">
              Holding...
            </div>
          )}
       </div>
       <span className="text-[8px] font-bold text-slate-700 text-center leading-snug mt-1 max-w-[62px]">
          {label}
       </span>
       {longPressLabel && (
         <span className="text-[6.5px] font-black text-[#7A1B7B] tracking-tighter uppercase leading-none mt-0.5 opacity-80 block text-center">
           {longPressLabel}
         </span>
       )}
    </div>
  );
};

// Squarish CBE Birr Plus launcher icon visual with purple rounded corners & golden accents
const CbeBirrSquareLogo = ({ className = "w-11 h-11" }: { className?: string }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-[#7A1B7B] to-[#450C46] rounded-[10px] p-1 flex flex-col items-center justify-center select-none shadow-md overflow-hidden relative border border-white/20`}>
      {/* Wave decoration overlay */}
      <div className="absolute right-[-15%] bottom-[-15%] w-[80%] h-[50%] bg-[#E2B464]/20 transform rotate-12 rounded-full"></div>
      <div className="absolute left-[-20%] top-[-20%] w-[50%] h-[50%] bg-[#8A228C] rounded-full filter blur-xs"></div>
      
      <span className="text-[7.5px] font-black text-white/95 uppercase tracking-widest leading-none z-10">CBE</span>
      <span className="text-[11.5px] font-extrabold italic text-[#E2B464] tracking-tight leading-none z-10 font-sans mt-0.5">Birr</span>
    </div>
  );
};

const CbeLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  const [error, setError] = React.useState(false);

  if (!error) {
    return (
      <img
        src="images (4).jpeg"
        alt="CBE Logo"
        className={`${className} object-contain rounded-full shadow-inner`}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="goldMetallicDash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE094" />
          <stop offset="30%" stopColor="#DFAC56" />
          <stop offset="60%" stopColor="#92621C" />
          <stop offset="85%" stopColor="#F8D385" />
          <stop offset="100%" stopColor="#A27329" />
        </linearGradient>
        <radialGradient id="purpleGradDash" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#8A228C" />
          <stop offset="60%" stopColor="#5E115F" />
          <stop offset="100%" stopColor="#300331" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#purpleGradDash)" stroke="url(#goldMetallicDash)" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="url(#goldMetallicDash)" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
      <g transform="translate(50, 50)" stroke="url(#goldMetallicDash)" strokeWidth="2.5" fill="none">
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(120)" />
        <ellipse cx="0" cy="0" rx="14" ry="28" transform="rotate(240)" />
        <circle cx="0" cy="0" r="7" fill="url(#goldMetallicDash)" stroke="none" />
        <circle cx="0" cy="0" r="14" strokeWidth="1.5" opacity="0.9" />
      </g>
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.15" />
    </svg>
  );
};
