import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import PaymentList from '../components/Payments/PaymentList';
import PaymentForm from '../components/Payments/PaymentForm';
import FormModal from '../components/FormModal';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getAll();
      setPayments(response.data);
      console.log('✅ Payments loaded:', response.data);
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAdd = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentAPI.delete(id);
        setPayments(payments.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchPayments();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Payment
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
          onClose={() => setShowForm(false)}
        >
          <PaymentForm
            payment={editingPayment}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading payments...</p>
        </div>
      ) : (
        <PaymentList
          payments={payments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
