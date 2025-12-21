import React, { useState } from 'react';
import { advertAPI } from '../../services/api';

export default function AdvertBannerGenerator({ advert, onClose, onSuccess }) {
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedBanner, setGeneratedBanner] = useState(null);

  const styles = [
    { value: 'modern', label: 'Modern', desc: 'Contemporary, gradient transitions' },
    { value: 'minimal', label: 'Minimal', desc: 'Simple, clean design' },
    { value: 'bold', label: 'Bold', desc: 'Bold, attention-grabbing' },
    { value: 'elegant', label: 'Elegant', desc: 'Elegant, sophisticated' },
    { value: 'colorful', label: 'Colorful', desc: 'Colorful, vibrant' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await advertAPI.generateBanner(advert.id, style);
      if (response.data.success) {
        setGeneratedBanner(response.data.advert);
        if (onSuccess) onSuccess(response.data.advert);
      } else {
        setError(response.data.message || 'Failed to create banner');
      }
    } catch (err) {
      console.error('Banner generation error:', err);
      setError(err.response?.data?.message || 'Error occurred while creating banner');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await advertAPI.regenerateBanner(advert.id, style);
      if (response.data.success) {
        setGeneratedBanner(response.data.advert);
        if (onSuccess) onSuccess(response.data.advert);
      } else {
        setError(response.data.message || 'Failed to regenerate banner');
      }
    } catch (err) {
      console.error('Banner regeneration error:', err);
      setError(err.response?.data?.message || 'Error occurred while regenerating banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Ad Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900">{advert.title}</h3>
        <p className="text-sm text-gray-600">Campaign: {advert.campaign_title || `#${advert.campaign}`}</p>
        {advert.description && (
          <p className="text-sm text-gray-500 mt-1">{advert.description}</p>
        )}
      </div>

      {/* Select Style */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Banner Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {styles.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border-2 text-left transition ${
                style === s.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{s.label}</span>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            '🎨 Create Banner'
          )}
        </button>

        {generatedBanner && (
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            🔄 Regenerate
          </button>
        )}
      </div>

      {/* Generated Banner Preview */}
      {generatedBanner && (generatedBanner.banner_image_base64 || generatedBanner.banner_image_url || generatedBanner.banner_html) && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h4 className="font-medium text-gray-700">📸 Generated Banner</h4>
          </div>
          <div className="p-4 bg-gray-50 flex justify-center">
            {generatedBanner.banner_image_base64 ? (
              <img
                src={`data:image/png;base64,${generatedBanner.banner_image_base64}`}
                alt="Generated Banner"
                className="max-w-full h-auto rounded shadow-lg"
              />
            ) : generatedBanner.banner_image_url ? (
              <img
                src={generatedBanner.banner_image_url}
                alt="Generated Banner"
                className="max-w-full h-auto rounded shadow-lg"
              />
            ) : generatedBanner.banner_html ? (
              <div 
                className="w-full max-w-2xl"
                dangerouslySetInnerHTML={{ __html: generatedBanner.banner_html }}
              />
            ) : null}
          </div>
          
          {/* Download Button */}
          {(generatedBanner.banner_image_base64 || generatedBanner.banner_html) && (
            <div className="p-4 border-t bg-white">
              {generatedBanner.banner_image_base64 ? (
                <a
                  href={`data:image/png;base64,${generatedBanner.banner_image_base64}`}
                  download={`${advert.title.replace(/\s+/g, '_')}_banner.png`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  💾 Download Banner
                </a>
              ) : (
                <span className="text-sm text-gray-500">
                  ℹ️ HTML banner created (Imagen API unavailable)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Current Banner Display */}
      {!generatedBanner && (advert.banner_image_base64 || advert.banner_html) && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <h4 className="font-medium text-gray-700">📸 Current Banner</h4>
          </div>
          <div className="p-4 bg-gray-50 flex justify-center">
            {advert.banner_image_base64 ? (
              <img
                src={`data:image/png;base64,${advert.banner_image_base64}`}
                alt="Current Banner"
                className="max-w-full h-auto rounded shadow-lg"
              />
            ) : advert.banner_html ? (
              <div 
                className="w-full max-w-2xl"
                dangerouslySetInnerHTML={{ __html: advert.banner_html }}
              />
            ) : null}
          </div>
        </div>
      )}

      {/* Close Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={onClose}
          className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
