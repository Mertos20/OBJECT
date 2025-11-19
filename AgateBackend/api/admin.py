from django.contrib import admin
from .models import Client  # Oluşturduğumuz Client modelini import ediyoruz

# Bu satır, Client modelini admin panelinde görünür ve yönetilebilir hale getirir
admin.site.register(Client)