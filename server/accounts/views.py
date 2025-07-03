from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .utils import generate_encrypted_url, decrypt_verification_token

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new client user and return encrypted verification URL
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate encrypted URL for verification
        encrypted_url = generate_encrypted_url(user.email_verification_token)
        
        return Response({
            'success': True,
            'message': 'Registration successful. Please check your email for verification.',
            'encrypted_url': encrypted_url
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Registration failed.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user (both operations and client)
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Login user
        login(request, user)
        
        return Response({
            'success': True,
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Login failed.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request, token):
    """
    Verify user email using encrypted token
    """
    try:
        # Decrypt the token
        decrypted_token = decrypt_verification_token(token)
        
        # Find user with this token
        user = get_object_or_404(User, email_verification_token=decrypted_token)
        
        if user.is_email_verified:
            return Response({
                'success': True,
                'message': 'Email already verified.'
            }, status=status.HTTP_200_OK)
        
        # Verify the user
        user.is_email_verified = True
        user.email_verification_token = None
        user.save()
        
        return Response({
            'success': True,
            'message': 'Email verified successfully. You can now login.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Invalid or expired verification token.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    """
    Logout user and delete token
    """
    try:
        request.user.auth_token.delete()
        return Response({
            'success': True,
            'message': 'Logout successful.'
        }, status=status.HTTP_200_OK)
    except:
        return Response({
            'success': False,
            'message': 'Logout failed.'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_profile(request):
    """
    Get current user profile
    """
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'user': serializer.data
    }, status=status.HTTP_200_OK)