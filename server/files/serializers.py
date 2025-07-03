from rest_framework import serializers
from .models import UploadedFile, DownloadLink
from django.conf import settings

class UploadedFileSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)
    
    class Meta:
        model = UploadedFile
        fields = [
            'id', 'name', 'file_type', 'file_size', 
            'uploaded_by_email', 'uploaded_at', 'is_active'
        ]
        read_only_fields = ['id', 'uploaded_at', 'uploaded_by_email']

class FileUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    
    class Meta:
        model = UploadedFile
        fields = ['file']
    
    def validate_file(self, value):
        # Check file type
        if value.content_type not in settings.ALLOWED_FILE_TYPES:
            raise serializers.ValidationError(
                "Only PPTX, DOCX, and XLSX files are allowed."
            )
        
        # Check file size (50MB limit)
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError(
                "File size cannot exceed 50MB."
            )
        
        return value
    
    def create(self, validated_data):
        file = validated_data['file']
        
        uploaded_file = UploadedFile.objects.create(
            name=file.name,
            file=file,
            file_type=file.content_type,
            file_size=file.size,
            uploaded_by=self.context['request'].user
        )
        
        return uploaded_file

class DownloadLinkSerializer(serializers.ModelSerializer):
    download_link = serializers.SerializerMethodField()
    
    class Meta:
        model = DownloadLink
        fields = ['download_link', 'created_at', 'expires_at']
    
    def get_download_link(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/api/files/secure-download/{obj.encrypted_token}/')
        return f'/api/files/secure-download/{obj.encrypted_token}/'