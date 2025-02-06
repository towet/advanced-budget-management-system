import React, { useState } from 'react';
import { Budget } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/format';

interface BudgetListProps {
  budgets: Budget[];
  onBudgetCreated: () => void;
  userId: string;
}

export function BudgetList({ budgets, onBudgetCreated, userId }: BudgetListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('budgets').insert({
      user_id: userId,
      name,
      amount: parseFloat(amount),
      category,
      period,
      spent: 0,
    });

    if (!error) {
      setIsCreating(false);
      setName('');
      setAmount('');
      setCategory('');
      setPeriod('monthly');
      onBudgetCreated();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (!error) {
      onBudgetCreated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Budgets</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>New Budget</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
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
              <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
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
              Create Budget
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{budget.name}</h3>
                <p className="text-white/60">{budget.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Budget</span>
                <span className="text-white font-medium">
                  {formatCurrency(budget.amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Spent</span>
                <span className="text-white font-medium">
                  {formatCurrency(budget.spent)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Remaining</span>
                <span className="text-white font-medium">
                  {formatCurrency(budget.amount - budget.spent)}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-secondary-400"
                    style={{
                      width: `${Math.min(
                        (budget.spent / budget.amount) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}