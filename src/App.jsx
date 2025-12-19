import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import ClientsPage from './pages/ClientsPage';
import StaffPage from './pages/StaffPage';
import PaymentsPage from './pages/PaymentsPage';
import AdvertsPage from './pages/AdvertsPage';
import StaffGradesPage from './pages/StaffGradesPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="adverts" element={<AdvertsPage />} />
            <Route path="staff-grades" element={<StaffGradesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* 404 Sayfası giriş yapmayan kullanıcılar için */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;