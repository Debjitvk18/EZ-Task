import { User, FileItem, DownloadResponse, ApiResponse } from '../types';

// Mock API service - Replace with actual Django backend calls
class ApiService {
  private baseUrl = '/api'; // This would be your Django backend URL
  private mockFiles: FileItem[] = [
    {
      id: '1',
      name: 'Project Presentation.pptx',
      size: 2048576,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadedAt: '2024-01-15T10:30:00Z',
      uploadedBy: 'ops@company.com'
    },
    {
      id: '2',
      name: 'Financial Report Q4.xlsx',
      size: 1536000,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: '2024-01-14T14:20:00Z',
      uploadedBy: 'ops@company.com'
    },
    {
      id: '3',
      name: 'Technical Documentation.docx',
      size: 3072000,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: '2024-01-13T09:15:00Z',
      uploadedBy: 'ops@company.com'
    }
  ];

  // Simulate network delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string, userType: 'ops' | 'client'): Promise<ApiResponse<User>> {
    await this.delay(1000);
    
    // Mock validation
    if (email && password) {
      const user: User = {
        id: Date.now().toString(),
        email,
        userType,
        isEmailVerified: userType === 'ops' ? true : Math.random() > 0.5
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', `mock_token_${Date.now()}`);
      
      return {
        success: true,
        data: user,
        message: 'Login successful'
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }

  async signUp(email: string, password: string): Promise<ApiResponse<{ encryptedUrl: string }>> {
    await this.delay(1500);
    
    // Mock encrypted URL generation
    const encryptedUrl = `${window.location.origin}/verify/${btoa(email + Date.now())}`;
    
    return {
      success: true,
      data: { encryptedUrl },
      message: 'Registration successful. Please check your email for verification.'
    };
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    await this.delay(1000);
    
    return {
      success: true,
      message: 'Email verified successfully'
    };
  }

  async uploadFile(file: File): Promise<ApiResponse<FileItem>> {
    await this.delay(2000);
    
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Only pptx, docx, and xlsx files are allowed'
      };
    }
    
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: JSON.parse(localStorage.getItem('user') || '{}').email || 'unknown'
    };
    
    this.mockFiles.unshift(newFile);
    
    return {
      success: true,
      data: newFile,
      message: 'File uploaded successfully'
    };
  }

  async getFiles(): Promise<ApiResponse<FileItem[]>> {
    await this.delay(800);
    
    return {
      success: true,
      data: this.mockFiles,
      message: 'Files retrieved successfully'
    };
  }

  async downloadFile(fileId: string): Promise<ApiResponse<DownloadResponse>> {
    await this.delay(1000);
    
    const file = this.mockFiles.find(f => f.id === fileId);
    if (!file) {
      return {
        success: false,
        message: 'File not found'
      };
    }
    
    // Generate encrypted download URL
    const encryptedId = btoa(`${fileId}_${Date.now()}_${Math.random()}`);
    const downloadLink = `${window.location.origin}/api/secure-download/${encryptedId}`;
    
    return {
      success: true,
      data: {
        downloadLink,
        message: 'Download link generated successfully'
      },
      message: 'success'
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const apiService = new ApiService();