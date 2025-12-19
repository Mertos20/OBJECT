# 🚀 Agate - Kurulum ve Başlama Rehberi

## 📋 Sistem Gereksinimleri

- **Python 3.8+**
- **Node.js 16+**
- **npm veya yarn**
- **Git**

## 🛠️ Adım Adım Kurulum

### 1. Repository'yi Klonla

```bash
cd "c:\Users\bekta\OneDrive\Masaüstü"
git clone <repo-url>
cd "agate - Kopya"
```

### 2. Backend Kurulumu

#### 2.1 Sanal Ortam Oluştur
```bash
cd AgateBackend
python -m venv venv
venv\Scripts\activate
```

#### 2.2 Bağımlılıkları Yükle
```bash
pip install django==5.2.7
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

#### 2.3 Veritabanı Kurulumu
```bash
python manage.py migrate
```

Çıktı örneği:
```
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  ...
```

#### 2.4 Superuser Oluştur
```bash
python manage.py createsuperuser
```

Sorular:
```
Username: calisan@ajans.com
Email: calisan@ajans.com
Password: 123456
Password (again): 123456
```

#### 2.5 Backend Server'ı Başlat
```bash
python manage.py runserver
```

Çıktı örneği:
```
Starting development server at http://127.0.0.1:8000/
```

✅ Backend hazır! Django Admin: `http://localhost:8000/admin`

### 3. Frontend Kurulumu

#### 3.1 Frontend Klasörüne Git
```bash
cd ..
# agate - Kopya klasöründe olmalısın
```

#### 3.2 Bağımlılıkları Yükle
```bash
npm install
```

Veya yarn kullanıyorsan:
```bash
yarn install
```

#### 3.3 Development Server'ı Başlat
```bash
npm run dev
```

Çıktı örneği:
```
  VITE v5.1.7  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ Frontend hazır!

## 🔐 Login Yapma

Tarayıcıda aç: `http://localhost:5173`

**Giriş Bilgileri:**
- Email: `calisan@ajans.com`
- Password: `123456`

## 📍 Önemli URL'ler

| Bileşen | URL | Açıklama |
|---------|-----|----------|
| Frontend | http://localhost:5173 | React uygulaması |
| Backend API | http://localhost:8000/api | REST API endpoint'leri |
| Django Admin | http://localhost:8000/admin | Veri yönetimi |
| API Documentation | http://localhost:8000/api | Browsable API |

## 📊 Veritabanı Migrasyonları

Modelleri değiştirdikten sonra:

```bash
cd AgateBackend
python manage.py makemigrations
python manage.py migrate
```

## 🧪 Test Etme

### API Test Etme (cURL)

```bash
# Token almak
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"calisan@ajans.com","password":"123456"}'

# Cevap:
# {"access":"eyJ0eXAi...","refresh":"eyJ0eXAi..."}

# İstemci listesini getirmek
curl http://localhost:8000/api/clients/ \
  -H "Authorization: Bearer <access_token>"
```

### Frontend Test Etme

1. Login sayfasında test bilgileriyle giriş yap
2. Dashboard'u kontrol et
3. Tüm menü öğelerini (Clients, Campaigns, Staff, Payments, Adverts, Staff Grades) test et

## 🆘 Sorun Giderme

### Problem: "Port 8000 already in use"
```bash
# Farklı port kullanmak
python manage.py runserver 8001
```

### Problem: "Port 5173 already in use"
```bash
# Farklı port kullanmak
npm run dev -- --port 3001
```

### Problem: "Module not found"
```bash
# Django (Backend klasöründe)
pip install -r requirements.txt

# React (Frontend klasöründe)
npm install
```

### Problem: CORS hatası
Backend'de `settings.py`'de CORS_ALLOWED_ORIGINS kontrol et:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
```

### Problem: "No such table" hatası
```bash
python manage.py migrate
```

## 🔄 Tam Sıfırdan Başlama

Veritabanını temizlemek ve yeniden kurulum yapmak:

```bash
cd AgateBackend

# Eski migration dosyalarını sil (api/migrations/ dışında __init__.py saç)
# Eski db.sqlite3 sil

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 📦 Production Hazırlığı

```bash
# Frontend build etme
npm run build

# Statik dosyaları Django'ya hazırlama
cd AgateBackend
python manage.py collectstatic --noinput
```

## 🚀 Deployment

Backend için (örneğin Heroku):
```bash
# requirements.txt oluştur
pip freeze > requirements.txt

# Procfile oluştur
web: gunicorn AgateBackend.wsgi
```

## 📚 Faydalı Kaynaklar

- [Django Resmi Dokümantasyonu](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Dokümantasyonu](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 👨‍💻 Geliştirme Tipsler

### Debug Mode
Django settings.py:
```python
DEBUG = True  # Development için
```

### VS Code Extensions Önerisi
- Pylance (Python)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- SQLite

### Git Komutları
```bash
git status
git add .
git commit -m "Özellik açıklaması"
git push origin main
```

## 📞 Hata Raporlama

Hatayla karşılaştıysan:
1. Hata mesajını kopyala
2. Stack trace'i kontrol et
3. Çözüm bulamazsan repository'de issue aç

---

**Happy Coding! 🎉**
