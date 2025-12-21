import React, { useState, useEffect } from 'react';
import { advertAPI } from '../services/api';
import AdvertList from '../components/Adverts/AdvertList';
import AdvertForm from '../components/Adverts/AdvertForm';
import AdvertBannerGenerator from '../components/Adverts/AdvertBannerGenerator';
import FormModal from '../components/FormModal';

export default function AdvertsPage() {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [bannerAdvert, setBannerAdvert] = useState(null);

  const fetchAdverts = async () => {
    try {
      setLoading(true);
      const response = await advertAPI.getAll();
      setAdverts(response.data);
      console.log('✅ Adverts loaded:', response.data);
    } catch (error) {
      console.error('❌ Error fetching adverts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdverts();
  }, []);

  const handleAdd = () => {
    setEditingAdvert(null);
    setShowForm(true);
  };

  const handleEdit = (advert) => {
    setEditingAdvert(advert);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advert?')) {
      try {
        await advertAPI.delete(id);
        setAdverts(adverts.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting advert:', error);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchAdverts();
  };

  const handleGenerateBanner = (advert) => {
    setBannerAdvert(advert);
  };

  const handleBannerSuccess = (updatedAdvert) => {
    // Reklam listesini güncelle
    setAdverts(adverts.map(a => 
      a.id === updatedAdvert.id ? updatedAdvert : a
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Adverts Management</h1>
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Add Advert
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingAdvert ? 'Edit Advert' : 'Add New Advert'}
          onClose={() => setShowForm(false)}
        >
          <AdvertForm
            advert={editingAdvert}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </FormModal>
      )}

      {bannerAdvert && (
        <FormModal
          title={`🎨 Create Advert Banner - ${bannerAdvert.title}`}
          onClose={() => setBannerAdvert(null)}
        >
          <AdvertBannerGenerator
            advert={bannerAdvert}
            onClose={() => setBannerAdvert(null)}
            onSuccess={handleBannerSuccess}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading adverts...</p>
        </div>
      ) : (
        <AdvertList
          adverts={adverts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGenerateBanner={handleGenerateBanner}
        />
      )}
    </div>
  );
}
