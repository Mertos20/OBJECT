import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Context'i oluştur
const AuthContext = createContext(null);

// 2. Provider Bileşenini oluştur
export const AuthProvider = ({ children }) => {
  // Kullanıcı bilgisini state'de tutuyoruz. Başlangıçta null.
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sahte giriş fonksiyonu **buraya daha sonra api isteği gelecek
  const login = async (email, password) => {
    // GERÇEK PROJEDE: Burada backend'e istek atılır.
    // fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    
    // Şimdilik gelen email ve şifreyi kontrol edelim (simülasyon)
    if (email === 'calisan@ajans.com' && password === '123456') {
      const fakeUserData = {
        id: 1,
        name: 'İrem Türk',
        email: 'calisan@ajans.com',
        role: 'Proje Yöneticisi',
      };
      
      
      setUser(fakeUserData);
      // Kullanıcı bilgisini tarayıcı hafızasında saklayabiliriz (sayfa yenilense de gitmez)
      localStorage.setItem('user', JSON.stringify(fakeUserData));
      
      // Giriş başarılı olunca anasayfaya yönlendir
      navigate('/');
    } 
    else if (email === 'bektamert2@loop.com' && password === '123456') {
      const fakeUserData = {
        id: 1,
        name: 'Mert Bektaş',
        email: 'bektamert2@loop.com' ,
        role: 'Proje Yöneticisi',
      };
      
      
      setUser(fakeUserData);
      // Kullanıcı bilgisini tarayıcı hafızasında saklayabiliriz (sayfa yenilense de gitmez)
      localStorage.setItem('user', JSON.stringify(fakeUserData));
      
      // Giriş başarılı olunca anasayfaya yönlendir
      navigate('/');
    } 
    
    else {
      // Hata yönetimi
      alert('Hatalı e-posta veya şifre!');
    }
  };

  // Çıkış fonksiyonu
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Context'in diğer bileşenlere sağlayacağı değerler
  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Context'i kolayca kullanmak için bir custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};