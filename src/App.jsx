import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import ClientsPage from './pages/ClientsPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Import et

function App() {
  return (
    <div className="bg-gray-500 min-h-screen">
    <Routes>
      {/* Herkesin erişebileceği rotalar */}
      <Route path="/login" element={<LoginPage />} />

      {/* Sadece giriş yapmış kullanıcıların erişebileceği rotalar */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          {/* Diğer korumalı sayfalarınız... */}
        </Route>
      </Route>
    </Routes>
    </div>
  );
}

export default App;