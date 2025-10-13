
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User, KycStatus, Transaction, TransactionType, VipTier, Currency } from '../types';
import { VIP_TIERS } from '../constants';
import { useTutorial } from '../hooks/useTutorial';

interface UserContextType {
  user: User | null;
  transactions: Transaction[];
  progressiveJackpot: number;
  login: (email: string) => void;
  logout: () => void;
  updateKycStatus: (status: KycStatus) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  addVipPoints: (points: number) => void;
  placeBet: (amount: number) => boolean;
  addWinnings: (amount: number) => void;
  incrementJackpot: (amount: number) => void;
  resetJackpot: () => void;
  displayCurrency: Currency;
  changeDisplayCurrency: (currency: Currency) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const INITIAL_JACKPOT = 6666.66;

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [progressiveJackpot, setProgressiveJackpot] = useState<number>(INITIAL_JACKPOT);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('USD');
  const { startTutorial } = useTutorial();

  const changeDisplayCurrency = (currency: Currency) => {
    setDisplayCurrency(currency);
  };

  const incrementJackpot = (amount: number) => {
    // A small percentage of the bet contributes to the jackpot
    setProgressiveJackpot(prev => prev + amount * 0.05); 
  };
  
  const resetJackpot = () => {
    setProgressiveJackpot(INITIAL_JACKPOT);
  };

  // FIX: This function was incomplete due to a copy-paste error.
  // It has been completed to correctly create and add a new transaction.
  const addTransaction = useCallback((type: TransactionType, amount: number, status: 'Completed' | 'Pending') => {
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type,
      amount,
      // FIX: 'new D' was a typo, corrected to 'new Date()'. This fixes the "Cannot find name 'D'" error.
      date: new Date(),
      // FIX: The 'status' property was missing from the transaction object.
      status,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const login = (email: string) => {
    const newUser: User = {
      email,
      balance: 1000,
      bonusBalance: 0,
      kycStatus: KycStatus.UNVERIFIED,
      vipTier: VipTier.NEOPHYTE,
      vipPoints: 0,
    };
    setUser(newUser);
    startTutorial();
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
  };

  const updateKycStatus = (status: KycStatus) => {
    if (user) {
      setUser({ ...user, kycStatus: status });
    }
  };

  const addVipPoints = (points: number) => {
    if (user) {
        const newTotalPoints = user.vipPoints + points;
        let newTier = user.vipTier;
        
        for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
            if (newTotalPoints >= VIP_TIERS[i].pointsRequired) {
                newTier = VIP_TIERS[i].level;
                break;
            }
        }
        setUser({ ...user, vipPoints: newTotalPoints, vipTier: newTier });
    }
  };

  const deposit = (amount: number) => {
    if (user) {
      const isFirstDeposit = transactions.filter(t => t.type === TransactionType.DEPOSIT).length === 0;
      const bonus = isFirstDeposit ? amount : 0;
      setUser({ ...user, balance: user.balance + amount, bonusBalance: user.bonusBalance + bonus });
      addTransaction(TransactionType.DEPOSIT, amount, 'Completed');
    }
  };

  const withdraw = (amount: number) => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      addTransaction(TransactionType.WITHDRAWAL, amount, 'Pending');
    }
  };

  const placeBet = (amount: number): boolean => {
    if (user && user.balance >= amount) {
      setUser({ ...user, balance: user.balance - amount });
      incrementJackpot(amount);
      addVipPoints(amount); // 1 point per $1
      return true;
    }
    return false;
  };

  const addWinnings = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  const value = {
    user,
    transactions,
    progressiveJackpot,
    login,
    logout,
    updateKycStatus,
    deposit,
    withdraw,
    addVipPoints,
    placeBet,
    addWinnings,
    incrementJackpot,
    resetJackpot,
    displayCurrency,
    changeDisplayCurrency,
  };

  // FIX: The component was not returning JSX, causing a type error.
  // Added the provider to wrap children and provide the context value.
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
