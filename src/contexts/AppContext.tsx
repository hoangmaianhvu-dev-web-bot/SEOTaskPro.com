import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { supabase } from '../lib/supabase';

export type Transaction = {
  id: number;
  type: 'task' | 'withdraw' | 'topup';
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'rejected';
};

export type User = {
  email: string;
  name: string;
  role: 'user' | 'admin';
  balance: number;
  tasksCompleted: number;
};

export type Task = {
  id: string;
  title: string;
  reward: number;
  progress: number;
  total: number;
  isHot: boolean;
  targetUrl: string;
};

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  balance: number;
  transactions: Transaction[];
  withdrawals: any[];
  deposits: any[];
  registeredUsers: User[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  deleteUser: (email: string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completeTask: (taskId: string, reward: number, title: string) => void;
  requestWithdrawal: (amount: number, bank: string, account: string) => boolean;
  approveWithdrawal: (id: number) => void;
  rejectWithdrawal: (id: number) => void;
  requestDeposit: (amount: number, game: string, package_name: string, gameId: string) => void;
  approveDeposit: (id: number) => void;
  rejectDeposit: (id: number) => void;
  showCelebration: boolean;
  setShowCelebration: (show: boolean) => void;
  announcements: any[];
  addAnnouncement: (announcement: any) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    const loadData = async () => {
      // Load user session from LocalStorage
      const savedUser = localStorage.getItem('app_user');
      let currentUserEmail = null;

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          currentUserEmail = parsedUser.email;
        } catch (e) {
          console.error("Error parsing saved user", e);
        }
      }

      // Fetch from Supabase
      try {
        const { data: dbUsers, error: userError } = await supabase.from('users').select('*');
        if (!userError && dbUsers) {
          setRegisteredUsers(dbUsers);
          if (currentUserEmail) {
            const currentUser = dbUsers.find(u => u.email === currentUserEmail);
            if (currentUser) {
              setUser(currentUser);
              setBalance(currentUser.balance || 0);
            } else {
              // User not found in DB anymore
              localStorage.removeItem('app_user');
            }
          }
        }

        const { data: dbTasks, error: taskError } = await supabase.from('tasks').select('*');
        if (!taskError && dbTasks) setTasks(dbTasks);

        const { data: dbTx, error: txError } = await supabase.from('transactions').select('*').order('id', { ascending: false });
        if (!txError && dbTx) setTransactions(dbTx);

        const { data: dbW, error: wError } = await supabase.from('withdrawals').select('*').order('id', { ascending: false });
        if (!wError && dbW) setWithdrawals(dbW);

        const { data: dbD, error: dError } = await supabase.from('deposits').select('*').order('id', { ascending: false });
        if (!dError && dbD) setDeposits(dbD);

        const { data: dbAnnouncements, error: aError } = await supabase.from('announcements').select('*').order('id', { ascending: false });
        if (!aError && dbAnnouncements) setAnnouncements(dbAnnouncements);
      } catch (e) {
        console.error('Supabase fetch error:', e);
      }

      // Task reset logic (simple date check)
      const lastResetDate = localStorage.getItem('app_last_reset_date');
      const today = new Date().toLocaleDateString('vi-VN');
      if (lastResetDate !== today) {
        localStorage.setItem('app_last_reset_date', today);
        // Reset tasks in Supabase
        try {
          await supabase.from('users').update({ tasks_completed: 0 }).neq('email', '');
          // Refetch users
          const { data: resetUsers } = await supabase.from('users').select('*');
          if (resetUsers) {
            setRegisteredUsers(resetUsers);
            if (currentUserEmail) {
              const currentUser = resetUsers.find(u => u.email === currentUserEmail);
              if (currentUser) {
                setUser(currentUser);
              }
            }
          }
        } catch (e) {
          console.error('Error resetting tasks:', e);
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      const updatedUser = { ...user, balance };
      localStorage.setItem('app_user', JSON.stringify(updatedUser));
      
      // Update in registered users list as well
      setRegisteredUsers(prev => {
        const index = prev.findIndex(u => u.email === user.email);
        if (index !== -1) {
          const newList = [...prev];
          newList[index] = updatedUser;
          return newList;
        }
        return [...prev, updatedUser];
      });
    } else {
      localStorage.removeItem('app_user');
    }
  }, [user, balance]);

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx = {
      ...tx,
      id: Date.now(),
      date: new Date().toLocaleString('vi-VN'),
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const completeTask = async (taskId: string, reward: number, title: string) => {
    const newBalance = balance + reward;
    setBalance(newBalance);
    if (user) {
      const updatedUser = { ...user, tasksCompleted: (user.tasksCompleted || 0) + 1, balance: newBalance };
      setUser(updatedUser);
      
      // Sync to Supabase
      try {
        await supabase.from('users').update({ 
          balance: newBalance, 
          tasks_completed: updatedUser.tasksCompleted 
        }).eq('email', user.email);
      } catch (e) { console.error(e); }
    }
    
    const tx = addTransaction({
      type: 'task',
      title: title,
      amount: reward,
      status: 'success'
    });

    try {
      await supabase.from('transactions').insert([{
        id: tx.id,
        type: 'task',
        title: title,
        amount: reward,
        status: 'success',
        user_email: user?.email,
        date: tx.date
      }]);
    } catch (e) { console.error(e); }
  };

  const requestWithdrawal = async (amount: number, bank: string, account: string) => {
    if (balance < amount) return false;
    const newBalance = balance - amount;
    setBalance(newBalance);
    
    const tx = addTransaction({
      type: 'withdraw',
      title: `Rút tiền về ${bank}`,
      amount: -amount,
      status: 'pending'
    });

    const newW = {
      id: tx.id,
      user_email: user?.email || 'user@example.com',
      amount,
      bank,
      account,
      status: 'pending',
      date: tx.date
    };
    setWithdrawals(prev => [newW, ...prev]);

    // Sync to Supabase
    try {
      await supabase.from('users').update({ balance: newBalance }).eq('email', user?.email);
      await supabase.from('transactions').insert([{
        id: tx.id,
        type: 'withdraw',
        title: tx.title,
        amount: -amount,
        status: 'pending',
        user_email: user?.email,
        date: tx.date
      }]);
      await supabase.from('withdrawals').insert([newW]);
    } catch (e) { console.error(e); }

    return true;
  };

  const approveWithdrawal = async (id: number) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'success' } : w));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'success' } : t));
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 10000);

    try {
      await supabase.from('withdrawals').update({ status: 'success' }).eq('id', id);
      await supabase.from('transactions').update({ status: 'success' }).eq('id', id);
    } catch (e) { console.error(e); }
  };

  const rejectWithdrawal = async (id: number) => {
    const w = withdrawals.find(w => w.id === id);
    if (w && w.status === 'pending') {
      const newBalance = balance + w.amount;
      setBalance(newBalance); // refund
      
      try {
        await supabase.from('users').update({ balance: newBalance }).eq('email', w.user_email);
      } catch (e) { console.error(e); }
    }
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' } : w));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));

    try {
      await supabase.from('withdrawals').update({ status: 'rejected' }).eq('id', id);
      await supabase.from('transactions').update({ status: 'rejected' }).eq('id', id);
    } catch (e) { console.error(e); }
  };

  const requestDeposit = async (amount: number, game: string, package_name: string, gameId: string) => {
    const tx = addTransaction({
      type: 'topup',
      title: `Nạp ${package_name} - ${game}`,
      amount: amount,
      status: 'pending'
    });

    const newD = {
      id: tx.id,
      user_email: user?.email || 'user@example.com',
      amount,
      game,
      package_name,
      gameId,
      status: 'pending',
      date: tx.date
    };
    setDeposits(prev => [newD, ...prev]);

    try {
      await supabase.from('transactions').insert([{
        id: tx.id,
        type: 'topup',
        title: tx.title,
        amount: amount,
        status: 'pending',
        user_email: user?.email,
        date: tx.date
      }]);
      await supabase.from('deposits').insert([newD]);
    } catch (e) { console.error(e); }
  };

  const approveDeposit = async (id: number) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'success' } : d));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'success' } : t));

    try {
      await supabase.from('deposits').update({ status: 'success' }).eq('id', id);
      await supabase.from('transactions').update({ status: 'success' }).eq('id', id);
    } catch (e) { console.error(e); }
  };

  const rejectDeposit = async (id: number) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));

    try {
      await supabase.from('deposits').update({ status: 'rejected' }).eq('id', id);
      await supabase.from('transactions').update({ status: 'rejected' }).eq('id', id);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (email: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.email !== email));
    notify(`Đã xóa người dùng ${email}`, "success");

    try {
      await supabase.from('users').delete().eq('email', email);
    } catch (e) { console.error(e); }
  };

  const addAnnouncement = async (announcement: any) => {
    const newAnnouncement = {
      ...announcement,
      id: Date.now(),
      time: new Date().toLocaleString('vi-VN'),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);

    try {
      await supabase.from('announcements').insert([newAnnouncement]);
    } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{
      user, setUser, balance, transactions, withdrawals, deposits, registeredUsers, setRegisteredUsers, deleteUser,
      tasks, setTasks,
      completeTask, requestWithdrawal, approveWithdrawal, rejectWithdrawal,
      requestDeposit, approveDeposit, rejectDeposit,
      showCelebration, setShowCelebration,
      announcements, addAnnouncement
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
