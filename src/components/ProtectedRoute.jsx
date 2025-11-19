import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  
  // Eğer kullanıcı bilgisi yoksa (giriş yapılmamışsa), login sayfasına yönlendir.
  // Not: localStorage kontrolünü AuthProvider'da yapmak daha gelişmiş bir yöntemdir.
  // Bu basit haliyle, state'e bakar.
  if (!user && !localStorage.getItem('user')) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı varsa, altındaki rotaların (Outlet) gösterilmesine izin ver.
  return <Outlet />;
};

export default ProtectedRoute;