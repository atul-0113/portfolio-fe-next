import React, { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  fileUrl?: string | null; // Optional file URL (for editing case)
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, fileUrl = null }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(fileUrl || null); // Use fileUrl if provided
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Effect to handle initial file URL (for editing)
  useEffect(() => {
    if (fileUrl) {
      setPreviewUrl(fileUrl); // Set the preview URL if provided for editing case
    }
  }, [fileUrl]);

  // Handle file selection (new file selection or drag & drop)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
    onFileChange(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // Show the new file preview
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // Reset preview if no file selected
    }
  };

  // Handle drag & drop file selection
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file || null);
    onFileChange(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string); // Show the new file preview
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // Reset preview if no file selected
    }
  }, [onFileChange]);

  // Handle drag over event
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // Handle browse button click to open file input dialog
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleBrowseClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      {previewUrl ? (
        <img crossOrigin="anonymous" src={previewUrl} alt="Preview" className="max-w-full max-h-48 mb-4 rounded-lg" />
      ) : (
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
      )}
      {!previewUrl && <p className="text-gray-600">
        Drag files here or <span className="text-blue-500">browse</span>
      </p>}
      {selectedFile && (
        <p className="mt-4 text-sm text-gray-500">
          Selected file: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
