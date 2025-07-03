import secrets
import base64
import json
from cryptography.fernet import Fernet
from django.conf import settings

def generate_secure_download_token(file_obj, user):
    """Generate encrypted download token"""
    try:
        # Create Fernet instance with the encryption key
        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        fernet = Fernet(key)
        
        # Create token data
        token_data = {
            'file_id': str(file_obj.id),
            'user_id': str(user.id),
            'timestamp': str(secrets.randbits(64))  # Add randomness
        }
        
        # Convert to JSON and encrypt
        json_data = json.dumps(token_data)
        encrypted_token = fernet.encrypt(json_data.encode())
        
        # Encode to base64 for URL safety
        url_safe_token = base64.urlsafe_b64encode(encrypted_token).decode()
        
        return url_safe_token
    except Exception as e:
        print(f"Token generation error: {e}")
        return None

def decrypt_download_token(encrypted_token):
    """Decrypt download token and return file_id and user_id"""
    try:
        # Create Fernet instance with the encryption key
        key = base64.urlsafe_b64encode(settings.ENCRYPTION_KEY.encode()[:32].ljust(32, b'0'))
        fernet = Fernet(key)
        
        # Decode from base64
        encrypted_data = base64.urlsafe_b64decode(encrypted_token.encode())
        
        # Decrypt the token
        decrypted_data = fernet.decrypt(encrypted_data).decode()
        
        # Parse JSON
        token_data = json.loads(decrypted_data)
        
        return token_data['file_id'], token_data['user_id']
    except Exception as e:
        print(f"Token decryption error: {e}")
        raise ValueError("Invalid token")