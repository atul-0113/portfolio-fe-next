// components/FileUpload.tsx
import React, { useState, useCallback, useRef, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Add preview URL state
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
    onFileChange(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file || null);
    onFileChange(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, [onFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

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
        <img src={previewUrl} alt="Preview" className="max-w-full max-h-48 mb-4 rounded-lg" />
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