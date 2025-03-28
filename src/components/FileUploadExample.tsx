import { FileUpload } from './FileUpload';
import { View, Heading, Divider } from '@aws-amplify/ui-react';

export function FileUploadExample() {
  const handleUploadSuccess = (key: string) => {
    console.log('File uploaded successfully with key:', key);
    // You can do additional operations here, like saving the reference to a database
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    // Handle errors appropriately
  };

  return (
    <View padding="2rem">
      <Heading level={2}>File Upload Demo</Heading>
      <Divider marginBottom="1rem" />
      
      <FileUpload 
        title="Upload Document" 
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
      
      <View marginTop="2rem">
        <Heading level={5}>Usage Notes:</Heading>
        <ul>
          <li>Files are stored in the S3 bucket configured with Amplify</li>
          <li>Maximum file size depends on your S3 configuration</li>
          <li>Supported file types: any (no restrictions in this component)</li>
        </ul>
      </View>
    </View>
  );
}
