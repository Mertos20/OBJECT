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
    # Expose related user details (read-only) and ensure 'user' PK isn't required on input
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    grade_details = StaffGradeSerializer(source='grade', read_only=True)
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    email = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Staff
        fields = ['id', 'user', 'user_details', 'username', 'password', 'first_name', 'last_name', 'email',
                  'staff_type', 'grade', 'grade_details', 'hire_date', 'is_active', 'created_at']

    def create(self, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        email = validated_data.pop('email', '')

        if not username:
            username = f'{first_name.lower()}.{last_name.lower()}' if first_name and last_name else f'user_{id(self)}'

        counter = 1
        original_username = username
        while User.objects.filter(username=username).exists():
            username = f'{original_username}{counter}'
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password or 'DefaultPass123!'
        )
        
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('username', None)
        validated_data.pop('password', None)
        
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        email = validated_data.pop('email', None)
        
        if first_name is not None or last_name is not None or email is not None:
            user = instance.user
            if first_name is not None:
                user.first_name = first_name
            if last_name is not None:
                user.last_name = last_name
            if email is not None:
                user.email = email
            user.save()
        
        return super().update(instance, validated_data)


class CampaignStaffAssignmentSerializer(serializers.ModelSerializer):
    staff_details = StaffSerializer(source='staff', read_only=True)
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)

    class Meta:
        model = CampaignStaffAssignment
        fields = ['id', 'campaign', 'campaign_title', 'staff', 'staff_details', 'role', 'assigned_date']


class AdvertSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    client_name = serializers.CharField(source='campaign.client.__str__', read_only=True)

    class Meta:
        model = Advert
        fields = ['id', 'campaign', 'campaign_title', 'client_name', 'title', 'description', 'status',
                  'production_progress', 'scheduled_start_date', 'scheduled_end_date',
                  'actual_start_date', 'actual_end_date', 'banner_image_url',
                  'banner_image_base64', 'banner_html', 'banner_prompt', 'banner_style', 'created_at']


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
