# Secure File Sharing System - Django Backend

A secure file-sharing system built with Django REST Framework that allows operations users to upload files and client users to securely download them.

## Features

- **User Authentication**: Separate login for Operations and Client users
- **Email Verification**: Client users must verify their email before accessing files
- **Secure File Upload**: Only Operations users can upload PPTX, DOCX, and XLSX files
- **Encrypted Download Links**: Client users get secure, encrypted download URLs
- **Access Control**: Download links are user-specific and expire after use
- **File Type Validation**: Only specific file types are allowed
- **File Size Limits**: Maximum 50MB per file

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new client user
- `POST /api/auth/login/` - Login (operations/client)
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/verify/<token>/` - Verify email
- `GET /api/auth/profile/` - Get user profile

### File Management
- `POST /api/files/upload/` - Upload file (operations only)
- `GET /api/files/list/` - List all files
- `POST /api/files/download/<file_id>/` - Generate download link (client only)
- `GET /api/files/secure-download/<token>/` - Download file (client only)
- `DELETE /api/files/delete/<file_id>/` - Delete file (operations only)
- `GET /api/files/detail/<file_id>/` - Get file details

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

## Security Features

- **Encrypted URLs**: All verification and download URLs are encrypted
- **User-Specific Access**: Download links are tied to specific users
- **Token Expiration**: Download links expire after 24 hours
- **File Type Validation**: Only allowed file types can be uploaded
- **Access Control**: Strict separation between operations and client users
- **CORS Protection**: Configured for frontend integration

## File Upload Restrictions

- **Allowed Types**: .pptx, .docx, .xlsx only
- **Size Limit**: 50MB maximum
- **User Restriction**: Only Operations users can upload

## Download Security

- **Encrypted Tokens**: Download URLs use encrypted tokens
- **User Verification**: Links only work for the intended user
- **Single Use**: Links are marked as used after download (configurable)
- **Expiration**: Links expire after 24 hours
- **Access Logging**: All download attempts are logged

## Production Deployment

1. Set `DEBUG=False` in settings
2. Configure proper database (PostgreSQL recommended)
3. Set up Redis for Celery (background tasks)
4. Configure email backend for production
5. Set up proper static file serving
6. Use environment variables for sensitive data