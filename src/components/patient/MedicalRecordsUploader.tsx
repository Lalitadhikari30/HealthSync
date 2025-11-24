import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabaseWithToken, STORAGE_BUCKET } from '../../lib/supabase';

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface MedicalRecordsUploaderProps {
  onUploadComplete?: (uploadedFiles: UploadedFile[]) => void;
}

export const MedicalRecordsUploader: React.FC<MedicalRecordsUploaderProps> = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user?.uid) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Get Supabase client with Firebase token
      const supabase = await getSupabaseWithToken();
      const newFiles: UploadedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${user.uid}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
        
        // Validate file type
        const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
        if (!fileExt || !validTypes.includes(fileExt)) {
          throw new Error(`Invalid file type: ${fileExt}. Allowed types: ${validTypes.join(', ')}`);
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }

        // Upload file with custom metadata
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);
          
        newFiles.push({
          name: file.name,
          url: publicUrl,
          type: file.type,
          size: file.size,
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUploadComplete?.(newFiles);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Medical Records</h2>
        <p className="text-sm text-gray-500">
          Upload your medical reports, test results, or any other health-related documents.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-blue-50 rounded-full">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none"
            >
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, JPG, PNG up to 10MB
            </p>
          </div>
        </div>
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {uploadProgress}% Complete
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
