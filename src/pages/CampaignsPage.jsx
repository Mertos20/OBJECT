import React, { useState, useEffect } from 'react';

// We'll use the same mock service as before
// import { getCampaigns } from '../services/campaignService';

// A small, reusable component for status badges
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
  let colorClasses = "";

  switch (status) {
    case 'Active':
      colorClasses = "bg-green-100 text-green-800";
      break;
    case 'Planning':
      colorClasses = "bg-blue-100 text-blue-800";
      break;
    case 'Completed':
      colorClasses = "bg-gray-200 text-gray-800";
      break;
    default:
      colorClasses = "bg-yellow-100 text-yellow-800";
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// A better loading indicator
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);


// MOCK SERVICE FUNCTION - for demonstration purposes
const getCampaigns = () => {
  const mockCampaigns = [
    { id: 1, title: 'Summer Sale Kickoff', client: 'Fashion Inc.', budget: 50000, status: 'Active' },
    { id: 2, title: 'New Product Launch', client: 'Tech Solutions Ltd.', budget: 120000, status: 'Planning' },
    { id: 3, title: 'Back to School Deals', client: 'BookWorld', budget: 75000, status: 'Completed' },
    { id: 4, title: 'Holiday Marketing', client: 'Gourmet Foods', budget: 250000, status: 'Active' },
  ];
  return new Promise(resolve => setTimeout(() => resolve(mockCampaigns), 500));
};


function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* 1. Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Campaign Management</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Campaign
        </button>
      </div>

      {/* 2. Table Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Campaign Title</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Client</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Budget</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map(campaign => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{campaign.title}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{campaign.client}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">${campaign.budget.toLocaleString()}</td>
                <td className="p-4 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CampaignsPage;