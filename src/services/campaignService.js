// API istekleri api.js dosyasındaki campaignAPI kullanılmaktadır
// Bu dosya campaign ile ilgili ek servis fonksiyonları için kullanılabilir

// Kampanya filtreleme fonksiyonu
export const filterCampaigns = (campaigns, filters) => {
  return campaigns.filter(campaign => {
    if (filters.status && campaign.status !== filters.status) return false;
    if (filters.clientId && campaign.client !== filters.clientId) return false;
    if (filters.searchText && !campaign.title.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
    return true;
  });
};

// Kampanya durumuna göre renk döndürme
export const getCampaignStatusColor = (status) => {
  const colors = {
    'PLANNING': 'bg-gray-100 text-gray-700',
    'ACTIVE': 'bg-green-100 text-green-700',
    'COMPLETED': 'bg-blue-100 text-blue-700',
    'ON_HOLD': 'bg-yellow-100 text-yellow-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

// Kampanya ilerleme durumu
export const getCampaignStats = (campaigns) => {
  return {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'ACTIVE').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED').length,
    onHold: campaigns.filter(c => c.status === 'ON_HOLD').length,
  };
};