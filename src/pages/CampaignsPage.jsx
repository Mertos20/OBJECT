import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { campaignAPI, clientAPI } from '../services/api';
import CampaignForm from '../components/Campaigns/CampaignForm';
import CampaignList from '../components/Campaigns/CampaignList';
import FormModal from '../components/FormModal';

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignsRes, clientsRes] = await Promise.all([
        campaignAPI.getAll(),
        clientAPI.getAll(),
      ]);
      setCampaigns(campaignsRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // If navigated here with state.editId, open edit modal for that campaign
  const location = useLocation();
  useEffect(() => {
    const editId = location?.state?.editId;
    if (editId) {
      (async () => {
        try {
          const res = await campaignAPI.getById(editId);
          setEditingCampaign(res.data);
          setShowForm(true);
        } catch (err) {
          console.error('Error loading campaign for edit:', err);
        }
      })();
    }
  }, [location]);

  const handleAddCampaign = () => {
    setEditingCampaign(null);
    setShowForm(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowForm(true);
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await campaignAPI.delete(id);
        setCampaigns(campaigns.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCampaign(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Campaigns</h1>
        <button
          onClick={handleAddCampaign}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          + Add Campaign
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
          onClose={() => setShowForm(false)}
        >
          <CampaignForm
            campaign={editingCampaign}
            clients={clients}
            onClose={handleFormClose}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <CampaignList
          campaigns={campaigns}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
        />
      )}
    </div>
  );
}

export default CampaignsPage;