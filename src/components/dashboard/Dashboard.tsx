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
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-400 to-secondary-400 p-2 rounded-lg">
                <Wallet className="text-white" size={32} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-100 to-secondary-100 text-transparent bg-clip-text">
                Budgeting System
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-black/30 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-400 text-primary-400'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <PieChart size={20} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'budgets'
                  ? 'border-primary-400 text-primary-400'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Receipt size={20} />
              <span>Budgets</span>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'expenses'
                  ? 'border-primary-400 text-primary-400'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <ArrowDownRight size={20} />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-4 py-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'income'
                  ? 'border-primary-400 text-primary-400'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <ArrowUpRight size={20} />
              <span>Income</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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