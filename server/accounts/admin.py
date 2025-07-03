from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'user_type', 'is_email_verified', 'is_active', 'created_at')
    list_filter = ('user_type', 'is_email_verified', 'is_active', 'created_at')
    search_fields = ('email', 'username')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('user_type', 'is_email_verified', 'email_verification_token')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {
            'fields': ('email', 'user_type')
        }),
    )