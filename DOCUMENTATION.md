# Agate - Campaign Management System

## 📋 Proje Özeti

Agate, işletmelerin kampanya ve müşteri yönetimini kolaylaştıran tam yığın bir uygulamadır. Django backend ve React frontend ile oluşturulmuştur.

## ✨ Temel Fonksiyonaliteler

### 1. 👥 İstemci (Client) Yönetimi
- İstemci bilgilerini kaydetme (ad, adres, iletişim detayları)
- Kurumsal ve bireysel istemci türleri
- İstemci filtreleme ve arama
- İstemci profili ve geçmiş görüntüleme

### 2. 📋 Kampanya Yönetimi
- Kampanya başlığı, açıklama ve durumu
- Planlanan ve gerçek başlangıç/bitiş tarihleri
- Tahmini ve gerçek maliyetler
- Bütçe takibi
- İlerleme yüzdesi (0-100%)
- Kampanya durumları: PLANNING, ACTIVE, COMPLETED, ON_HOLD

### 3. 💳 Ödeme Kaydı
- Müşteri ödemelerini kaydetme
- Ödeme tarihi ve vadesi
- Ödeme durumu (PENDING, COMPLETED, FAILED, REFUNDED)
- Kampanyal ödeme takibi
- Ödeme notları ve açıklamaları

### 4. 👔 Personel Yönetimi
- Personel kaydı (Yaratıcı ve İdari)
- İşe alınma tarihi ve durum
- Personel türü tanımı

### 5. ⭐ Personel Dereceleri
- Derece adı ve taban maaş
- Derece açıklaması
- Personele derece atanması

### 6. 🎯 Kampanya-Personel Atanması
- Personeli kampanyadaki rolü tanımlayarak atama
- Atama tarihi ve kişi bilgileri

### 7. 🤝 Müşteri-Personel İletişim Atanması
- Müşteriye personel kontağı atama
- Birincil kontağ ayarı
- Atama tarihi ve detayları

### 8. 📺 İlan/Reklam Yönetimi
- İlan başlığı ve açıklaması
- İlan durumu (PLANNING, IN_PRODUCTION, READY, RUNNING, COMPLETED)
- Üretim ilerlemesi (%)
- Planlanan ve gerçek yayın tarihleri
- Kampanyaya bağlantı

## 🛠️ Teknoloji Stack

### Backend
- **Django 5.2.7** - Web framework
- **Django REST Framework** - API geliştirme
- **SQLite3** - Veritabanı
- **djangorestframework-simplejwt** - JWT kimlik doğrulama
- **django-cors-headers** - CORS desteği

### Frontend
- **React 19** - UI kütüphanesi
- **React Router 7** - Yönlendirme
- **Axios** - HTTP istemci
- **Tailwind CSS 3** - Stil kütüphanesi
- **Vite** - Build tool

## 📁 Proje Yapısı

```
agate/
├── AgateBackend/           # Django Backend
│   ├── AgateBackend/       # Proje ayarları
│   │   ├── settings.py     # Django ayarları
│   │   ├── urls.py         # URL yönlendirmesi
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── api/                # Ana API app
│   │   ├── models.py       # Veri modelleri
│   │   ├── serializers.py  # API serializers
│   │   ├── views.py        # ViewSets
│   │   ├── urls.py         # API URLs
│   │   ├── admin.py        # Admin konfigürasyonu
│   │   └── migrations/     # DB migrasyonları
│   │
│   ├── manage.py           # Django yönetim
│   └── db.sqlite3          # Veritabanı
│
├── src/                    # React Frontend
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ClientsPage.jsx
│   │   ├── CampaignsPage.jsx
│   │   ├── StaffPage.jsx
│   │   ├── PaymentsPage.jsx
│   │   ├── AdvertsPage.jsx
│   │   └── StaffGradesPage.jsx
│   │
│   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Clients/
│   │   ├── Campaigns/
│   │   ├── Staff/
│   │   ├── Payments/
│   │   ├── Adverts/
│   │   ├── StaffGrades/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/           # API servis katmanı
│   │   ├── api.js
│   │   ├── clientService.js
│   │   ├── campaignService.js
│   │   └── ...
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Kurulum ve Başlama

### Backend Kurulumu

```bash
cd AgateBackend

