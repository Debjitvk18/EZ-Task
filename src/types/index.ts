export interface User {
  id: string;
  email: string;
  type: 'operations' | 'client';
  verified?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface DownloadResponse {
  downloadLink: string;
  message: string;
}