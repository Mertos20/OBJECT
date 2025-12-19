from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Client, Campaign, Staff, StaffGrade, Payment, Advert,
    CampaignStaffAssignment, ClientStaffContact
)
from .serializers import (
    ClientSerializer, CampaignSerializer, StaffSerializer, StaffGradeSerializer,
    PaymentSerializer, AdvertSerializer, CampaignStaffAssignmentSerializer,
    ClientStaffContactSerializer
)


class ClientViewSet(viewsets.ModelViewSet):
    """API endpoint that allows clients to be viewed or edited."""
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer

    @action(detail=True, methods=['post'])
    def assign_staff_contact(self, request, pk=None):
        """Müşteriye personel kontağı atama"""
        client = self.get_object()
        staff_id = request.data.get('staff_id')
        is_primary = request.data.get('is_primary', False)

        try:
            staff = Staff.objects.get(id=staff_id)
            contact, created = ClientStaffContact.objects.get_or_create(
                client=client, staff=staff, defaults={'is_primary': is_primary}
            )
            serializer = ClientStaffContactSerializer(contact)
            return Response(serializer.data,
                          status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)


class StaffGradeViewSet(viewsets.ModelViewSet):
    """Personel dereceleri ve maaş bilgileri"""
    queryset = StaffGrade.objects.all()
    serializer_class = StaffGradeSerializer


class StaffViewSet(viewsets.ModelViewSet):
    """Personel kayıtları (Yaratıcı ve İdari)"""
    queryset = Staff.objects.all().order_by('-created_at')
    serializer_class = StaffSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """Kampanya detayları ve yönetimi"""
    queryset = Campaign.objects.all().order_by('-created_at')
    serializer_class = CampaignSerializer

    @action(detail=True, methods=['post'])
    def assign_staff(self, request, pk=None):
        """Kampanyaya personel atama"""
        campaign = self.get_object()
        staff_id = request.data.get('staff_id')
        role = request.data.get('role')

        try:
            staff = Staff.objects.get(id=staff_id)
            assignment, created = CampaignStaffAssignment.objects.get_or_create(
                campaign=campaign, staff=staff, defaults={'role': role}
            )
            serializer = CampaignStaffAssignmentSerializer(assignment)
            return Response(serializer.data,
                          status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)


class AdvertViewSet(viewsets.ModelViewSet):
    """İlan/Reklam detayları ve üretim durumu"""
    queryset = Advert.objects.all().order_by('-created_at')
    serializer_class = AdvertSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """Müşteri ödeme kayıtları"""
    queryset = Payment.objects.all().order_by('-payment_date')
    serializer_class = PaymentSerializer


class CampaignStaffAssignmentViewSet(viewsets.ModelViewSet):
    """Personel-Kampanya atanması yönetimi"""
    queryset = CampaignStaffAssignment.objects.all()
    serializer_class = CampaignStaffAssignmentSerializer


class ClientStaffContactViewSet(viewsets.ModelViewSet):
    """Müşteri-Personel iletişim atanması yönetimi"""
    queryset = ClientStaffContact.objects.all()
    serializer_class = ClientStaffContactSerializer
