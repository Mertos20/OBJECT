import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// 1. Context'i oluştur
const AuthContext = createContext(null);

// 2. Provider Bileşenini oluştur
export const AuthProvider = ({ children }) => {
  // Kullanıcı bilgisini state'de tutuyoruz. Başlangıçta null.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  // Mount olduğunda localStorage kontrol et
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 AuthProvider mount - Saved token:', savedToken ? 'exists' : 'not found');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log('✅ Token ve user localStorage\'dan yüklendi');
      } catch (err) {
        console.error('❌ localStorage parse hatası:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); // 🔥 Empty dependency array - sadece mount'ta çalışır

  // Backend'e giriş isteği
  const login = async (email, password) => {
    try {
      console.log('🔐 Login başlıyor...', email);

      // Django SimpleJWT response: { access, refresh }
      const response = await authAPI.login(email, password);

      console.log('📦 Login response:', response.data);

      // 🔥 Doğru anahtar: access
      const newToken = response.data.access;

      const userData = {
        email: email,
        username: email,
      };

      setUser(userData);
      setToken(newToken);

      localStorage.setItem('access_token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Login başarılı!');

      return true;
    } catch (error) {
      console.error('❌ Login hatası:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Invalid email or password');
    }
  };

  // Çıkış fonksiyonu
  const logout = () => {
    console.log('🚪 Logout...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  // 🔥 isAuthenticated hesapla
  const isAuthenticated = !!(token && user);

  console.log('🎯 AuthContext state:', {
    isAuthenticated,
    token: token ? token.substring(0, 20) + '...' : null,
    user,
    loading,
  });

  // Context'in diğer bileşenlere sağlayacağı değerler
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context'i kolayca kullanmak için bir custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// python manage.py createsuperuser
// Username: calisan@ajans.com
// Email: calisan@ajans.com
// Password: 123456