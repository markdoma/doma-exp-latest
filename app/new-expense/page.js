'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewExpense() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    details: '',
    category: '',
    amount: '',
    method: '',
    from: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'create', values: Object.values(formData), sheetName: 'expenses' }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      router.push('/');
    } catch (err) {
      console.error('Error creating data:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Expense</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Details</label>
          <input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Method</label>
          <input
            type="text"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">From</label>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
