from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User
from .utils import generate_verification_token, send_verification_email

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        # Create user with client type by default
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type='client',
            is_email_verified=False
        )
        
        # Generate verification token and send email
        token = generate_verification_token(user)
        user.email_verification_token = token
        user.save()
        
        # Send verification email
        send_verification_email(user, token)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user_type = attrs.get('user_type')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('User account is disabled.')
                
                if user.user_type != user_type:
                    raise serializers.ValidationError('Invalid user type for this account.')
                
                if user.user_type == 'client' and not user.is_email_verified:
                    raise serializers.ValidationError('Please verify your email before logging in.')
                
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include email and password.')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'user_type', 'is_email_verified', 'created_at')
        read_only_fields = ('id', 'created_at')