from django.db import models

class Client(models.Model):
    CLIENT_TYPES = (
        ('CORPORATE', 'Corporate'),
        ('INDIVIDUAL', 'Individual'),
    )

    client_type = models.CharField(max_length=10, choices=CLIENT_TYPES, default='CORPORATE')
    company_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Company Name")
    
    # Eski 'contact_person' alanını ikiye ayırdık
    contact_first_name = models.CharField(max_length=100, verbose_name="Contact First Name", default='')
    contact_last_name = models.CharField(max_length=100, verbose_name="Contact Last Name", default='')
    
    email = models.EmailField(unique=True, verbose_name="Email Address")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Phone Number")
    
    address = models.TextField(blank=True, null=True, verbose_name="Address")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.client_type == 'CORPORATE' and self.company_name:
            return self.company_name
        return f"{self.contact_first_name} {self.contact_last_name}"