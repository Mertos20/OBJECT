import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AgateBackend.settings')
django.setup()

from django.contrib.auth.models import User

# Mevcut admin kullanıcıyı sil (varsa)
User.objects.filter(username='calisan@ajans.com').delete()

# Yeni admin kullanıcı oluştur
user = User.objects.create_superuser(
    username='calisan@ajans.com',
    email='calisan@ajans.com',
    password='123456'
)

print(f"✅ Superuser oluşturuldu: {user.username}")
