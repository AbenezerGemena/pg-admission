import { useState, useRef } from "react";
import { Upload, File, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: 'transcript' | 'certificate' | 'photo';
  file: File;
  size: number;
  uploadDate: string;
}

interface DocumentUploadProps {
  onFileUpload?: (files: UploadedFile[]) => void;
}

export function DocumentUpload({ onFileUpload }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { type: 'transcript' as const, label: 'Academic Transcripts', required: true },
    { type: 'certificate' as const, label: 'Degree Certificates', required: true },
    { type: 'photo' as const, label: 'Passport Photo', required: true }
  ];

  const validateFile = (file: File, type: string): string | null => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    // Check file format
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed";
    }

    // Photo specific validation
    if (type === 'photo' && !file.type.startsWith('image/')) {
      return "Passport photo must be an image file (JPG or PNG)";
    }

    return null;
  };

  const handleFileUpload = async (files: FileList, type: 'transcript' | 'certificate' | 'photo') => {
    if (!files.length) return;

    const file = files[0];
    const validationError = validateFile(file, type);

    if (validationError) {
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate upload delay
    setTimeout(() => {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type,
        file,
        size: file.size,
        uploadDate: new Date().toLocaleDateString()
      };

      setUploadedFiles(prev => [...prev.filter(f => f.type !== type), newFile]);
      setUploading(false);
      setUploadProgress(100);
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`
      });

      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
      
      onFileUpload?.(uploadedFiles);
    }, 1000);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed successfully."
    });
  };

  const handleViewFile = (file: UploadedFile) => {
    const url = URL.createObjectURL(file.file);
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilesByType = (type: 'transcript' | 'certificate' | 'photo') => {
    return uploadedFiles.filter(f => f.type === type);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload required documents. Maximum file size: 5MB. Supported formats: PDF, JPG, PNG
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="space-y-6">
            {documentTypes.map((docType) => {
              const files = getFilesByType(docType.type);
              const hasFile = files.length > 0;

              return (
                <div key={docType.type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{docType.label}</h3>
                        {docType.required && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                      {hasFile ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = docType.type === 'photo' ? 'image/*' : '.pdf,image/*';
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) handleFileUpload(files, docType.type);
                        };
                        input.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {hasFile ? 'Replace' : 'Upload'}
                    </Button>
                  </div>

                  {hasFile ? (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-muted/50 rounded-md p-3">
                          <div className="flex items-center gap-3">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)} • Uploaded on {file.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {docType.type === 'photo' 
                          ? 'Upload passport-size photo (JPG, PNG)' 
                          : 'Upload documents (PDF, JPG, PNG)'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}