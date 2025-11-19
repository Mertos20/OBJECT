// Sahte kampanya verileri
const mockCampaigns = [
  { id: 1, title: 'Yaz Sezonu İndirimi', client: 'Moda A.Ş.', budget: 50000, status: 'Aktif' },
  { id: 2, title: 'Yeni Ürün Lansmanı', client: 'Teknoloji Ltd.', budget: 120000, status: 'Planlanıyor' },
  { id: 3, title: 'Okula Dönüş Fırsatları', client: 'Kitap Dünyası', budget: 75000, status: 'Tamamlandı' },
];

// Backend API'sini taklit eden bir fonksiyon
export const getCampaigns = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCampaigns);
    }, 500); // 0.5 saniyelik bir gecikme ekleyerek ağ isteğini simüle ediyoruz
  });
};