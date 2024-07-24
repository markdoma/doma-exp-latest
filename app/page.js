'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ item: '', projected: '', actual: '' });
  const [editItem, setEditItem] = useState({ index: null, item: '', projected: '', actual: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sheets/read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operation: 'read', range: 'Sheet1!A:C' }) });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setData(result);
      console.log(data)
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'create', values: [newItem.item, newItem.projected, newItem.actual] }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await fetchData();
      setNewItem({ item: '', projected: '', actual: '' });
    } catch (err) {
      console.error('Error creating data:', err);
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const range = `Sheet1!A${editItem.index + 2}:C${editItem.index + 2}`;
      const response = await fetch('/api/sheets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'update', range, values: [editItem.item, editItem.projected, editItem.actual] }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await fetchData();
      setEditItem({ index: null, item: '', projected: '', actual: '' });
    } catch (err) {
      console.error('Error updating data:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (index) => {
    try {
      const range = `Sheet1!A${index + 2}:C${index + 2}`;
      const response = await fetch('/api/sheets/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'delete', range }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting data:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expense Report</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Expense Item"
            value={newItem.item}
            onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Projected Amount"
            value={newItem.projected}
            onChange={(e) => setNewItem({ ...newItem, projected: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Actual Amount"
            value={newItem.actual}
            onChange={(e) => setNewItem({ ...newItem, actual: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Update Item</h2>
        {editItem.index !== null && (
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Expense Item"
              value={editItem.item}
              onChange={(e) => setEditItem({ ...editItem, item: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              placeholder="Projected Amount"
              value={editItem.projected}
              onChange={(e) => setEditItem({ ...editItem, projected: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              placeholder="Actual Amount"
              value={editItem.actual}
              onChange={(e) => setEditItem({ ...editItem, actual: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
            >
              Update
            </button>
          </div>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="w-full bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-gray-600">Expense Item</th>
            <th className="py-2 px-4 text-left text-gray-600">Projected Amount</th>
            <th className="py-2 px-4 text-left text-gray-600">Actual Amount</th>
            <th className="py-2 px-4 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 border-b">{row[0] || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{row[1] || 'N/A'}</td>
              <td className="py-2 px-4 border-b">{row[2] || 'N/A'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => setEditItem({ index, item: row[0], projected: row[1], actual: row[2] })}
                  className="bg-yellow-500 text-white rounded px-4 py-1 mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white rounded px-4 py-1 hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
