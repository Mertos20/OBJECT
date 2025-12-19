# 📚 Agate API Dokümantasyonu

## 🔐 Kimlik Doğrulama

Tüm API endpoint'leri JWT token gerektirir.

### Token Alma

**Request:**
```
POST /api/token/
Content-Type: application/json

{
  "username": "calisan@ajans.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Token Yenileme

**Request:**
```
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Kullanım

Tüm isteklere başlık ekle:
```
Authorization: Bearer <access_token>
```

---

## 👥 Clients (İstemciler)

### Tüm İstemcileri Getir

**Request:**
```
GET /api/clients/
```

**Response:**
```json
[
  {
    "id": 1,
    "client_type": "CORPORATE",
    "company_name": "ABC Ltd.",
    "contact_first_name": "John",
    "contact_last_name": "Doe",
    "email": "john@abc.com",
    "phone": "+90-555-1234567",
    "address": "123 Main St, City",
    "notes": "Important client",
    "created_at": "2025-01-15T10:30:00Z",
    "campaigns": [],
    "staff_contacts": [],
    "payments": []
  }
]
```

### İstemci Detayı

**Request:**
```
GET /api/clients/{id}/
```

### Yeni İstemci Ekle

**Request:**
```
POST /api/clients/
Content-Type: application/json

{
  "client_type": "CORPORATE",
  "company_name": "New Company Ltd.",
  "contact_first_name": "Jane",
  "contact_last_name": "Smith",
  "email": "jane@company.com",
  "phone": "+90-555-9876543",
  "address": "456 New St, City",
  "notes": "New client"
}
```

### İstemciyi Güncelle

**Request:**
```
PUT /api/clients/{id}/
Content-Type: application/json

{
  "company_name": "Updated Company Ltd.",
  "email": "newemail@company.com"
}
```

### İstemciyi Sil

**Request:**
```
DELETE /api/clients/{id}/
```

### İstemciye Personel Kontağı Ata

**Request:**
```
POST /api/clients/{id}/assign_staff_contact/
Content-Type: application/json

{
  "staff_id": 1,
  "is_primary": true
}
```

---

## 📋 Campaigns (Kampanyalar)

### Tüm Kampanyaları Getir

**Request:**
```
GET /api/campaigns/
```

**Response:**
```json
[
  {
    "id": 1,
    "client": 1,
    "title": "Summer Campaign 2025",
    "description": "Campaign description",
    "planned_start_date": "2025-05-01",
    "planned_end_date": "2025-08-31",
    "actual_start_date": "2025-05-05",
    "actual_end_date": null,
    "estimated_cost": "50000.00",
    "budget": "55000.00",
    "actual_cost": "42000.00",
    "completion_percentage": 75,
    "status": "ACTIVE",
    "staff_assignments": [],
    "adverts": [],
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Kampanya Detayı

**Request:**
```
GET /api/campaigns/{id}/
```

### Yeni Kampanya Ekle

**Request:**
```
POST /api/campaigns/
Content-Type: application/json

{
  "client": 1,
  "title": "New Campaign",
  "description": "Campaign description",
  "planned_start_date": "2025-06-01",
  "planned_end_date": "2025-06-30",
  "estimated_cost": "100000.00",
  "budget": "120000.00",
  "status": "PLANNING"
}
```

### Kampanyayı Güncelle

**Request:**
```
PUT /api/campaigns/{id}/
Content-Type: application/json

{
  "completion_percentage": 80,
  "actual_cost": "95000.00"
}
```

### Kampanyayı Sil

**Request:**
```
DELETE /api/campaigns/{id}/
```

### Kampanyaya Personel Ata

**Request:**
```
POST /api/campaigns/{id}/assign_staff/
Content-Type: application/json

