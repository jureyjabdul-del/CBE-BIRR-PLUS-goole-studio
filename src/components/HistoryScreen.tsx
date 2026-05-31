import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  TrendingDown, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Calendar
} from 'lucide-react';
import { TransactionDetails } from '../types';

interface HistoryScreenProps {
  onBack: () => void;
  historyTransactions: TransactionDetails[];
  onClearHistory: () => void;
}

export default function HistoryScreen({ 
  onBack, 
  historyTransactions, 
  onClearHistoryProps 
}: { 
  onBack: () => void; 
  historyTransactions: TransactionDetails[]; 
  onClearHistoryProps: () => void 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedTx, setSelectedTx] = useState<TransactionDetails | null>(null);

  // Mock initial transactions if none exists
  const [txs, setTxs] = useState<any[]>(() => {
    const raw = localStorage.getItem('cbe_tx_history');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // High-fidelity prefilled transactions
    const defaultTxs = [
      {
        transactionId: 'FT202615951832',
        accountNumber: '1000685600308',
        receiverName: 'MR MELKAMU MEKURIA BITEW',
        amount: '450.00',
        date: '31-May-2026',
        time: '07:34 PM',
        bank: { name: 'Commercial Bank of Ethiopia (CBE)' },
        reason: 'Invoice Payment',
        status: 'SUCCESS'
      },
      {
        transactionId: 'FT202685710255',
        accountNumber: '1000884432211',
        receiverName: 'MR MUNDINO DUBELA H/BAMUD',
        amount: '120.00',
        date: '30-May-2026',
        time: '02:15 PM',
        bank: { name: 'Commercial Bank of Ethiopia (CBE)' },
        reason: 'Lunch Pay',
        status: 'SUCCESS'
      },
      {
        transactionId: 'FT202621932901',
        accountNumber: '1000998877665',
        receiverName: 'CHALA KEBEBE',
        amount: '1500.00',
        date: '28-May-2026',
        time: '10:05 AM',
        bank: { name: 'Awash Bank' },
        reason: 'House Rental Fee',
        status: 'FAILED'
      },
      {
        transactionId: 'FT202517839441',
        accountNumber: '1000214392233',
        receiverName: 'ALMAZ DESTA BEKELE',
        amount: '75.00',
        date: '24-May-2026',
        time: '04:12 PM',
        bank: { name: 'Commercial Bank of Ethiopia (CBE)' },
        reason: 'Pocket Money',
        status: 'SUCCESS'
      }
    ];
    localStorage.setItem('cbe_tx_history', JSON.stringify(defaultTxs));
    return defaultTxs;
  });

  // Handle clearing history
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your transaction history?')) {
      setTxs([]);
      localStorage.setItem('cbe_tx_history', JSON.stringify([]));
      onClearHistoryProps();
    }
  };

  // Filter transaction list
  const filteredTxs = txs.filter(tx => {
    const matchesSearch = 
      (tx.receiverName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.accountNumber || '').includes(searchTerm) ||
      (tx.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'success' && tx.status !== 'FAILED') ||
      (filterType === 'failed' && tx.status === 'FAILED');
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col relative overflow-hidden text-slate-800">
      
      {/* Top Header matching purple theme exactly */}
      <div className="bg-[#7A1B7B] pt-8 pb-4 px-4 flex justify-between items-center text-white shrink-0 z-10 shadow-md">
        <button 
          onClick={onBack}
          aria-label="Back to dashboard"
          className="p-1 px-2 rounded-lg bg-white/10 active:bg-white/20 transition-all text-white flex items-center"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="font-extrabold text-[13px] tracking-widest uppercase flex items-center gap-1">
          <Clock size={14} /> Tx History
        </span>
        
        <button
          onClick={handleClear}
          disabled={txs.length === 0}
          className="p-1 px-2.5 rounded-lg bg-red-100 hover:bg-red-200 disabled:opacity-50 active:scale-95 transition-all text-red-700 font-extrabold text-[9px] uppercase flex items-center gap-1"
        >
          <Trash2 size={11} /> Clear All
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0 select-none">
        
        {/* Search & Tabs */}
        <div className="p-3 bg-white border-b border-slate-150 space-y-2.5">
          {/* Search Box */}
          <div className="bg-slate-100 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-slate-200 focus-within:border-[#7A1B7B]/30 focus-within:bg-white transition-all">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receiver, acct, or TxID..."
              className="w-full focus:outline-none text-[11px] font-bold text-slate-700 bg-transparent"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex gap-1.5 text-[9.5px]">
            {(['all', 'success', 'failed'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-1 rounded-lg font-black uppercase text-center border transition-all ${
                  filterType === type 
                    ? 'bg-[#7A1B7B] border-[#7A1B7B] text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable List of Past Transactions */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 pb-24 scrollbar-none">
          {filteredTxs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-extrabold text-[12px] text-slate-600">No transactions recorded</p>
                <p className="text-[10px] text-slate-400 font-medium">Any transfer completed on the app will appear here.</p>
              </div>
            </div>
          ) : (
            filteredTxs.map((tx, idx) => {
              const TxStatus = tx.status || 'SUCCESS';
              const isFailed = TxStatus === 'FAILED';
              
              return (
                <div 
                  key={tx.transactionId || idx}
                  onClick={() => setSelectedTx(selectedTx?.transactionId === tx.transactionId ? null : tx)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 hover:shadow-md transition-all relative flex flex-col text-left cursor-pointer active:bg-slate-50"
                >
                  {/* Status Indicator Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        isFailed 
                          ? 'bg-red-50 text-red-500 border border-red-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        <TrendingDown size={15} className={isFailed ? 'rotate-180 text-red-500' : 'text-emerald-600'} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[11px] text-slate-800 truncate leading-tight">
                          {tx.receiverName}
                        </h4>
                        <p className="text-[9px] font-mono text-slate-400 tracking-wider">
                          Acct: {tx.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="font-black text-[11.5px] text-slate-800 leading-tight">
                        {tx.amount} <span className="text-[8px] font-bold text-slate-400 uppercase">ETB</span>
                      </span>
                      <span className={`text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded-full mt-1 ${
                        isFailed 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {TxStatus}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Transaction Details view on Click */}
                  {selectedTx && selectedTx.transactionId === tx.transactionId && (
                    <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 text-[10px] space-y-1.5 grid grid-cols-2 gap-x-4 bg-slate-50 p-2.5 rounded-xl animate-fadeIn">
                      <div className="col-span-2 text-[8px] font-black text-[#7A1B7B]/80 tracking-widest uppercase leading-none pb-1">
                        Transaction details
                      </div>
                      <div className="font-medium text-slate-500">
                        Date / Time:
                        <span className="block font-bold text-slate-800">{tx.date} - {tx.time}</span>
                      </div>
                      <div className="font-medium text-slate-500">
                        Bank:
                        <span className="block font-bold text-slate-800 truncate">{tx.bank?.name || 'CBE'}</span>
                      </div>
                      <div className="font-medium text-slate-500">
                        Tx Reference:
                        <span className="block font-mono font-bold text-red-950">{tx.transactionId}</span>
                      </div>
                      <div className="font-medium text-slate-500">
                        Reason:
                        <span className="block font-bold text-[#7A1B7B]">{tx.reason || 'Transfer'}</span>
                      </div>
                    </div>
                  )}

                  {/* Expansion indicator dots */}
                  <div className="text-[7.5px] font-extrabold text-slate-400 text-right mt-1.5 tracking-tighter opacity-70">
                    {selectedTx?.transactionId === tx.transactionId ? '▲ Click to collapse' : '▼ Click for details'}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
