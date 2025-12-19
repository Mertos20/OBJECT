import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AgateBackend.settings')
django.setup()

from django.contrib.auth.models import User

# Superuser'ın şifresini sıfırla
user = User.objects.get(email='calisan@ajans.com')
user.set_password('123456')
user.save()

print(f"✅ Şifre başarılı bir şekilde sıfırlandı!")
print(f"📧 Email: calisan@ajans.com")
print(f"🔐 Şifre: 123456")
