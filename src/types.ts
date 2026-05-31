/**
 * Shared Type Definitions for CBEBirr Application Flow
 */

export interface Bank {
  id: string;
  name: string;
  type: string;
  color: string;
  textColor: string;
  iconColor: string;
}

export interface SavedAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  receiverName: string;
  date: string;
  time: string;
  lastAmount: string;
  reason: string;
}

export interface TransactionDetails {
  bank: Bank;
  accountNumber: string;
  receiverName: string;
  amount: string;
  reason: string;
  saveAccount: boolean;
  transactionId?: string;
  date?: string;
  time?: string;
}
