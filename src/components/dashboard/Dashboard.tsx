import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Budget, Expense, Income } from '../../types';
import { BudgetList } from './BudgetList';
import { ExpenseList } from './ExpenseList';
import { IncomeList } from './IncomeList';
import { Overview } from './Overview';
import { Wallet, LogOut, PieChart, Receipt, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  session: any;
  onSignOut: () => void;
}

export function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'expenses' | 'income'>('overview');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    const fetchBudgets = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    const fetchExpenses = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    const fetchIncomes = supabase
      .from('incomes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    const [budgetsRes, expensesRes, incomesRes] = await Promise.all([
      fetchBudgets,
      fetchExpenses,
      fetchIncomes,
    ]);

    if (budgetsRes.data) setBudgets(budgetsRes.data);
    if (expensesRes.data) setExpenses(expensesRes.data);
    if (incomesRes.data) setIncomes(incomesRes.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-400 to-secondary-400 p-2 rounded-lg">
                <Wallet className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-100 to-secondary-100 text-transparent bg-clip-text">
                Budgeting System
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-black/30 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs - Now scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide -mb-px">
            <div className="flex space-x-1 min-w-max pb-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 md:px-4 py-2 md:py-3 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <PieChart size={18} className="md:w-5 md:h-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('budgets')}
                className={`px-3 md:px-4 py-2 md:py-3 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'budgets'
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <Receipt size={18} className="md:w-5 md:h-5" />
                <span>Budgets</span>
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-3 md:px-4 py-2 md:py-3 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'expenses'
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <ArrowDownRight size={18} className="md:w-5 md:h-5" />
                <span>Expenses</span>
              </button>
              <button
                onClick={() => setActiveTab('income')}
                className={`px-3 md:px-4 py-2 md:py-3 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'income'
                    ? 'border-primary-400 text-primary-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <ArrowUpRight size={18} className="md:w-5 md:h-5" />
                <span>Income</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding for mobile */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {activeTab === 'overview' && (
          <Overview budgets={budgets} expenses={expenses} incomes={incomes} />
        )}
        {activeTab === 'budgets' && (
          <BudgetList
            budgets={budgets}
            onBudgetCreated={fetchData}
            userId={session.user.id}
          />
        )}
        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            budgets={budgets}
            onExpenseCreated={fetchData}
            userId={session.user.id}
          />
        )}
        {activeTab === 'income' && (
          <IncomeList
            incomes={incomes}
            budgets={budgets}
            onIncomeCreated={fetchData}
            userId={session.user.id}
          />
        )}
      </main>
    </div>
  );
}