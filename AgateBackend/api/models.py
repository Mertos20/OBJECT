from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    CLIENT_TYPES = (
        ("CORPORATE", "Corporate"),
        ("INDIVIDUAL", "Individual"),
    )

    client_type = models.CharField(
        max_length=10, choices=CLIENT_TYPES, default="CORPORATE"
    )
    company_name = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Company Name"
    )

    contact_first_name = models.CharField(
        max_length=100, verbose_name="Contact First Name", default=""
    )
    contact_last_name = models.CharField(
        max_length=100, verbose_name="Contact Last Name", default=""
    )

    email = models.EmailField(unique=True, verbose_name="Email Address")
    phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Phone Number"
    )

    address = models.TextField(blank=True, null=True, verbose_name="Address")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.client_type == "CORPORATE" and self.company_name:
            return self.company_name
        return f"{self.contact_first_name} {self.contact_last_name}"

    class Meta:
        ordering = ['-created_at']


# ============ YENİ MODELLERİ BURAYA EKLE ============

class StaffGrade(models.Model):
    """Personel Dereceleri ve Maaş Bilgileri"""
    grade_name = models.CharField(max_length=100, verbose_name="Grade Name")
    base_salary = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Base Salary"
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.grade_name} - ${self.base_salary}"

    class Meta:
        ordering = ['grade_name']
        verbose_name = "Staff Grade"
        verbose_name_plural = "Staff Grades"


class Staff(models.Model):
    """Personel Kayıtları (Yaratıcı ve İdari)"""
    STAFF_TYPE_CHOICES = (
        ('CREATIVE', 'Creative'),
        ('ADMIN', 'Administrative'),
    )

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='staff_profile'
    )
    staff_type = models.CharField(
        max_length=10, choices=STAFF_TYPE_CHOICES, verbose_name="Staff Type"
    )
    grade = models.ForeignKey(
        StaffGrade, on_delete=models.SET_NULL, null=True, verbose_name="Grade"
    )
    hire_date = models.DateField(verbose_name="Hire Date")
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_staff_type_display()})"

    class Meta:
        ordering = ['user__first_name']
        verbose_name = "Staff"
        verbose_name_plural = "Staff"


class Campaign(models.Model):
    """Kampanya Detayları"""
    STATUS_CHOICES = (
        ('PLANNING', 'Planning'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    )

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='campaigns', 
        verbose_name="Client"
    )
    title = models.CharField(max_length=255, verbose_name="Campaign Title")
    description = models.TextField(blank=True, null=True)

    # Tarihler
    planned_start_date = models.DateField(verbose_name="Planned Start Date")
    planned_end_date = models.DateField(verbose_name="Planned End Date")
    actual_start_date = models.DateField(
        blank=True, null=True, verbose_name="Actual Start Date"
    )
    actual_end_date = models.DateField(
        blank=True, null=True, verbose_name="Actual End Date"
    )

    # Bütçe
    estimated_cost = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Estimated Cost"
    )
    budget = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Budget"
    )
    actual_cost = models.DecimalField(
        max_digits=12, decimal_places=2, default=0, verbose_name="Actual Cost"
    )

    # Durum
    completion_percentage = models.IntegerField(
        default=0, verbose_name="Completion %"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PLANNING',
        verbose_name="Status"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.client}"

    class Meta:
        ordering = ['-created_at']


class CampaignStaffAssignment(models.Model):
    """Personel-Kampanya Atanması"""
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name='staff_assignments',
        verbose_name="Campaign"
    )
    staff = models.ForeignKey(
        Staff, on_delete=models.CASCADE, verbose_name="Staff"
    )
    role = models.CharField(
        max_length=100, verbose_name="Role on Campaign"
    )
    assigned_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.staff.user.get_full_name()} - {self.campaign.title}"

    class Meta:
        unique_together = ('campaign', 'staff')
        ordering = ['-assigned_date']
        verbose_name = "Campaign Staff Assignment"
        verbose_name_plural = "Campaign Staff Assignments"


class ClientStaffContact(models.Model):
    """Müşteri-Personel İletişim Atanması"""
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='staff_contacts',
        verbose_name="Client"
    )
    staff = models.ForeignKey(
        Staff, on_delete=models.CASCADE, verbose_name="Staff Contact"
    )
    is_primary = models.BooleanField(
        default=False, verbose_name="Primary Contact"
    )
    assigned_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.client} - Contact: {self.staff.user.get_full_name()}"

    class Meta:
        unique_together = ('client', 'staff')
        ordering = ['-is_primary', '-assigned_date']
        verbose_name = "Client Staff Contact"
        verbose_name_plural = "Client Staff Contacts"


class Advert(models.Model):
    """İlan/Reklam Detayları"""
    STATUS_CHOICES = (
        ('PLANNING', 'Planning'),
        ('IN_PRODUCTION', 'In Production'),
        ('READY', 'Ready'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
    )

    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name='adverts',
        verbose_name="Campaign"
    )
    title = models.CharField(max_length=255, verbose_name="Advert Title")
    description = models.TextField(blank=True, null=True)

    # Üretim Durumu
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PLANNING',
        verbose_name="Status"
    )
    production_progress = models.IntegerField(
        default=0, verbose_name="Production Progress %"
    )

    # Yayın Tarihleri
    scheduled_start_date = models.DateField(verbose_name="Scheduled Start Date")
    scheduled_end_date = models.DateField(verbose_name="Scheduled End Date")
    actual_start_date = models.DateField(
        blank=True, null=True, verbose_name="Actual Start Date"
    )
    actual_end_date = models.DateField(
        blank=True, null=True, verbose_name="Actual End Date"
    )

    # AI Generated Banner/Poster
    banner_image_url = models.URLField(
        blank=True, null=True, verbose_name="Banner Image URL"
    )
    banner_image_base64 = models.TextField(
        blank=True, null=True, verbose_name="Banner Image Base64"
    )
    banner_html = models.TextField(
        blank=True, null=True, verbose_name="Banner HTML Fallback"
    )
    banner_prompt = models.TextField(
        blank=True, null=True, verbose_name="AI Prompt Used"
    )
    banner_style = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Banner Style"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.campaign.title}"

    class Meta:
        ordering = ['-created_at']


class Payment(models.Model):
    """Ödeme Kaydı"""
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )

    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='payments',
        verbose_name="Client"
    )
    campaign = models.ForeignKey(
        Campaign, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='payments', verbose_name="Campaign"
    )
    amount = models.DecimalField(
        max_digits=12, decimal_places=2, verbose_name="Payment Amount"
    )
    payment_date = models.DateField(verbose_name="Payment Date")
    due_date = models.DateField(
        blank=True, null=True, verbose_name="Due Date"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING',
        verbose_name="Status"
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client} - ${self.amount} ({self.status})"

    class Meta:
        ordering = ['-payment_date']
