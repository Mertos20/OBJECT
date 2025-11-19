import React from 'react';
import { NavLink } from 'react-router-dom';

// Linkleri bir dizi olarak yönetmek, kodu daha temiz ve yönetilebilir yapar.
const navLinks = [
  { to: "/", text: "Dashboard" },
  { to: "/campaigns", text: "Campaigns" },
  { to: "/clients", text: "Clients" },
  { to: "/staff", text: "Employee" },
  { to: "/payments", text: "Payments" },
];

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      {/* Ajans Adı / Logo */}
      <div className="text-2xl font-bold text-center py-4 mb-8 border-b border-gray-700">
        Agate 
      </div>

      {/* Navigasyon Linkleri */}
      <nav className="flex-grow">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to} className="mb-2">
              <NavLink
                to={link.to}
                // NavLink'in bu özelliği sayesinde aktif olan link'e farklı stil verebiliriz
                className={({ isActive }) =>
                  `flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white' // Aktif link stili
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Normal link stili
                  }`
                }
              >
                {/* İkonlar için bir yer bırakmak her zaman iyidir */}
                {/* <span className="mr-3">Icon</span> */}
                <span>{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Alt Kısım (Örn: Kullanıcı Bilgisi veya Çıkış Butonu) */}
      <div className="mt-auto">
        <p className="text-center text-xs text-gray-500">© 2025 Agate</p>
      </div>
    </aside>
  );
}

export default Sidebar;