import React, { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import AddClientModal from '../components/AddClientModal';

// Yükleniyor spinner'ı
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Müşteri Tipi için küçük etiket (badge)
const ClientTypeBadge = ({ type }) => {
  const isCorporate = type === 'CORPORATE';
  const colorClasses = isCorporate
    ? 'bg-sky-100 text-sky-800'
    : 'bg-green-100 text-green-800';
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses}`}>
      {isCorporate ? 'Corporate' : 'Individual'}
    </span>
  );
};

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumu için state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await getClients();
      // En son ekleneni en üstte görmek için listeyi tersine çevirebiliriz
      setClients(response.data.reverse()); 
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Müşteri eklendikten sonra listeyi yenilemek için bu fonksiyonu kullanacağız
  const handleClientAdded = () => {
    fetchClients(); // Listeyi yeniden çek
  };

  return (
    <div>
      {/* 1. Sayfa Başlığı ve Buton */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Client
        </button>
      </div>

      {/* 2. Müşteri Tablosu */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Client Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Contact Details</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.length > 0 ? (
                clients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Client Name Sütunu */}
                    <td className="p-4 whitespace-nowrap font-medium text-gray-800">
                      {client.client_type === 'CORPORATE' 
                        ? client.company_name 
                        : `${client.contact_first_name} ${client.contact_last_name}`}
                    </td>
                    

                    {/* Contact Details Sütunu */}
                    <td className="p-4 whitespace-nowrap text-gray-600">
                      <div className="text-sm">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                      <div className="text-sm text-gray-500">{client.address}</div>
                    </td>

                    {/* Type Sütunu */}
                    <td className="p-4 whitespace-nowrap">
                      <ClientTypeBadge type={client.client_type} />
                    </td>

                    {/* Actions Sütunu */}
                    <td className="p-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-6">
                    No clients found. Add your first client!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. Modal'ın kendisi */}
      {isModalOpen && (
        <AddClientModal
          onClose={() => setIsModalOpen(false)}
          onClientAdded={handleClientAdded} // Müşteri eklenince listeyi yenilemek için
        />
      )}
    </div>
  );
}

export default ClientsPage;