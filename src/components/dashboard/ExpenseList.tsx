import React, { useState } from 'react';
import { Budget, Expense } from '../../types';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/format';

interface ExpenseListProps {
  expenses: Expense[];
  budgets: Budget[];
  onExpenseCreated: () => void;
  userId: string;
}

export function ExpenseList({ expenses, budgets, onExpenseCreated, userId }: ExpenseListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('expenses').insert({
      user_id: userId,
      amount: parseFloat(amount),
      category,
      description,
      budget_id: budgetId || null,
      date,
    });

    if (!error) {
      // Update budget spent amount if a budget was selected
      if (budgetId) {
        const budget = budgets.find(b => b.id === budgetId);
        if (budget) {
          await supabase
            .from('budgets')
            .update({ spent: budget.spent + parseFloat(amount) })
            .eq('id', budgetId);
        }
      }

      setIsCreating(false);
      setAmount('');
      setCategory('');
      setDescription('');
      setBudgetId('');
      setDate(new Date().toISOString().split('T')[0]);
      onExpenseCreated();
    }
  };

  const handleDelete = async (expense: Expense) => {
    const { error } = await supabase.from('expenses').delete().eq('id', expense.id);
    
    if (!error && expense.budgetId) {
      const budget = budgets.find(b => b.id === expense.budgetId);
      if (budget) {
        await supabase
          .from('budgets')
          .update({ spent: budget.spent - expense.amount })
          .eq('id', expense.budgetId);
      }
    }
    
    if (!error) {
      onExpenseCreated();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Expenses</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>New Expense</span>
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
              <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              Add Expense
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
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/60">Budget</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/60">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-white/10">
                  <td className="px-6 py-4 text-sm text-white">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{expense.description}</td>
                  <td className="px-6 py-4 text-sm text-white">{expense.category}</td>
                  <td className="px-6 py-4 text-sm text-white">
                    {budgets.find((b) => b.id === expense.budgetId)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-white text-right">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(expense)}
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