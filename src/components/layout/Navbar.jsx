import React from 'react';
import { useAuth } from '../../context/AuthContext'; // useAuth hook'unu import et

function Navbar() {
  const { user, logout } = useAuth(); // user ve logout bilgilerini al

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Welcome!</h1>
        <div className="flex items-center space-x-4">
          {/* Eğer kullanıcı varsa adını göster */}
          {user && <span className="text-gray-600 font-medium">Hello, {user.name}</span>}
          <button
            onClick={logout} // Tıklandığında logout fonksiyonunu çağır
            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;