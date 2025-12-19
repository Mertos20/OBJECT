import React, { useState } from 'react';
import { campaignAPI } from '../../services/api';

export default function BannerGenerator({ campaign, onBannerGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [style, setStyle] = useState('modern');
  const [generatedBanner, setGeneratedBanner] = useState(campaign?.banner_html || null);
  const [variations, setVariations] = useState([]);
  const [showVariations, setShowVariations] = useState(false);

  const styles = [
    { value: 'modern', label: 'Modern', icon: '🎨' },
    { value: 'minimal', label: 'Minimal', icon: '⬜' },
    { value: 'bold', label: 'Bold', icon: '💪' },
    { value: 'elegant', label: 'Elegant', icon: '✨' },
    { value: 'colorful', label: 'Colorful', icon: '🌈' },
  ];

  const generateBanner = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await campaignAPI.generateBanner(campaign.id, style);
      
      if (response.data.success) {
        setGeneratedBanner(response.data.banner_html);
        if (onBannerGenerated) {
          onBannerGenerated(response.data.banner_html);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Banner oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const generateVariations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await campaignAPI.generateBannerVariations(campaign.id, 3);
      
      if (response.data.success) {
        setVariations(response.data.variations);
        setShowVariations(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Varyasyonlar oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const selectVariation = (variation) => {
    setGeneratedBanner(variation.banner_html);
    setShowVariations(false);
    if (onBannerGenerated) {
      onBannerGenerated(variation.banner_html);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBanner);
    alert('Banner HTML kopyalandı!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">🎨</span>
        AI Banner Oluşturucu
      </h3>

      {/* Kampanya Bilgisi */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Kampanya:</p>
        <p className="font-semibold text-gray-900">{campaign?.title}</p>
      </div>

      {/* Stil Seçimi */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Stili
        </label>
        <div className="grid grid-cols-5 gap-2">
          {styles.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border-2 text-center transition ${
                style === s.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">{s.icon}</span>
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={generateBanner}
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Oluşturuluyor...
            </span>
          ) : (
            '🚀 Banner Oluştur'
          )}
        </button>
        
        <button
          onClick={generateVariations}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          📊 3 Varyasyon
        </button>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Varyasyonlar */}
      {showVariations && variations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">Varyasyonlar:</h4>
          <div className="space-y-4">
            {variations.map((v, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {v.style?.charAt(0).toUpperCase() + v.style?.slice(1)} Stil
                  </span>
                  <button
                    onClick={() => selectVariation(v)}
                    className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                  >
                    Bu Banner'ı Seç
                  </button>
                </div>
                <div 
                  className="border rounded overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: v.banner_html }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Oluşturulan Banner Önizleme */}
      {generatedBanner && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-900">Önizleme:</h4>
            <button
              onClick={copyToClipboard}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              📋 HTML Kopyala
            </button>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <div 
              className="mx-auto"
              dangerouslySetInnerHTML={{ __html: generatedBanner }}
            />
          </div>
          
          {/* HTML Kodu */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
              HTML Kodunu Göster
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs">
              {generatedBanner}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
