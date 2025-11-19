import React, { useState } from 'react';
import { addClient } from '../services/clientService';

function AddClientModal({ onClose, onClientAdded }) {
  // Tüm form verilerini tek bir state objesinde yönetelim
  const [formData, setFormData] = useState({
    client_type: '', // Varsayılan olarak Kurumsal
    company_name: '',
    contact_first_name: '',
    contact_last_name: '',
    email: '',
    phone: '',
    notes: '',
    address: '',
  });
  const [error, setError] = useState('');

  // Tüm input değişikliklerini yöneten tek bir fonksiyon
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Bireysel seçiliyse, backend'e boş string gitsin
    const dataToSend = {
      ...formData,
      company_name: formData.client_type === 'INDIVIDUAL' ? '' : formData.company_name,
    };

    try {
      await addClient(dataToSend);
      onClientAdded(); // Listeyi yenile
      onClose(); // Modalı kapat
    } catch (err) {
      // Django'dan gelen spesifik hataları göstermek daha iyi olabilir
      let errorMsg = 'Failed to add client. Please check the details and try again.';
      if (err.response && err.response.data && err.response.data.email) {
         errorMsg = `Error: ${err.response.data.email[0]}`; // Örn: "Bu email zaten kullanımda."
      }
      setError(errorMsg);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
        {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="client_type" className="block text-sm font-medium text-gray-700">Client Type *</label>
            <select
              id="client_type"
              name="client_type"
              value={formData.client_type}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="CORPORATE">Corporate</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          {/* Sadece 'Corporate' seçiliyse Şirket Adı'nı göster */}
          {formData.client_type === 'CORPORATE' && (
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          )}

          {/* Ad ve Soyad yan yana dursun */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_first_name" className="block text-sm font-medium text-gray-700">Contact First Name *</label>
              <input
                type="text"
                id="contact_first_name"
                name="contact_first_name"
                value={formData.contact_first_name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contact_last_name" className="block text-sm font-medium text-gray-700">Contact Last Name *</label>
              <input
                type="text"
                id="contact_last_name"
                name="contact_last_name"
                value={formData.contact_last_name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

           <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adress</label>
            <textarea
              id="address"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Any relevant info about this client..."
            ></textarea>
          </div>


          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Any relevant info about this client..."
            ></textarea>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddClientModal;