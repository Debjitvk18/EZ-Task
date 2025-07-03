from django.db import models
from django.conf import settings
import uuid
import os

def upload_to(instance, filename):
    """Generate upload path for files"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', filename)

class UploadedFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=upload_to)
    file_type = models.CharField(max_length=100)
    file_size = models.BigIntegerField()
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_files'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'uploaded_files'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.name} - {self.uploaded_by.email}"
    
    def delete(self, *args, **kwargs):
        # Delete the actual file when the model instance is deleted
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)

class DownloadLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE, related_name='download_links')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='download_links'
    )
    encrypted_token = models.CharField(max_length=500, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'download_links'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Download link for {self.file.name} - {self.user.email}"