import { useEffect, useState } from 'react';
import { clientAPI, staffAPI } from '../services/api';
import ClientForm from '../components/Clients/ClientForm';
import ClientList from '../components/Clients/ClientList';
import FormModal from '../components/FormModal';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientContacts, setClientContacts] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignIsPrimary, setAssignIsPrimary] = useState(false);

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
    fetchStaffOptions();
  }, []);

  const fetchStaffOptions = async () => {
    try {
      const res = await staffAPI.getAll();
      setStaffOptions(res.data || []);
    } catch (err) {
      console.error('Error fetching staff list:', err);
    }
  };

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

  const handleViewContacts = async (client) => {
    setSelectedClient(client);
    setShowContactsModal(true);
    try {
      const res = await clientAPI.getById(client.id);
      setClientContacts(res.data.staff_contacts || []);
    } catch (err) {
      console.error('Error fetching client contacts:', err);
      setClientContacts([]);
    }
  };

  const handleAssignContact = async () => {
    if (!selectedClient) return;
    if (!assignStaffId) {
      alert('Please select a staff member to assign.');
      return;
    }
    try {
      const resAssign = await clientAPI.assignStaffContact(selectedClient.id, { staff_id: assignStaffId, is_primary: assignIsPrimary });
      const res = await clientAPI.getById(selectedClient.id);
      setClientContacts(res.data.staff_contacts || []);
      setAssignStaffId('');
      setAssignIsPrimary(false);
      fetchClients();
    } catch (err) {
      console.error('Error assigning staff contact:', err);
      const serverMsg = err?.response?.data?.error || err?.response?.data || err?.message;
      alert(`Failed to assign staff contact: ${JSON.stringify(serverMsg)}`);
    }
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
          onAssignContact={handleViewContacts}
        />
      )}

      {showContactsModal && selectedClient && (
        <FormModal
          title={`Staff Contacts — ${selectedClient.company_name || selectedClient.id}`}
          onClose={() => { setShowContactsModal(false); setSelectedClient(null); setClientContacts([]); }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Existing Contacts</h3>
              <ul className="mt-2 space-y-2">
                {clientContacts.length === 0 && <li className="text-sm text-gray-600">No contacts assigned.</li>}
                {clientContacts.map(c => (
                  <li key={c.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{c.staff_details?.user_details ? `${c.staff_details.user_details.first_name} ${c.staff_details.user_details.last_name}` : c.staff_details?.id}</div>
                      <div className="text-sm text-gray-500">{c.staff_details?.user_details?.email}</div>
                    </div>
                    <div className="text-sm text-gray-600">{c.is_primary ? 'Primary' : ''}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Assign New Contact</h3>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Select staff...</option>
                  {staffOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.user_details ? `${s.user_details.first_name} ${s.user_details.last_name} (${s.user_details.email})` : s.id}</option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={assignIsPrimary} onChange={(e) => setAssignIsPrimary(e.target.checked)} />
                  <span>Set as primary contact</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={handleAssignContact} className="bg-indigo-600 text-white px-4 py-2 rounded">Assign</button>
                  <button onClick={() => { setShowContactsModal(false); setSelectedClient(null); }} className="border px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}

export default ClientsPage;