{
  "staff_id": 1,
  "role": "Project Manager"
}
```

---

## 💳 Payments (Ödemeler)

### Tüm Ödemeleri Getir

**Request:**
```
GET /api/payments/
```

**Response:**
```json
[
  {
    "id": 1,
    "client": 1,
    "campaign": 1,
    "amount": "50000.00",
    "payment_date": "2025-01-15",
    "due_date": "2025-02-15",
    "status": "PENDING",
    "notes": "Payment notes",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Yeni Ödeme Ekle

**Request:**
```
POST /api/payments/
Content-Type: application/json

{
  "client": 1,
  "campaign": 1,
  "amount": "25000.00",
  "payment_date": "2025-01-20",
  "due_date": "2025-02-20",
  "status": "PENDING",
  "notes": "First installment"
}
```

### Ödemeyi Güncelle

**Request:**
```
PUT /api/payments/{id}/
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

### Ödemeyi Sil

**Request:**
```
DELETE /api/payments/{id}/
```

---

## 👔 Staff (Personel)

### Tüm Personeli Getir

**Request:**
```
GET /api/staff/
```

**Response:**
```json
[
  {
    "id": 1,
    "user": 1,
    "user_details": {
      "id": 1,
      "username": "calisan@ajans.com",
      "email": "calisan@ajans.com",
      "first_name": "Ali",
      "last_name": "Yilmaz"
    },
    "staff_type": "CREATIVE",
    "grade": 1,
    "grade_details": {
      "id": 1,
      "grade_name": "Senior Designer",
      "base_salary": "50000.00"
    },
    "hire_date": "2024-01-01",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Yeni Personel Ekle

**Request:**
```
POST /api/staff/
Content-Type: application/json

{
  "user": 1,
  "staff_type": "CREATIVE",
  "grade": 1,
  "hire_date": "2025-01-01",
  "is_active": true
}
```

### Personeli Güncelle

**Request:**
```
PUT /api/staff/{id}/
Content-Type: application/json

{
  "grade": 2,
  "is_active": true
}
```

### Personeli Sil

**Request:**
```
DELETE /api/staff/{id}/
```

---

## ⭐ Staff Grades (Personel Dereceleri)

### Tüm Dereceleri Getir

**Request:**
```
GET /api/staff-grades/
```

**Response:**
```json
[
  {
    "id": 1,
    "grade_name": "Junior Designer",
    "base_salary": "30000.00",
    "description": "Entry level designer",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Yeni Derece Ekle

**Request:**
```
POST /api/staff-grades/
Content-Type: application/json

{
  "grade_name": "Senior Manager",
  "base_salary": "80000.00",
  "description": "Senior management position"
}
```

### Dereceyi Güncelle

**Request:**
```
PUT /api/staff-grades/{id}/
Content-Type: application/json

{
  "base_salary": "85000.00"
}
```

### Dereceyi Sil

**Request:**
```
DELETE /api/staff-grades/{id}/
```

---

## 📺 Adverts (İlanlar/Reklamlar)

### Tüm İlanları Getir

**Request:**
```
GET /api/adverts/
```

**Response:**
```json
[
  {
    "id": 1,
    "campaign": 1,
    "title": "TV Commercial",
    "description": "30-second commercial",
    "status": "IN_PRODUCTION",
    "production_progress": 60,
    "scheduled_start_date": "2025-06-01",
    "scheduled_end_date": "2025-06-30",
    "actual_start_date": null,
    "actual_end_date": null,
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Yeni İlan Ekle

**Request:**
```
POST /api/adverts/
Content-Type: application/json

{
  "campaign": 1,
  "title": "Social Media Ad",
  "description": "Instagram/Facebook ad",
  "status": "PLANNING",
  "production_progress": 0,
  "scheduled_start_date": "2025-05-01",
  "scheduled_end_date": "2025-05-31"
}
```

### İlanı Güncelle

**Request:**
```
PUT /api/adverts/{id}/
Content-Type: application/json

{
  "status": "IN_PRODUCTION",
  "production_progress": 45
}
```

### İlanı Sil

**Request:**
```
DELETE /api/adverts/{id}/
```

---

## 🔗 Campaign Staff Assignments

### Tüm Atanmışları Getir

**Request:**
```
GET /api/campaign-staff/
```

### Atanmış Personeli Ekle

**Request:**
```
POST /api/campaign-staff/
Content-Type: application/json

{
  "campaign": 1,
  "staff": 1,
  "role": "Art Director"
}
```

### Atanmışı Sil

**Request:**
```
DELETE /api/campaign-staff/{id}/
```

---

## 🤝 Client Staff Contacts

### Tüm Kontakları Getir

**Request:**
```
GET /api/client-staff-contacts/
```

### Kontağı Ekle

**Request:**
```
POST /api/client-staff-contacts/
Content-Type: application/json

{
  "client": 1,
  "staff": 1,
  "is_primary": true
}
```

### Kontağı Sil

**Request:**
```
DELETE /api/client-staff-contacts/{id}/
```

---

## ⚠️ Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | OK - İstek başarılı |
| 201 | Created - Kaynak oluşturuldu |
| 204 | No Content - İçerik yok |
| 400 | Bad Request - Geçersiz istek |
| 401 | Unauthorized - Kimlik doğrulama hatası |
| 403 | Forbidden - Yasak |
| 404 | Not Found - Kaynak bulunamadı |
| 500 | Server Error - Sunucu hatası |

---

## 📝 Örnek: cURL ile Tam İşlem

```bash
# 1. Token Al
TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"calisan@ajans.com","password":"123456"}' \
  | jq -r '.access')

# 2. İstemci Ekle
curl -X POST http://localhost:8000/api/clients/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client_type": "CORPORATE",
    "company_name": "New Corp",
    "contact_first_name": "John",
    "contact_last_name": "Doe",
    "email": "john@corp.com"
  }'

# 3. İstemcileri Listele
curl http://localhost:8000/api/clients/ \
  -H "Authorization: Bearer $TOKEN"
```

---

**Agate API v1.0** - Türkçe Dokümantasyon
