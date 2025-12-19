import { useState, useEffect } from 'react';
import { campaignAPI } from '../../services/api';

function CampaignForm({ campaign, clients, onClose }) {
  const [formData, setFormData] = useState({
    client: '',
    title: '',
    description: '',
    planned_start_date: '',
    planned_end_date: '',
    actual_start_date: '',
    actual_end_date: '',
    estimated_cost: '',
    budget: '',
    actual_cost: '',
    completion_percentage: 0,
    status: 'PLANNING',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData({
        ...campaign,
        client: typeof campaign.client === 'object' ? campaign.client.id : campaign.client,
      });
    }
  }, [campaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (campaign) {
        await campaignAPI.update(campaign.id, formData);
      } else {
        await campaignAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError('Error saving campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Client</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company_name || `${client.contact_first_name} ${client.contact_last_name}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Planned Start</label>
              <input
                type="date"
                name="planned_start_date"
                value={formData.planned_start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Planned End</label>
              <input
                type="date"
                name="planned_end_date"
                value={formData.planned_end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Actual Start</label>
              <input
                type="date"
                name="actual_start_date"
                value={formData.actual_start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Actual End</label>
              <input
                type="date"
                name="actual_end_date"
                value={formData.actual_end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Estimated Cost</label>
              <input
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Budget</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Actual Cost</label>
              <input
                type="number"
                name="actual_cost"
                value={formData.actual_cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Completion: {formData.completion_percentage}%
            </label>
            <input
              type="range"
              name="completion_percentage"
              min="0"
              max="100"
              value={formData.completion_percentage}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
    </>
  );
}

export default CampaignForm;