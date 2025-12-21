import React from 'react';

export default function AdvertList({ adverts, onEdit, onDelete, onGenerateBanner }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PRODUCTION':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY':
        return 'bg-blue-100 text-blue-800';
      case 'RUNNING':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Campaign
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Production Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {adverts.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No adverts found
              </td>
            </tr>
          ) : (
            adverts.map((advert) => (
              <tr key={advert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{advert.title}</span>
                    {(advert.banner_html || advert.banner_image_base64) && (
                      <span className="text-green-600" title="Banner">🖼️</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {advert.campaign_title || `Campaign #${advert.campaign}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(advert.status)}`}>
                    {advert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${advert.production_progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{advert.production_progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(advert.scheduled_start_date).toLocaleDateString()} -
                  <br />
                  {new Date(advert.scheduled_end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onGenerateBanner(advert)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Create Banner"
                  >
                    🎨 Banner
                  </button>
                  <button
                    onClick={() => onEdit(advert)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(advert.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
