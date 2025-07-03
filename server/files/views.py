from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.utils import timezone
from datetime import timedelta
import mimetypes
import os

from .models import UploadedFile, DownloadLink
from .serializers import UploadedFileSerializer, FileUploadSerializer, DownloadLinkSerializer
from .utils import generate_secure_download_token, decrypt_download_token
from accounts.models import User

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """
    Upload file - Only for operations users
    """
    # Check if user is operations type
    if request.user.user_type != 'operations':
        return Response({
            'success': False,
            'message': 'Only operations users can upload files.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = FileUploadSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        uploaded_file = serializer.save()
        
        return Response({
            'success': True,
            'message': 'File uploaded successfully.',
            'file': UploadedFileSerializer(uploaded_file).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'File upload failed.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):
    """
    List all uploaded files - Available to all authenticated users
    """
    files = UploadedFile.objects.filter(is_active=True)
    serializer = UploadedFileSerializer(files, many=True)
    
    return Response({
        'success': True,
        'files': serializer.data,
        'count': files.count()
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_download_link(request, file_id):
    """
    Generate secure download link - Only for client users
    """
    # Check if user is client type
    if request.user.user_type != 'client':
        return Response({
            'success': False,
            'message': 'Only client users can download files.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get the file
    file_obj = get_object_or_404(UploadedFile, id=file_id, is_active=True)
    
    # Generate secure token
    encrypted_token = generate_secure_download_token(file_obj, request.user)
    
    # Create download link record
    expires_at = timezone.now() + timedelta(hours=24)  # Link expires in 24 hours
    
    download_link = DownloadLink.objects.create(
        file=file_obj,
        user=request.user,
        encrypted_token=encrypted_token,
        expires_at=expires_at
    )
    
    serializer = DownloadLinkSerializer(download_link, context={'request': request})
    
    return Response({
        'success': True,
        'message': 'Download link generated successfully.',
        'download_link': serializer.data['download_link']
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def secure_download(request, token):
    """
    Secure file download using encrypted token - Only accessible by client users
    """
    # Check if user is client type
    if request.user.user_type != 'client':
        return Response({
            'success': False,
            'message': 'Access denied. Only client users can access download links.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Decrypt and validate token
        file_id, user_id = decrypt_download_token(token)
        
        # Verify the user matches the token
        if str(request.user.id) != user_id:
            return Response({
                'success': False,
                'message': 'Access denied. Invalid user for this download link.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get download link record
        download_link = get_object_or_404(
            DownloadLink, 
            encrypted_token=token,
            user=request.user,
            file__id=file_id
        )
        
        # Check if link has expired
        if timezone.now() > download_link.expires_at:
            return Response({
                'success': False,
                'message': 'Download link has expired.'
            }, status=status.HTTP_410_GONE)
        
        # Check if link has already been used (optional - remove if multiple downloads allowed)
        if download_link.is_used:
            return Response({
                'success': False,
                'message': 'Download link has already been used.'
            }, status=status.HTTP_410_GONE)
        
        # Get the file
        file_obj = download_link.file
        
        # Mark link as used
        download_link.is_used = True
        download_link.used_at = timezone.now()
        download_link.save()
        
        # Serve the file
        if os.path.exists(file_obj.file.path):
            with open(file_obj.file.path, 'rb') as f:
                file_data = f.read()
            
            # Determine content type
            content_type, _ = mimetypes.guess_type(file_obj.file.path)
            if not content_type:
                content_type = 'application/octet-stream'
            
            response = HttpResponse(file_data, content_type=content_type)
            response['Content-Disposition'] = f'attachment; filename="{file_obj.name}"'
            response['Content-Length'] = len(file_data)
            
            return response
        else:
            raise Http404("File not found")
            
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Invalid or expired download token.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    """
    Delete file - Only for operations users who uploaded the file
    """
    # Check if user is operations type
    if request.user.user_type != 'operations':
        return Response({
            'success': False,
            'message': 'Only operations users can delete files.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get the file and check ownership
    file_obj = get_object_or_404(
        UploadedFile, 
        id=file_id, 
        uploaded_by=request.user,
        is_active=True
    )
    
    # Soft delete (mark as inactive)
    file_obj.is_active = False
    file_obj.save()
    
    return Response({
        'success': True,
        'message': 'File deleted successfully.'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def file_detail(request, file_id):
    """
    Get file details
    """
    file_obj = get_object_or_404(UploadedFile, id=file_id, is_active=True)
    serializer = UploadedFileSerializer(file_obj)
    
    return Response({
        'success': True,
        'file': serializer.data
    }, status=status.HTTP_200_OK)