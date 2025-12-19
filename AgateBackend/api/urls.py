from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, CampaignViewSet, StaffViewSet, StaffGradeViewSet,
    PaymentViewSet, AdvertViewSet, CampaignStaffAssignmentViewSet,
    ClientStaffContactViewSet
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'staff-grades', StaffGradeViewSet, basename='staffgrade')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'adverts', AdvertViewSet, basename='advert')
router.register(r'campaign-staff', CampaignStaffAssignmentViewSet, basename='campaign-staff')
router.register(r'client-staff-contacts', ClientStaffContactViewSet, basename='client-staff-contact')

urlpatterns = [
    path('', include(router.urls)),
]
