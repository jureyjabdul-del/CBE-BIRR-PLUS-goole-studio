import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Send, 
  Search, 
  Plus, 
  X, 
  Building2, 
  User, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { SavedAccount } from '../types';
import { BANK_LIST } from './SendMoneyScreen';

interface SavedAccountsScreenProps {
  onBack: () => void;
  savedAccounts: SavedAccount[];
  onDeleteAccount: (id: string) => void;
  onUpdateAccount: (account: SavedAccount) => void;
  onAddAccount: (account: Omit<SavedAccount, 'id' | 'date' | 'time'>) => void;
  onSelectForTransfer: (accountNumber: string) => void;
}

export default function SavedAccountsScreen({
  onBack,
  savedAccounts,
  onDeleteAccount,
  onUpdateAccount,
  onAddAccount,
  onSelectForTransfer,
}: SavedAccountsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [editingAcc, setEditingAcc] = useState<SavedAccount | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  
  // Add/Edit Form states
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formBankName, setFormBankName] = useState(BANK_LIST[0].name);
  const [formReceiverName, setFormReceiverName] = useState('');
  const [formLastAmount, setFormLastAmount] = useState('10');
  const [formReason, setFormReason] = useState('Pocket Money');

  // Filter accounts
  const filteredAccounts = savedAccounts.filter(acc => 
    acc.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.accountNumber.includes(searchTerm) ||
    acc.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (acc: SavedAccount) => {
    setEditingAcc(acc);
    setFormAccountNumber(acc.accountNumber);
    setFormBankName(acc.bankName);
    setFormReceiverName(acc.receiverName);
    setFormLastAmount(acc.lastAmount || '10');
    setFormReason(acc.reason || 'Transfer');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAcc || !formAccountNumber || !formReceiverName) return;

    onUpdateAccount({
      ...editingAcc,
      accountNumber: formAccountNumber,
      bankName: formBankName,
      receiverName: formReceiverName,
      lastAmount: formLastAmount,
      reason: formReason
    });

    setEditingAcc(null);
  };

  const startAdd = () => {
    setAddingNew(true);
    setFormAccountNumber('');
    setFormBankName(BANK_LIST[0].name);
    setFormReceiverName('');
    setFormLastAmount('10');
    setFormReason('Allowance');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountNumber || !formReceiverName) return;

    onAddAccount({
      accountNumber: formAccountNumber,
      bankName: formBankName,
      receiverName: formReceiverName,
      lastAmount: formLastAmount,
      reason: formReason
    });

    setAddingNew(false);
  };

  return (
    <div className="w-full h-full bg-slate-100 flex flex-col relative overflow-hidden text-slate-800">
      
      {/* Search Header Purple Bar */}
      <div className="bg-[#7A1B7B] pt-8 pb-4 px-4 flex justify-between items-center text-white shrink-0 z-10 shadow-md">
        <button 
          onClick={onBack}
          aria-label="Back to dashboard"
          className="p-1 px-2 rounded-lg bg-white/10 active:bg-white/20 transition-all text-white flex items-center"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <span className="font-extrabold text-[13px] tracking-widest uppercase">Saved Folder</span>
        
        <button
          onClick={startAdd}
          className="p-1 px-2.5 rounded-lg bg-[#FFE3A1] active:scale-95 transition-all text-[#7A1B7B] font-extrabold text-[10px] uppercase flex items-center gap-1"
        >
          <Plus size={11} strokeWidth={3} /> Add New
        </button>
      </div>

      {/* Internal Content Area */}
      <div className="flex-1 flex flex-col min-h-0 select-none">
        
        {/* Inline Search Bar */}
        <div className="p-3 bg-white border-b border-slate-150 flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-slate-200 focus-within:border-[#7A1B7B]/30 focus-within:bg-white transition-all">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receiver name or account..."
              className="w-full focus:outline-none text-[11px] font-bold text-slate-700 bg-transparent"
            />
          </div>
        </div>

        {/* Saved Accounts List scroll zone */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-20 scrollbar-none">
          {filteredAccounts.length === 0 ? (
            <div className="py-20 text-center text-slate-450 space-y-3">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FileText size={26} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-extrabold text-[12px] text-slate-600">No matched save records</p>
                <p className="text-[10px] text-slate-400 font-medium">Use the "Add New" button or make transfers to populate.</p>
              </div>
            </div>
          ) : (
            filteredAccounts.map((acc) => (
              <div 
                key={acc.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 hover:shadow-md transition-shadow relative flex flex-col"
              >
                {/* Account Details */}
                <div className="flex items-start gap-3.5 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#7A1B7B] font-bold shrink-0 shadow-inner">
                    <User size={16} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col text-left">
                    <h4 className="font-black text-[12px] text-slate-800 leading-snug truncate">
                      {acc.receiverName}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5 truncate flex items-center gap-1">
                      <span className="text-[#7A1B7B]">🏛️</span> {acc.bankName}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                      Acct: {acc.accountNumber}
                    </p>
                  </div>
                </div>

                {/* Sub row showing stats */}
                <div className="flex justify-between items-center pt-2 text-[9.5px]">
                  <div className="text-slate-400 leading-normal pl-0.5 font-bold">
                    Last amount: <strong className="text-slate-700">{acc.lastAmount || '10'} ETB</strong>
                  </div>
                  
                  {/* Actions Bar Buttons deletion-editing and transfer-sending */}
                  <div className="flex items-center gap-1.5">
                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete saved account for ${acc.receiverName}?`)) {
                          onDeleteAccount(acc.id);
                        }
                      }}
                      className="p-1 px-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-100 active:scale-90"
                      title="Delete account"
                    >
                      <Trash2 size={13} />
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => startEdit(acc)}
                      className="p-1 px-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 active:scale-90"
                      title="Edit account"
                    >
                      <Edit3 size={13} />
                    </button>
                    {/* Quick Send */}
                    <button
                      onClick={() => onSelectForTransfer(acc.accountNumber)}
                      className="p-1 px-2.5 bg-[#7A1B7B] active:scale-92 text-white font-black text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-sm shadow-purple-900/15"
                      title="Transfer Money"
                    >
                      <Send size={10} /> Send
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Adding / Editing Modal form overlay */}
      {(editingAcc || addingNew) && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end transition-opacity duration-300">
          <div className="absolute inset-0 z-0" onClick={() => { setEditingAcc(null); setAddingNew(false); }}></div>
          
          <form 
            onSubmit={editingAcc ? handleUpdate : handleAdd}
            className="relative z-10 w-full bg-white rounded-t-[32px] p-5 space-y-4 animate-slideUp text-slate-800"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="text-[13px] font-black text-slate-800 tracking-wide uppercase">
                {editingAcc ? '✏️ Edit Saved Account' : '➕ Add Saved Account'}
              </h4>
              <button 
                type="button"
                onClick={() => { setEditingAcc(null); setAddingNew(false); }}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Account field */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black tracking-wider uppercase text-slate-400">
                Account Number
              </label>
              <input 
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={formAccountNumber}
                onChange={(e) => setFormAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="1000884432211"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7A1B7B] text-[11.5px] font-bold"
              />
            </div>

            {/* Bank Selection select dropdown box */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black tracking-wider uppercase text-slate-400">
                Select Bank
              </label>
              <select 
                value={formBankName}
                onChange={(e) => setFormBankName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#7A1B7B] text-[11.5px] font-bold"
              >
                {BANK_LIST.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Receiver Name */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black tracking-wider uppercase text-slate-400">
                Receiver Name
              </label>
              <input 
                type="text"
                value={formReceiverName}
                onChange={(e) => setFormReceiverName(e.target.value)}
                placeholder="Receiver Name"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7A1B7B] text-[11.5px] font-bold"
              />
            </div>

            {/* Quick prefill stats */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="space-y-1">
                <label className="text-[8.5px] font-black tracking-widest text-slate-400 uppercase">
                  Default Amount (ETB)
                </label>
                <input 
                  type="number"
                  value={formLastAmount}
                  onChange={(e) => setFormLastAmount(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-[11px] font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-black tracking-widest text-slate-400 uppercase">
                  Reason
                </label>
                <input 
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="pocket money"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none text-[11px] font-bold"
                />
              </div>
            </div>

            {/* Save Buttons trigger */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#7A1B7B] hover:bg-[#610d62] text-white py-2.5 px-4 rounded-xl font-bold uppercase text-[10.5px] tracking-wider transition-colors cursor-pointer text-center"
              >
                {editingAcc ? 'Save Updates' : 'Add Account'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
