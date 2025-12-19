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
from .services.gemini_service import (
    generate_campaign_banner, 
    generate_banner_variations,
    generate_social_media_banners,
    generate_advert_banner
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

    @action(detail=True, methods=['post'])
    def generate_banner(self, request, pk=None):
        """Kampanya için AI banner oluştur"""
        campaign = self.get_object()
        style = request.data.get('style', 'modern')
        
        # Marka adını client'tan al
        brand_name = str(campaign.client)
        
        result = generate_campaign_banner(
            campaign_title=campaign.title,
            brand_name=brand_name,
            description=campaign.description or '',
            style=style
        )
        
        if result['success']:
            # Banner'ı kampanyaya kaydet
            campaign.banner_html = result['banner_html']
            campaign.banner_prompt = result['prompt_used']
            campaign.save()
            
            return Response({
                'success': True,
                'banner_html': result['banner_html'],
                'message': 'Banner başarıyla oluşturuldu ve kaydedildi'
            })
        else:
            return Response({
                'success': False,
                'message': result['message']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def generate_banner_variations(self, request, pk=None):
        """Kampanya için birden fazla banner varyasyonu oluştur"""
        campaign = self.get_object()
        count = request.data.get('count', 3)
        
        brand_name = str(campaign.client)
        
        variations = generate_banner_variations(
            campaign_title=campaign.title,
            brand_name=brand_name,
            count=min(int(count), 5)
        )
        
        return Response({
            'success': True,
            'variations': variations,
            'count': len(variations)
        })

    @action(detail=True, methods=['post'])
    def generate_social_banners(self, request, pk=None):
        """Kampanya için sosyal medya banner'ları oluştur"""
        campaign = self.get_object()
        brand_name = str(campaign.client)
        
        result = generate_social_media_banners(
            campaign_title=campaign.title,
            brand_name=brand_name,
            description=campaign.description or ''
        )
        
        if result['success']:
            return Response({
                'success': True,
                'banners': result['banners'],
                'message': 'Sosyal medya banner\'ları oluşturuldu'
            })
        else:
            return Response({
                'success': False,
                'message': result['message']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_banner(self, request, pk=None):
        """Kampanyanın mevcut banner'ını getir"""
        campaign = self.get_object()
        
        if campaign.banner_html:
            return Response({
                'success': True,
                'banner_html': campaign.banner_html,
                'has_banner': True
            })
        else:
            return Response({
                'success': True,
                'banner_html': None,
                'has_banner': False,
                'message': 'Bu kampanya için henüz banner oluşturulmamış'
            })


class AdvertViewSet(viewsets.ModelViewSet):
    """İlan/Reklam detayları ve üretim durumu"""
    queryset = Advert.objects.all().order_by('-created_at')
    serializer_class = AdvertSerializer

    @action(detail=True, methods=['post'])
    def generate_banner(self, request, pk=None):
        """Reklam afişi için AI görsel oluştur"""
        advert = self.get_object()
        style = request.data.get('style', 'modern')
        
        # Kampanya ve marka bilgilerini al
        campaign = advert.campaign
        brand_name = str(campaign.client)
        
        result = generate_advert_banner(
            advert_title=advert.title,
            campaign_title=campaign.title,
            brand_name=brand_name,
            description=advert.description or '',
            style=style
        )
        
        if result['success']:
            # Banner'ı reklama kaydet
            advert.banner_image_base64 = result.get('image_base64')
            advert.banner_image_url = result.get('image_url')
            advert.banner_html = result.get('html_fallback')
            advert.banner_prompt = result['prompt_used']
            advert.banner_style = style
            advert.save()
            
            serializer = self.get_serializer(advert)
            return Response({
                'success': True,
                'advert': serializer.data,
                'message': result.get('message', 'Reklam afişi başarıyla oluşturuldu ve kaydedildi')
            })
        else:
            return Response({
                'success': False,
                'message': result['message']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def regenerate_banner(self, request, pk=None):
        """Reklam afişini yeni stil ile yeniden oluştur"""
        advert = self.get_object()
        style = request.data.get('style', 'modern')
        
        campaign = advert.campaign
        brand_name = str(campaign.client)
        
        result = generate_advert_banner(
            advert_title=advert.title,
            campaign_title=campaign.title,
            brand_name=brand_name,
            description=advert.description or '',
            style=style
        )
        
        if result['success']:
            advert.banner_image_base64 = result.get('image_base64')
            advert.banner_image_url = result.get('image_url')
            advert.banner_html = result.get('html_fallback')
            advert.banner_prompt = result['prompt_used']
            advert.banner_style = style
            advert.save()
            
            serializer = self.get_serializer(advert)
            return Response({
                'success': True,
                'advert': serializer.data,
                'message': result.get('message', 'Reklam afişi yeniden oluşturuldu')
            })
        else:
            return Response({
                'success': False,
                'message': result['message']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_banner(self, request, pk=None):
        """Reklamın mevcut afişini getir"""
        advert = self.get_object()
        
        if advert.banner_image_base64 or advert.banner_image_url:
            return Response({
                'success': True,
                'has_banner': True,
                'banner_image_base64': advert.banner_image_base64,
                'banner_image_url': advert.banner_image_url,
                'banner_style': advert.banner_style
            })
        else:
            return Response({
                'success': True,
                'has_banner': False,
                'message': 'Bu reklam için henüz afiş oluşturulmamış'
            })


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
