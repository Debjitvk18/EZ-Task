import React, { useState, useEffect } from 'react';
import { Download, File, Shield, Copy, Check, ExternalLink } from 'lucide-react';
import { FileItem, DownloadResponse } from '../types';

const ClientDashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadLinks, setDownloadLinks] = useState<Record<string, string>>({});
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulate fetching files from API
    const fetchFiles = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'Q4 Financial Report.pptx',
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          size: 2457600,
          uploadedAt: '2024-01-15T10:30:00Z',
          uploadedBy: 'operations@example.com'
        },
        {
          id: '2',
          name: 'Project Proposal.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1234567,
          uploadedAt: '2024-01-14T15:45:00Z',
          uploadedBy: 'operations@example.com'
        },
        {
          id: '3',
          name: 'Budget Analysis.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 987654,
          uploadedAt: '2024-01-13T09:15:00Z',
          uploadedBy: 'operations@example.com'
        },
      ];
      
      setFiles(mockFiles);
      setLoading(false);
    };
    
    fetchFiles();
  }, []);

  const getFileIcon = (type: string) => {
    if (type.includes('presentation')) return '📊';
    if (type.includes('wordprocessing')) return '📄';
    if (type.includes('spreadsheet')) return '📈';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateDownloadLink = async (fileId: string) => {
    // Simulate API call to get encrypted download link
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response: DownloadResponse = {
      downloadLink: `https://secure-download.example.com/download/${btoa(fileId + Date.now())}-${Math.random().toString(36).substr(2, 20)}`,
      message: 'success'
    };
    
    setDownloadLinks(prev => ({
      ...prev,
      [fileId]: response.downloadLink
    }));
    
    return response.downloadLink;
  };

  const handleDownload = async (fileId: string) => {
    if (!downloadLinks[fileId]) {
      await generateDownloadLink(fileId);
    }
    
    // In a real application, this would trigger the download
    window.open(downloadLinks[fileId], '_blank');
  };

  const copyToClipboard = async (fileId: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinks(prev => ({ ...prev, [fileId]: true }));
      setTimeout(() => {
        setCopiedLinks(prev => ({ ...prev, [fileId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
        <p className="text-gray-600">Access and download your secure files</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Files</p>
              <p className="text-3xl font-bold">{files.length}</p>
            </div>
            <File className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Downloads Generated</p>
              <p className="text-3xl font-bold">{Object.keys(downloadLinks).length}</p>
            </div>
            <Download className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Secure Access</p>
              <p className="text-3xl font-bold">100%</p>
            </div>
            <Shield className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <File className="h-6 w-6 text-blue-600" />
          <span>Available Files</span>
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-8">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No files available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{getFileIcon(file.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    
                    {downloadLinks[file.id] && (
                      <button
                        onClick={() => copyToClipboard(file.id, downloadLinks[file.id])}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                      >
                        {copiedLinks[file.id] ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                {downloadLinks[file.id] && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Encrypted Download Link</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs break-all text-blue-700 flex items-center justify-between">
                      <span className="flex-1 mr-2">{downloadLinks[file.id]}</span>
                      <button
                        onClick={() => window.open(downloadLinks[file.id], '_blank')}
                        className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      This secure link is unique to your session and expires after use.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;