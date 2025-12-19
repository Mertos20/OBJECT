// API istekleri api.js dosyasındaki clientAPI kullanılmaktadır
// Bu dosya client ile ilgili ek servis fonksiyonları için kullanılabilir

// İstemci türüne göre renk döndürme
export const getClientTypeColor = (type) => {
  const colors = {
    'CORPORATE': 'bg-blue-100 text-blue-700',
    'INDIVIDUAL': 'bg-green-100 text-green-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

// İstemci adını oluştur
export const getClientName = (client) => {
  if (client.client_type === 'CORPORATE' && client.company_name) {
    return client.company_name;
  }
  return `${client.contact_first_name} ${client.contact_last_name}`;
};

// İstemci filtreleme
export const filterClients = (clients, searchText) => {
  if (!searchText) return clients;
  const text = searchText.toLowerCase();
  return clients.filter(client => {
    const name = getClientName(client).toLowerCase();
    const email = client.email.toLowerCase();
    const company = (client.company_name || '').toLowerCase();
    return name.includes(text) || email.includes(text) || company.includes(text);
  });
};

// İstemci istatistikleri
export const getClientStats = (clients) => {
  return {
    total: clients.length,
    corporate: clients.filter(c => c.client_type === 'CORPORATE').length,
    individual: clients.filter(c => c.client_type === 'INDIVIDUAL').length,
  };
};