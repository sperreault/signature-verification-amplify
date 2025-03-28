import { useState } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Flex, Heading, Text, View } from '@aws-amplify/ui-react';

interface FileUploadProps {
  title?: string;
  onSuccess?: (key: string) => void;
  onError?: (error: Error) => void;
}

export function FileUpload({ 
  title = 'File Upload', 
  onSuccess, 
  onError 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setUploadedFileKey(null);
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Generate a unique file key
      const fileKey = `uploads/${Date.now()}-${file.name}`;
      
      // Upload the file to S3
      await Storage.put(fileKey, file, {
        progressCallback(progress) {
          const percentUploaded = Math.round((progress.loaded / progress.total) * 100);
          setProgress(percentUploaded);
        },
      });

      setUploadedFileKey(fileKey);
      setUploading(false);
      
      if (onSuccess) {
        onSuccess(fileKey);
      }
    } catch (err) {
      setUploading(false);
      const error = err as Error;
      setError(`Upload failed: ${error.message}`);
      
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <View padding="1rem" backgroundColor="var(--amplify-colors-background-secondary)">
      <Heading level={3}>{title}</Heading>
      
      <Flex direction="column" gap="1rem">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ marginBottom: '1rem' }}
        />
        
        <Button
          variation="primary"
          onClick={uploadFile}
          isLoading={uploading}
          loadingText={`Uploading... ${progress}%`}
          isDisabled={!file || uploading}
        >
          Upload File
        </Button>
        
        {error && (
          <Text color="var(--amplify-colors-red-80)">{error}</Text>
        )}
        
        {uploadedFileKey && (
          <Text color="var(--amplify-colors-green-80)">
            File uploaded successfully! Key: {uploadedFileKey}
          </Text>
        )}
        
        {uploading && (
          <View>
            <Text>Upload progress: {progress}%</Text>
            <div 
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'var(--amplify-colors-background-tertiary)',
                borderRadius: '5px',
                overflow: 'hidden',
                marginTop: '0.5rem'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--amplify-colors-brand-primary)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </View>
        )}
      </Flex>
    </View>
  );
}
