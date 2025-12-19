import { useEffect, useState } from 'react';
import { clientAPI } from '../services/api';
import ClientForm from '../components/Clients/ClientForm';
import ClientList from '../components/Clients/ClientList';
import FormModal from '../components/FormModal';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await clientAPI.delete(id);
        setClients(clients.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
    fetchClients();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Clients</h1>
        <button
          onClick={handleAddClient}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingClient ? 'Edit Client' : 'Add New Client'}
          onClose={() => setShowForm(false)}
        >
          <ClientForm
            client={editingClient}
            onClose={handleFormClose}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <ClientList
          clients={clients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}
    </div>
  );
}

export default ClientsPage;