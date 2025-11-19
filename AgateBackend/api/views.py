from django.shortcuts import render

from rest_framework import viewsets
from .models import Client
from .serializers import ClientSerializer

class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows clients to be viewed or edited.
    """
    queryset = Client.objects.all().order_by('-created_at')
    serializer_class = ClientSerializer