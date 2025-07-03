import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { FileItem } from '../types';

const OperationsDashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('presentation')) return '📊';
    if (type.includes('wordprocessing')) return '📄';
    if (type.includes('spreadsheet')) return '📈';
    return '📎';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== droppedFiles.length) {
      alert('Only PPTX, DOCX, and XLSX files are allowed!');
    }
    
    setUploadQueue(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Only PPTX, DOCX, and XLSX files are allowed!');
    }
    
    setUploadQueue(prev => [...prev, ...validFiles]);
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (uploadQueue.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload process
    for (const file of uploadQueue) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'operations@example.com',
      };
      
      setFiles(prev => [newFile, ...prev]);
    }
    
    setUploadQueue([]);
    setUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
        <p className="text-gray-600">Upload and manage secure files for client access</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Upload className="h-6 w-6 text-blue-600" />
          <span>File Upload</span>
        </h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="mb-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Only PPTX, DOCX, and XLSX files are allowed
            </p>
          </div>
          
          <input
            type="file"
            multiple
            accept=".pptx,.docx,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
          >
            <Upload className="h-5 w-5" />
            <span>Select Files</span>
          </label>
        </div>

        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Queue</h3>
            <div className="space-y-2 mb-4">
              {uploadQueue.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromQueue(index)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Upload {uploadQueue.length} File{uploadQueue.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <File className="h-6 w-6 text-indigo-600" />
          <span>Uploaded Files ({files.length})</span>
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-8">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{getFileIcon(file.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsDashboard;