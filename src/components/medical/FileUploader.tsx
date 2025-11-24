import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadMedicalRecord, getMedicalRecords } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X } from 'lucide-react';

export default function FileUploader({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadMedicalRecord(file, user.uid, (progress) => {
        setProgress(progress);
      });

      if (result.error) {
        throw result.error;
      }

      setProgress(100);
      onUploadSuccess?.();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                disabled={isUploading}
                accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, JPG, PNG up to 10MB
          </p>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
