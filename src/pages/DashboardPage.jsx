import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { clientAPI, campaignAPI, paymentAPI, staffAPI, advertAPI } from '../services/api';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCampaigns: 0,
    totalPayments: 0,
    activeCampaigns: 0,
    totalStaff: 0,
    totalAdverts: 0,
    completedCampaigns: 0,
    completedPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, campaignsRes, paymentsRes, staffRes, advertsRes] = await Promise.all([
          clientAPI.getAll(),
          campaignAPI.getAll(),
          paymentAPI.getAll(),
          staffAPI.getAll(),
          advertAPI.getAll(),
        ]);

        const activeCampaigns = campaignsRes.data.filter(c => c.status === 'ACTIVE').length;
        const completedCampaigns = campaignsRes.data.filter(c => c.status === 'COMPLETED').length;
        const completedPayments = paymentsRes.data.filter(p => p.status === 'COMPLETED').length;

        setStats({
          totalClients: clientsRes.data.length,
          totalCampaigns: campaignsRes.data.length,
          totalPayments: paymentsRes.data.length,
          activeCampaigns,
          totalStaff: staffRes.data.length,
          totalAdverts: advertsRes.data.length,
          completedCampaigns,
          completedPayments,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.email || 'User'}! 👋</h1>
        <p className="text-gray-600 mt-2">Here's your agency's summary for today.</p>
      </div>

      {/* Stats Grid - 1st Row (Main Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Clients Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Total Clients</p>
              <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>
            </div>
            <span className="text-5xl opacity-20">👥</span>
          </div>
        </div>

        {/* Campaigns Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold">Total Campaigns</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCampaigns}</p>
            </div>
            <span className="text-5xl opacity-20">📋</span>
          </div>
        </div>

        {/* Active Campaigns Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-semibold">Active Campaigns</p>
              <p className="text-3xl font-bold mt-2">{stats.activeCampaigns}</p>
            </div>
            <span className="text-5xl opacity-20">🚀</span>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold">Total Payments</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPayments}</p>
            </div>
            <span className="text-5xl opacity-20">💳</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - 2nd Row (Additional Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Staff Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Staff</p>
              <p className="text-3xl font-bold text-indigo-700 mt-2">{stats.totalStaff}</p>
            </div>
            <span className="text-4xl">👔</span>
          </div>
        </div>

        {/* Adverts Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Adverts</p>
              <p className="text-3xl font-bold text-pink-700 mt-2">{stats.totalAdverts}</p>
            </div>
            <span className="text-4xl">📺</span>
          </div>
        </div>

        {/* Completed Campaigns Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Completed Campaigns</p>
              <p className="text-3xl font-bold text-teal-700 mt-2">{stats.completedCampaigns}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        {/* Completed Payments Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Completed Payments</p>
              <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.completedPayments}</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">📊 System Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-semibold">Completion Rate</p>
            <p className="text-xl">{stats.totalCampaigns > 0 ? Math.round((stats.completedCampaigns / stats.totalCampaigns) * 100) : 0}%</p>
          </div>
          <div>
            <p className="font-semibold">Payment Status</p>
            <p className="text-xl">{stats.totalPayments > 0 ? Math.round((stats.completedPayments / stats.totalPayments) * 100) : 0}%</p>
          </div>
          <div>
            <p className="font-semibold">Active Campaigns</p>
            <p className="text-xl">{stats.activeCampaigns} / {stats.totalCampaigns}</p>
          </div>
          <div>
            <p className="font-semibold">Team Size</p>
            <p className="text-xl">{stats.totalStaff}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
