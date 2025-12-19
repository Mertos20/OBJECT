from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Client, Campaign, Staff, StaffGrade, Payment, Advert,
    CampaignStaffAssignment, ClientStaffContact
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class StaffGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffGrade
        fields = ['id', 'grade_name', 'base_salary', 'description', 'created_at']


class StaffSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    grade_details = StaffGradeSerializer(source='grade', read_only=True)

    class Meta:
        model = Staff
        fields = ['id', 'user', 'user_details', 'staff_type', 'grade', 'grade_details',
                  'hire_date', 'is_active', 'created_at']


class CampaignStaffAssignmentSerializer(serializers.ModelSerializer):
    staff_details = StaffSerializer(source='staff', read_only=True)

    class Meta:
        model = CampaignStaffAssignment
        fields = ['id', 'campaign', 'staff', 'staff_details', 'role', 'assigned_date']


class AdvertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advert
        fields = ['id', 'campaign', 'title', 'description', 'status',
                  'production_progress', 'scheduled_start_date', 'scheduled_end_date',
                  'actual_start_date', 'actual_end_date', 'created_at']


class CampaignSerializer(serializers.ModelSerializer):
    staff_assignments = CampaignStaffAssignmentSerializer(many=True, read_only=True)
    adverts = AdvertSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = ['id', 'client', 'title', 'description', 'planned_start_date',
                  'planned_end_date', 'actual_start_date', 'actual_end_date',
                  'estimated_cost', 'budget', 'actual_cost', 'completion_percentage',
                  'status', 'staff_assignments', 'adverts', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'client', 'campaign', 'amount', 'payment_date', 'due_date',
                  'status', 'notes', 'created_at']


class ClientStaffContactSerializer(serializers.ModelSerializer):
    staff_details = StaffSerializer(source='staff', read_only=True)

    class Meta:
        model = ClientStaffContact
        fields = ['id', 'client', 'staff', 'staff_details', 'is_primary', 'assigned_date']


class ClientSerializer(serializers.ModelSerializer):
    campaigns = CampaignSerializer(many=True, read_only=True)
    staff_contacts = ClientStaffContactSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'client_type', 'company_name', 'contact_first_name',
                  'contact_last_name', 'email', 'phone', 'address', 'notes',
                  'campaigns', 'staff_contacts', 'payments', 'created_at']
