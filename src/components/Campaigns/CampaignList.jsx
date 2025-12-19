function CampaignList({ campaigns, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    const colors = {
      'PLANNING': 'bg-gray-100 text-gray-700',
      'ACTIVE': 'bg-green-100 text-green-700',
      'COMPLETED': 'bg-blue-100 text-blue-700',
      'ON_HOLD': 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Title</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Client</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Progress</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Budget</th>
            <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <tr key={campaign.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold">{campaign.title}</td>
              <td className="px-6 py-4">
                {typeof campaign.client === 'object' 
                  ? campaign.client.company_name 
                  : campaign.client}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${campaign.completion_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{campaign.completion_percentage}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                ${campaign.budget?.toLocaleString() || '0'}
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onEdit(campaign)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(campaign.id)}
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

export default CampaignList;