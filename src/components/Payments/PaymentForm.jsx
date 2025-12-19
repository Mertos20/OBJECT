import React, { useState, useEffect } from 'react';
import { paymentAPI, clientAPI, campaignAPI } from '../../services/api';

export default function PaymentForm({ payment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    client: '',
    campaign: '',
    amount: '',
    payment_date: '',
    due_date: '',
    status: 'PENDING',
    notes: '',
  });
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchCampaigns();
    if (payment) {
      setFormData({
        client: payment.client,
        campaign: payment.campaign || '',
        amount: payment.amount,
        payment_date: payment.payment_date,
        due_date: payment.due_date || '',
        status: payment.status,
        notes: payment.notes || '',
      });
    }
  }, [payment]);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

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
      if (payment) {
        await paymentAPI.update(payment.id, formData);
      } else {
        await paymentAPI.create(formData);
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
        {payment ? 'Edit Payment' : 'Add New Payment'}
      </h2>

      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}

      <select
        name="client"
        value={formData.client}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.company_name || `${client.contact_first_name} ${client.contact_last_name}`}
          </option>
        ))}
      </select>

      <select
        name="campaign"
        value={formData.campaign}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Select Campaign (Optional)</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.title}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        step="0.01"
        className="border rounded px-3 py-2 w-full"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="payment_date"
          value={formData.payment_date}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
      </div>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        rows="3"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
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
