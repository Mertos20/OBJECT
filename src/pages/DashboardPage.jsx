import React from 'react';
import { useAuth } from '../context/AuthContext';

// Sample data in English
const stats = [
  { title: 'Active Campaigns', value: '12', icon: '📈' },
  { title: 'Total Clients', value: '87', icon: '👥' },
  { title: 'Pending Tasks', value: '4', icon: '📝' },
  { title: 'Upcoming Invoice', value: '$12,500', icon: '💰' },
];

const recentActivities = [
  { text: 'New campaign "Autumn Sale" has been created.', time: '1 hour ago' },
  { text: 'New client "Tech Inc." has been added.', time: '3 hours ago' },
  { text: 'Project Manager John Doe assigned to "Summer Launch" campaign.', time: 'yesterday' },
  { text: 'Invoice created for "Fashion Ltd.".', time: 'yesterday' },
];

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* 1. Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">Here's your agency's summary for today.</p>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
              <p className="text-gray-700">{activity.text}</p>
              <p className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;