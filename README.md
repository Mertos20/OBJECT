# 🎯 Agate - Campaign Management System

**Tam yığın (full-stack) bir kampanya ve müşteri yönetim uygulaması**

## 📸 Ekran Görüntüleri

- 🎨 **Modern Tasarım** - Tailwind CSS ile responsive arayüz
- 🔐 **Güvenli** - JWT token tabanlı kimlik doğrulama
- 📊 **Analitik** - Gerçek zamanlı istatistikler

## ⚡ Hızlı Başlama

```bash
# Backend
cd AgateBackend
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py createsuperuser  # calisan@ajans.com / 123456
python manage.py runserver

# Frontend (Yeni terminal)
npm install
npm run dev
```

Tarayıcıda aç: **http://localhost:5173**

**Giriş Bilgileri:**
- Email: `calisan@ajans.com`
- Password: `123456`

---

## 🎯 Temel Fonksiyonaliteler

### 👥 İstemci Yönetimi
- İstemci bilgilerini kaydetme (ad, adres, iletişim)
- Kurumsal ve bireysel türleri
- İstemci filtreleme ve arama

### 📋 Kampanya Yönetimi
- Kampanya detayları ve tarihleri
- Bütçe ve maliyet takibi
- İlerleme durumu (0-100%)
- Durum yönetimi

### 💳 Ödeme Kaydı
- Müşteri ödemelerini kaydetme
- Ödeme durumu takibi
- Kampanyaya bağlı ödemeler

### 👔 Personel Yönetimi
- Personel kaydı (Yaratıcı/İdari)
- Derece ve maaş bilgileri
- İşe alınma tarihi

### 📺 İlan/Reklam Yönetimi
- İlan durumu ve üretim ilerlemesi
- Planlanan ve gerçek yayın tarihleri
- Kampanyaya bağlantı

### 🔗 İlişkili Veriler
- Kampanya-Personel Atanması
- Müşteri-Personel İletişim
- Ödeme-Kampanya İlişkileri

---

## 🛠️ Teknoloji Stack

| Backend | Frontend |
|---------|----------|
| Django 5.2 | React 19 |
| Django REST | React Router 7 |
| JWT Auth | Axios |
| SQLite3 | Tailwind CSS 3 |
| CORS | Vite |

---

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| **QUICK_START.md** | ⚡ 5 dakikalık hızlı başlama |
| **SETUP_GUIDE.md** | 📖 Detaylı kurulum rehberi |
| **API_DOCUMENTATION.md** | 🔌 API endpoint'leri ve örnekleri |
| **DOCUMENTATION.md** | 📚 Proje hakkında detaylı bilgi |
| **PROJECT_SUMMARY.md** | ✅ Tamamlanan özellikleri listesi |

---

## 🚀 URL'ler

| Bileşen | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Django Admin | http://localhost:8000/admin |

---

## 📋 Menü Öğeleri

- 📊 **Dashboard** - İstatistikler ve özet
- 👥 **Clients** - İstemci yönetimi
- 📋 **Campaigns** - Kampanya yönetimi
- 👔 **Staff** - Personel yönetimi
- 💳 **Payments** - Ödeme yönetimi
- 📺 **Adverts** - İlan yönetimi
- ⭐ **Staff Grades** - Derece yönetimi

---

## 🔐 Kimlik Doğrulama

JWT token tabanlı güvenli kimlik doğrulama:

```javascript
// Otomatik token yönetimi
const token = localStorage.getItem('access_token');
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## 📊 Veritabanı Modelleri

```
Client ─── Campaign ─── Payment
           │       └─── Advert
           │
           └─── CampaignStaffAssignment
                └── Staff ─── StaffGrade

ClientStaffContact
└── Staff
```

---

## 🎨 Frontend Yapısı

```
src/
├── pages/            # 8 sayfa
├── components/       # 20+ bileşen
├── services/         # API servisler
├── context/          # Auth Context
└── App.jsx
```

---

## ✨ Özellikler

✅ CRUD İşlemleri (Oluştur, Oku, Güncelle, Sil)
✅ JWT Kimlik Doğrulama
✅ Protected Routes
✅ Responsive Tasarım
✅ Form Validasyonu
✅ Hata Yönetimi
✅ Loading Göstergeleri
✅ CORS Desteği

---

## 🧪 Test Alanları

1. **Login** - Kimlik doğrulama testi
2. **Dashboard** - İstatistikler gösterimi
3. **CRUD** - Tüm modellerde oluştur/güncelle/sil
4. **Filtreleme** - İstemci ve kampanya arama
5. **İlişkiler** - Personel atanması ve bağlantıları

---

## 🐛 Yaygın Sorunlar ve Çözümleri

**Port Zaten Kullanımda?**
```bash
python manage.py runserver 8001
npm run dev -- --port 3001
```

**Token Sorunu?**
- localStorage'ı temizle
- Tarayıcıyı yenile
- Yeniden giriş yap

**CORS Hatası?**
- settings.py kontrol et
- localhost:5173 ekli mi?

---

## 📞 Destek Kaynakları

- [Django Dokümantasyonu](https://docs.djangoproject.com/)
- [React Dokümantasyonu](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 🎯 Sonraki Adımlar

1. Projede değişiklikleri test et
2. API endpoint'lerini test et (cURL veya Postman)
3. Frontend bileşenlerini özelleştir
4. Üretim için deployment planla

---

## 📝 Notlar

- Veritabanı SQLite3 (production için PostgreSQL önerilir)
- Test hesabı: `calisan@ajans.com` / `123456`
- Tüm endpointler JWT token gerektirir
- CORS localhost'a açılmıştır

---

**Agate Campaign Management System v1.0**

Sorular için projede issue aç veya documentation dosyalarını incele.

🚀 **Başlamaya hazırsan, QUICK_START.md'e bak!**
