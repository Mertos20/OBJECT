import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <p className="text-4xl font-bold text-indigo-200 mb-2">Sayfa Bulunamadı</p>
          <p className="text-xl text-indigo-100 mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Dashboard'a Dön
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
            >
              Geri Dön
            </button>
          </div>
        </div>

        <p className="text-indigo-200 mt-8 text-sm">
          Sorun devam ederse lütfen sistem yöneticisine başvurun.
        </p>
      </div>
    </div>
  );
}
