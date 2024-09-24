import React, { useState } from 'react';

const FileValidation = ({ handleFileUpload, maxImageSizeMB = 5, maxVideoSizeMB = 50 }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
    'video/mp4', 'video/webm', 'video/avi', 'video/quicktime'
  ];

  const validateFile = (file) => {
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload a valid image or video.');
      return false;
    }

    // Check file size
    const maxFileSizeBytes = fileType === 'image' ? maxImageSizeMB * 1024 * 1024 : maxVideoSizeMB * 1024 * 1024;
    if (file.size > maxFileSizeBytes) {
      const maxSize = fileType === 'image' ? maxImageSizeMB : maxVideoSizeMB;
      setErrorMessage(`File size too large. Max allowed size for ${fileType}s is ${maxSize} MB.`);
      return false;
    }

    // Clear error if valid
    setErrorMessage('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      handleFileUpload(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default FileValidation;
