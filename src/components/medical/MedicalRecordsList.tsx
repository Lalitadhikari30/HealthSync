import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMedicalRecords, deleteMedicalRecord } from '@/lib/storage';
import { FileText, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MedicalRecordsList() {
  const { user } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await getMedicalRecords(user.uid);
      if (fetchError) throw fetchError;
      setFiles(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user?.uid]);

  const handleDelete = async (filePath: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const { error: deleteError } = await deleteMedicalRecord(filePath);
      if (deleteError) throw deleteError;
      
      // Refresh the list after deletion
      fetchRecords();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete record');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="text-center py-4">Loading records...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (files.length === 0) {
    return <div className="text-center py-4 text-gray-500">No medical records found.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Medical Records</h3>
      <div className="border rounded-lg divide-y">
        {files.map((file) => (
          <div key={file.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.metadata?.size || 0)} • 
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700"
                download
              >
                <Download className="h-5 w-5" />
              </a>
              <button
                onClick={() => handleDelete(file.name)}
                className="p-2 text-red-500 hover:text-red-700"
                aria-label="Delete record"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
