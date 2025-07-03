from django.contrib import admin
from .models import UploadedFile, DownloadLink

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'file_type', 'file_size', 'uploaded_by', 'uploaded_at', 'is_active')
    list_filter = ('file_type', 'uploaded_at', 'is_active', 'uploaded_by__user_type')
    search_fields = ('name', 'uploaded_by__email')
    readonly_fields = ('id', 'uploaded_at', 'file_size')
    ordering = ('-uploaded_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('uploaded_by')

@admin.register(DownloadLink)
class DownloadLinkAdmin(admin.ModelAdmin):
    list_display = ('file', 'user', 'created_at', 'expires_at', 'is_used', 'used_at')
    list_filter = ('created_at', 'expires_at', 'is_used')
    search_fields = ('file__name', 'user__email')
    readonly_fields = ('id', 'created_at', 'encrypted_token')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('file', 'user')