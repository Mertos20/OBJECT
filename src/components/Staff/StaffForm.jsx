import React, { useState, useEffect } from 'react';
import { staffAPI, staffGradeAPI } from '../../services/api';

export default function StaffForm({ staff, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    staff_type: 'CREATIVE',
    grade: '',
    hire_date: '',
    is_active: true,
  });
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
    if (staff) {
      setFormData({
        first_name: staff.user_details?.first_name || '',
        last_name: staff.user_details?.last_name || '',
        email: staff.user_details?.email || '',
        staff_type: staff.staff_type,
        grade: staff.grade,
        hire_date: staff.hire_date,
        is_active: staff.is_active,
      });
    }
  }, [staff]);

  const fetchGrades = async () => {
    try {
      const response = await staffGradeAPI.getAll();
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (staff) {
        await staffAPI.update(staff.id, formData);
      } else {
        await staffAPI.create(formData);
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
        {staff ? 'Edit Staff' : 'Add New Staff'}
      </h2>

      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          name="staff_type"
          value={formData.staff_type}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="CREATIVE">Creative</option>
          <option value="ADMIN">Administrative</option>
        </select>

        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Grade</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.grade_name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="date"
        name="hire_date"
        value={formData.hire_date}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="rounded"
        />
        <span>Is Active</span>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
