import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import StaffList from '../components/Staff/StaffList';
import StaffForm from '../components/Staff/StaffForm';
import FormModal from '../components/FormModal';

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getAll();
      setStaffList(response.data);
      console.log('✅ Staff loaded:', response.data);
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      try {
        await staffAPI.delete(id);
        setStaffList(staffList.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchStaff();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Staff
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingStaff ? 'Edit Staff' : 'Add New Staff'}
          onClose={() => setShowForm(false)}
        >
          <StaffForm
            staff={editingStaff}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading staff...</p>
        </div>
      ) : (
        <StaffList
          staff={staffList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
