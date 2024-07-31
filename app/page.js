'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export default function NewExpense() {
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [budgetData, setBudgetData] = useState({});
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    details: '',
    category: '',
    amount: '',
    main_category: '',
    method: '',
    from: '',
    budget: '', 
    // to_date_expense:'',
    // remaining_budget:''
  });


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/sheets/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'read', sheetName: 'budget-category' }),
        });
        const data = await response.json();
        console.log(data)
        // if (response.ok) {
        //   setCategories(data);
        if (response.ok) {
          // Parse the data into a dictionary
          const parsedData = data.reduce((acc, [key, value]) => {
            if (key && value) acc[key] = value;
            return acc;
          }, {});
          console.log(parsedData)

          setCategories(parsedData);
        } else {
          console.error('Failed to fetch categories:', data.error);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await fetch('/api/sheets/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'read', sheetName: 'budget' }),
        });
        const data = await response.json();
        if (response.ok) {
          const parsedData = data.reduce((acc, [category, amount]) => {
            if (category && amount) acc[category] = amount;
            return acc;
          }, {});
          setBudgetData(parsedData);
        } else {
          console.error('Failed to fetch budget data:', data.error);
        }
      } catch (err) {
        console.error('Error fetching budget data:', err);
      }
    };

    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (formData.category && budgetData[formData.category]) {
      const projectedBudget = budgetData[formData.category];
      console.log(projectedBudget)
      setFormData((prevData) => ({
        ...prevData,
        budget: projectedBudget,
        // remaining_budget: projectedBudget, // Assuming you want to initialize this as well
      }));
    }
  }, [formData.category, budgetData]);

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
      router.push('/report');
    } catch (err) {
      console.error('Error creating data:', err);
      setError(err.message);
    }
  };

  const handleGoToReport = () => {
    router.push('/report'); // Navigate to the report page
  };

  return (
    <div className="p-6">
      
  
        <h1 className="text-2xl font-bold mb-4">Add New Expense</h1>
         <button
        onClick={handleGoToReport}
        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 mt-4"
      >
        Go to Report
      </button>
   
     
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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
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
