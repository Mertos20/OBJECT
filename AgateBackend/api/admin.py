from django.contrib import admin
from .models import (
    Client, Campaign, Staff, StaffGrade, Payment, Advert,
    CampaignStaffAssignment, ClientStaffContact
)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_first_name', 'contact_last_name', 'email', 'phone', 'client_type', 'created_at')
    list_filter = ('client_type', 'created_at')
    search_fields = ('company_name', 'contact_first_name', 'contact_last_name', 'email')
    readonly_fields = ('created_at',)


@admin.register(StaffGrade)
class StaffGradeAdmin(admin.ModelAdmin):
    list_display = ('grade_name', 'base_salary', 'created_at')
    search_fields = ('grade_name',)
    readonly_fields = ('created_at',)


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'staff_type', 'grade', 'hire_date', 'is_active', 'created_at')
    list_filter = ('staff_type', 'is_active', 'grade', 'created_at')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('created_at',)


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'status', 'planned_start_date', 'planned_end_date', 'completion_percentage', 'created_at')
    list_filter = ('status', 'created_at', 'planned_start_date')
    search_fields = ('title', 'client__company_name')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('client', 'title', 'description')
        }),
        ('Dates', {
            'fields': ('planned_start_date', 'planned_end_date', 'actual_start_date', 'actual_end_date')
        }),
        ('Budget', {
            'fields': ('estimated_cost', 'budget', 'actual_cost')
        }),
        ('Status', {
            'fields': ('status', 'completion_percentage')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(CampaignStaffAssignment)
class CampaignStaffAssignmentAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'staff', 'role', 'assigned_date')
    list_filter = ('campaign', 'assigned_date')
    search_fields = ('campaign__title', 'staff__user__first_name', 'staff__user__last_name')
    readonly_fields = ('assigned_date',)


@admin.register(ClientStaffContact)
class ClientStaffContactAdmin(admin.ModelAdmin):
    list_display = ('client', 'staff', 'is_primary', 'assigned_date')
    list_filter = ('is_primary', 'assigned_date')
    search_fields = ('client__company_name', 'staff__user__first_name', 'staff__user__last_name')
    readonly_fields = ('assigned_date',)


@admin.register(Advert)
class AdvertAdmin(admin.ModelAdmin):
    list_display = ('title', 'campaign', 'status', 'production_progress', 'scheduled_start_date', 'scheduled_end_date', 'created_at')
    list_filter = ('status', 'created_at', 'scheduled_start_date')
    search_fields = ('title', 'campaign__title')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('campaign', 'title', 'description')
        }),
        ('Production', {
            'fields': ('status', 'production_progress')
        }),
        ('Schedule', {
            'fields': ('scheduled_start_date', 'scheduled_end_date', 'actual_start_date', 'actual_end_date')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('client', 'campaign', 'amount', 'status', 'payment_date', 'due_date', 'created_at')
    list_filter = ('status', 'payment_date', 'created_at')
    search_fields = ('client__company_name', 'campaign__title')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Client & Campaign', {
            'fields': ('client', 'campaign')
        }),
        ('Payment Details', {
            'fields': ('amount', 'status')
        }),
        ('Dates', {
            'fields': ('payment_date', 'due_date')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