# Sanal ortam oluştur ve aktifleştir
python -m venv venv
venv\Scripts\activate

# Bağımlılıkları yükle
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Migrasyonları uygula
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser
# Username: calisan@ajans.com
# Email: calisan@ajans.com
# Password: 123456

# Server başlat
python manage.py runserver
```

### Frontend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Tarayıcıda aç: http://localhost:5173
```

## 🔐 Kimlik Doğrulama

- **JWT Token** tabanlı kimlik doğrulama kullanılmaktadır
- Test hesabı:
  - Email: `calisan@ajans.com`
  - Password: `123456`

## 📊 Veritabanı Modelleri

### Client
- client_type (CORPORATE, INDIVIDUAL)
- company_name
- contact_first_name, contact_last_name
- email, phone, address
- notes
- created_at

### Campaign
- client (FK)
- title, description
- planned_start_date, planned_end_date
- actual_start_date, actual_end_date
- estimated_cost, budget, actual_cost
- completion_percentage (0-100)
- status (PLANNING, ACTIVE, COMPLETED, ON_HOLD)

### Payment
- client (FK)
- campaign (FK, Optional)
- amount
- payment_date, due_date
- status (PENDING, COMPLETED, FAILED, REFUNDED)
- notes

### Staff
- user (OneToOne User)
- staff_type (CREATIVE, ADMIN)
- grade (FK)
- hire_date, is_active

### StaffGrade
- grade_name
- base_salary
- description

### Campaign Staff Assignment
- campaign (FK)
- staff (FK)
- role
- assigned_date

### Client Staff Contact
- client (FK)
- staff (FK)
- is_primary
- assigned_date

### Advert
- campaign (FK)
- title, description
- status (PLANNING, IN_PRODUCTION, READY, RUNNING, COMPLETED)
- production_progress (0-100)
- scheduled_start_date, scheduled_end_date
- actual_start_date, actual_end_date

## 🔌 API Endpoints

### Clients
- `GET/POST /api/clients/` - Tüm istemcileri getir / Yeni istemci ekle
- `GET/PUT/DELETE /api/clients/{id}/` - İstemci detayı, güncelle, sil
- `POST /api/clients/{id}/assign_staff_contact/` - Personel kontağı atama

### Campaigns
- `GET/POST /api/campaigns/` - Tüm kampanyalar
- `GET/PUT/DELETE /api/campaigns/{id}/` - Kampanya detayı, güncelle, sil
- `POST /api/campaigns/{id}/assign_staff/` - Personel atama

### Staff
- `GET/POST/PUT/DELETE /api/staff/` - Personel CRUD

### Staff Grades
- `GET/POST/PUT/DELETE /api/staff-grades/` - Derece CRUD

### Payments
- `GET/POST/PUT/DELETE /api/payments/` - Ödeme CRUD

### Adverts
- `GET/POST/PUT/DELETE /api/adverts/` - İlan CRUD

### Campaign Staff Assignments
- `GET/POST/DELETE /api/campaign-staff/` - Atama yönetimi

### Client Staff Contacts
- `GET/POST/DELETE /api/client-staff-contacts/` - Kontağ yönetimi

## 🎨 Özellikler

- ✅ Tam CRUD işlemleri
- ✅ JWT kimlik doğrulama
- ✅ CORS desteği
- ✅ Responsive tasarım (Tailwind CSS)
- ✅ Form validasyonu
- ✅ Hata yönetimi
- ✅ Loading göstergeleri
- ✅ Dinamik filtreleme

## 📝 Notlar

- CORS localhost:5173 ve localhost:3000'e açılmıştır
- SQLite3 veritabanı kullanılmaktadır (production için PostgreSQL önerilir)
- JWT token'lar localStorage'da saklanır
- Tüm API endpoints JWT token gerektirir

## 🤝 Katkı

Proje geliştirmesi için pull request göndererek katkı sağlayabilirsiniz.

## 📞 İletişim

Sorular veya öneriler için iletişime geçin.

---

**Agate Campaign Management System v1.0** - 2025
