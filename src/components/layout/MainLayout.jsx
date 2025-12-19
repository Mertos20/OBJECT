import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white shadow-lg">
        <div className="p-6 border-b border-indigo-600">
          <h1 className="text-2xl font-bold">Agate</h1>
          <p className="text-indigo-200 text-sm">Campaign Management</p>
        </div>

        <nav className="p-6 space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">📊</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/campaigns"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">📋</span>
            <span>Campaigns</span>
          </Link>

          <Link
            to="/clients"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">👥</span>
            <span>Clients</span>
          </Link>

          <Link
            to="/staff-grades"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">⭐</span>
            <span>Staff Grades</span>
          </Link>

          <Link
            to="/staff"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">👔</span>
            <span>Staff</span>
          </Link>

          <Link
            to="/payments"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">💳</span>
            <span>Payments</span>
          </Link>

          <Link
            to="/adverts"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="text-xl">📺</span>
            <span>Adverts</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-indigo-600">
          <div className="mb-2 text-xs text-indigo-200">
            <p className="font-semibold">{user?.username || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-white  rounded w-full"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;