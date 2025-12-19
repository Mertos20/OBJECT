import React, { useState, useEffect } from 'react';
import { staffGradeAPI } from '../services/api';
import StaffGradeList from '../components/StaffGrades/StaffGradeList';
import StaffGradeForm from '../components/StaffGrades/StaffGradeForm';
import FormModal from '../components/FormModal';

export default function StaffGradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await staffGradeAPI.getAll();
      setGrades(response.data);
      console.log('✅ Staff Grades loaded:', response.data);
    } catch (error) {
      console.error('❌ Error fetching staff grades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleAdd = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await staffGradeAPI.delete(id);
        setGrades(grades.filter(g => g.id !== id));
      } catch (error) {
        console.error('❌ Error deleting grade:', error);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchGrades();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Grades Management</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Grade
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingGrade ? 'Edit Staff Grade' : 'Add New Staff Grade'}
          onClose={() => setShowForm(false)}
        >
          <StaffGradeForm
            grade={editingGrade}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading staff grades...</p>
        </div>
      ) : (
        <StaffGradeList
          grades={grades}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
