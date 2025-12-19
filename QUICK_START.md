# 🚀 Agate - Hızlı Başlama (Quick Start)

## ⚡ 5 Dakikalık Kurulum

### Adım 1: Terminal 1 - Backend Başlat
```bash
cd AgateBackend
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py createsuperuser
# Username: calisan@ajans.com
# Password: 123456
python manage.py runserver
```
✅ Backend şimdi http://localhost:8000 adresinde çalışıyor

### Adım 2: Terminal 2 - Frontend Başlat
```bash
npm install
npm run dev
```
✅ Frontend şimdi http://localhost:5173 adresinde çalışıyor

### Adım 3: Tarayıcıda Aç
```
http://localhost:5173
```

### Adım 4: Giriş Yap
```
Email: calisan@ajans.com
Password: 123456
```

✅ **Başladın!** 🎉

---

## 📋 Menüdeki Bölümler

| Bölüm | Açıklama |
|-------|----------|
| 📊 Dashboard | Istatistikler ve özet görünüm |
| 👥 Clients | İstemci/Müşteri yönetimi |
| 📋 Campaigns | Kampanya yönetimi |
| 👔 Staff | Personel yönetimi |
| 💳 Payments | Ödeme takibi |
| 📺 Adverts | İlan/Reklam yönetimi |
| ⭐ Staff Grades | Personel derece ve maaş |

---

## 🧪 Örnek Veri Ekle

### İstemci Eklemek
1. **Clients** menüsüne git
2. **+ Add Client** tıkla
3. Bilgileri doldur:
   - Type: CORPORATE
   - Company: ABC Ltd.
   - Contact: John Doe
   - Email: john@abc.com
4. Kaydet

### Kampanya Eklemek
1. **Campaigns** menüsüne git
2. **+ Add Campaign** tıkla
3. Bilgileri doldur:
   - Client: Seç
   - Title: Summer 2025
   - Status: ACTIVE
   - Budget: 50000
4. Kaydet

### Personel Eklemek
1. İlk olarak **Staff Grades**'de bir derece oluştur
2. Sonra **Staff**'e git ve personel ekle

---

## 🐛 Sorun Gidermek

| Problem | Çözüm |
|---------|-------|
| "Port 8000 in use" | `python manage.py runserver 8001` |
| "Port 5173 in use" | `npm run dev -- --port 3001` |
| "Module not found" | `pip install -r requirements.txt` |
| "No such table" | `python manage.py migrate` |
| CORS hatası | settings.py'de CORS_ALLOWED_ORIGINS kontrol et |

---

## 📚 Daha Fazla Bilgi

- **SETUP_GUIDE.md** - Detaylı kurulum
- **API_DOCUMENTATION.md** - API referansı
- **DOCUMENTATION.md** - Proje hakkında

---

**Veri tabanında henüz bir superuser hesabı vardır. Eğer silemek istersen:**

```bash
python manage.py migrate api zero
python manage.py migrate
python manage.py createsuperuser
```

---

**Happy Coding! 🎉**
