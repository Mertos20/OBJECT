function ClientList({ clients, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Company</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Contact</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Phone</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Type</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{client.company_name || '-'}</td>
              <td className="px-6 py-4">
                {client.contact_first_name} {client.contact_last_name}
              </td>
              <td className="px-6 py-4">{client.email}</td>
              <td className="px-6 py-4">{client.phone || '-'}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  client.client_type === 'CORPORATE' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {client.client_type}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onEdit(client)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientList;