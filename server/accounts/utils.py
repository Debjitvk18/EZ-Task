import secrets
import base64
from cryptography.fernet import Fernet
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def generate_verification_token(user):
    """Generate a secure verification token"""
    return secrets.token_urlsafe(32)

def generate_encrypted_url(token):
    """Generate encrypted URL for email verification"""
    try:
        # Create Fernet instance with the encryption key
        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        fernet = Fernet(key)
        
        # Encrypt the token
        encrypted_token = fernet.encrypt(token.encode())
        
        # Encode to base64 for URL safety
        url_safe_token = base64.urlsafe_b64encode(encrypted_token).decode()
        
        # Generate the full URL
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        encrypted_url = f"{base_url}/verify/{url_safe_token}"
        
        return encrypted_url
    except Exception as e:
        print(f"Encryption error: {e}")
        return None

def decrypt_verification_token(encrypted_token):
    """Decrypt verification token from URL"""
    try:
        # Create Fernet instance with the encryption key
        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        fernet = Fernet(key)
        
        # Decode from base64
        encrypted_data = base64.urlsafe_b64decode(encrypted_token.encode())
        
        # Decrypt the token
        decrypted_token = fernet.decrypt(encrypted_data).decode()
        
        return decrypted_token
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

def send_verification_email(user, token):
    """Send verification email to user"""
    try:
        encrypted_url = generate_encrypted_url(token)
        
        subject = 'Verify Your Email - SecureShare'
        
        # Create email content
        context = {
            'user': user,
            'verification_url': encrypted_url,
        }
        
        html_message = f"""
        <html>
        <body>
            <h2>Welcome to SecureShare!</h2>
            <p>Hello {user.email},</p>
            <p>Thank you for registering with SecureShare. Please click the link below to verify your email address:</p>
            <p><a href="{encrypted_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>Or copy and paste this encrypted URL into your browser:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">{encrypted_url}</p>
            <p>This link is secure and encrypted for your protection.</p>
            <p>Best regards,<br>SecureShare Team</p>
        </body>
        </html>
        """
        
        plain_message = f"""
        Welcome to SecureShare!
        
        Hello {user.email},
        
        Thank you for registering with SecureShare. Please visit the following encrypted URL to verify your email address:
        
        {encrypted_url}
        
        This link is secure and encrypted for your protection.
        
        Best regards,
        SecureShare Team
        """
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False