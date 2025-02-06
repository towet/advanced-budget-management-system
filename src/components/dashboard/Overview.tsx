import React from 'react';
import { Budget, Expense, Income } from '../../types';
import { PieChart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface OverviewProps {
  budgets: Budget[];
  expenses: Expense[];
  incomes: Income[];
}

export function Overview({ budgets, expenses, incomes }: OverviewProps) {
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/80">Total Balance</h3>
            <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {balance >= 0 ? (
                <ArrowUpRight className="text-green-400" size={24} />
              ) : (
                <ArrowDownRight className="text-red-400" size={24} />
              )}
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(balance)}</p>
        </div>

        <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/80">Total Income</h3>
            <div className="p-2 rounded-lg bg-primary-500/20">
              <TrendingUp className="text-primary-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/80">Total Expenses</h3>
            <div className="p-2 rounded-lg bg-secondary-500/20">
              <ArrowDownRight className="text-secondary-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/80">Total Budget</h3>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <PieChart className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalBudget)}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...expenses, ...incomes]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      'source' in item
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {'source' in item ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {'description' in item ? item.description : item.source}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    'source' in item ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatCurrency(Math.abs(item.amount))}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}