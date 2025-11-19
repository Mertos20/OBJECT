import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function MainLayout() {
  return (
    // Ana konteyner: Tüm ekranı kaplar ve flexbox düzenini kullanır.
    // Arka plan rengi, içerik kartlarının beyaz arka planıyla kontrast oluşturur.
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* Sidebar sabit bir şekilde solda yer alır */}
      <Sidebar />

      {/* Ana içerik alanı: Kalan tüm alanı kaplar ve dikey flex düzenine sahiptir */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar, ana içerik alanının en üstünde yer alır */}
        <Navbar />

        {/* Sayfa içeriği: Kalan dikey alanı kaplar ve gerektiğinde dikey olarak kaydırılır */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* App.jsx'teki alt rotalar (Dashboard, Campaigns vs.) buraya gelecek */}
          <Outlet /> 
        </div>

      </main>
    </div>
  );
}

export default MainLayout;