from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        # Yeni eklediğimiz tüm alanları buraya dahil ediyoruz
        fields = [
            'id', 'client_type', 'company_name', 'contact_first_name', 
            'contact_last_name', 'email', 'phone', 'address', 'notes', 'created_at'
        ]