import React, { useState } from 'react';
import { staffGradeAPI } from '../../services/api';

export default function StaffGradeForm({ grade, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    grade_name: grade?.grade_name || '',
    base_salary: grade?.base_salary || '',
    description: grade?.description || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (grade) {
        await staffGradeAPI.update(grade.id, formData);
      } else {
        await staffGradeAPI.create(formData);
      }
      onSave();
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {grade ? 'Edit Staff Grade' : 'Add New Staff Grade'}
      </h2>

      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}

      <input
        type="text"
        name="grade_name"
        placeholder="Grade Name"
        value={formData.grade_name}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      />

      <input
        type="number"
        name="base_salary"
        placeholder="Base Salary"
        value={formData.base_salary}
        onChange={handleChange}
        step="0.01"
        className="border rounded px-3 py-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        rows="3"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
