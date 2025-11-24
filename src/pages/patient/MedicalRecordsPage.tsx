import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploader from '@/components/medical/FileUploader';
import MedicalRecordsList from '@/components/medical/MedicalRecordsList';

export default function MedicalRecordsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Increment the key to force a re-render of the MedicalRecordsList
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">
            Upload and manage your medical records securely
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload New Record</CardTitle>
            <CardDescription>
              Upload your medical documents securely. Supported formats: PDF, DOC, JPG, PNG (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Medical Records</CardTitle>
            <CardDescription>
              View and manage your uploaded medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicalRecordsList key={refreshKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
