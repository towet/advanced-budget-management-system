import React, { useState } from 'react';
import { Budget, Income } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface IncomeListProps {
  incomes: Income[];
  budgets: Budget[];
  onIncomeCreated: () => void;
  userId: string;
}

export function IncomeList({ incomes, budgets, onIncomeCreated, userId }: IncomeListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [budgetId, setBudgetId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('incomes').insert({
      user_id: userId,
      amount: parseFloat(amount),
      source,
      recurring,
      budget_id: budgetId || null,
      date,
    });

    if (!error) {
      setIsCreating(false);
      setAmount('');
      setSource('');
      setRecurring(false);
      setBudgetId('');
      setDate(new Date().toISOString().split('T')[0]);
      onIncomeCreated();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (!error) {
      onIncomeCreated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Income</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>New Income</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Budget</label>
              <select
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
              >
                <option value="">No Budget</option>
                {budgets.map((budget) => (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-white/80">
                Recurring Income
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Income
            </button>
          </div>
        </form>
      )}

      <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Source</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Budget</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white/60">Recurring</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/60">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="border-b border-white/10">
                  <td className="px-6 py-4 text-sm text-white">
                    {new Date(income.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{income.source}</td>
                  <td className="px-6 py-4 text-sm text-white">
                    {budgets.find((b) => b.id === income.budgetId)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-white text-center">
                    {income.recurring ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 text-sm text-white text-right">
                    ${income.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}