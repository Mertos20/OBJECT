import React, { useState, useEffect } from 'react';
import { advertAPI, campaignAPI } from '../../services/api';

export default function AdvertForm({ advert, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    campaign: '',
    title: '',
    description: '',
    status: 'PLANNING',
    production_progress: 0,
    scheduled_start_date: '',
    scheduled_end_date: '',
    actual_start_date: '',
    actual_end_date: '',
  });
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    if (advert) {
      setFormData({
        campaign: advert.campaign,
        title: advert.title,
        description: advert.description || '',
        status: advert.status,
        production_progress: advert.production_progress,
        scheduled_start_date: advert.scheduled_start_date,
        scheduled_end_date: advert.scheduled_end_date,
        actual_start_date: advert.actual_start_date || '',
        actual_end_date: advert.actual_end_date || '',
      });
    }
  }, [advert]);

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
      if (advert) {
        await advertAPI.update(advert.id, formData);
      } else {
        await advertAPI.create(formData);
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
        {advert ? 'Edit Advert' : 'Add New Advert'}
      </h2>

      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}

      <select
        name="campaign"
        value={formData.campaign}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      >
        <option value="">Select Campaign</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="title"
        placeholder="Advert Title"
        value={formData.title}
        onChange={handleChange}
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

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="PLANNING">Planning</option>
        <option value="IN_PRODUCTION">In Production</option>
        <option value="READY">Ready</option>
        <option value="RUNNING">Running</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <div>
        <label className="text-sm font-medium">Production Progress: {formData.production_progress}%</label>
        <input
          type="range"
          name="production_progress"
          min="0"
          max="100"
          value={formData.production_progress}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Scheduled Start Date</label>
          <input
            type="date"
            name="scheduled_start_date"
            value={formData.scheduled_start_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Scheduled End Date</label>
          <input
            type="date"
            name="scheduled_end_date"
            value={formData.scheduled_end_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Actual Start Date</label>
          <input
            type="date"
            name="actual_start_date"
            value={formData.actual_start_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Actual End Date</label>
          <input
            type="date"
            name="actual_end_date"
            value={formData.actual_end_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
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
