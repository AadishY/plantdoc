
import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UploadComponentProps {
  onImageSelect: (file: File) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onImageSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {!previewUrl ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors
            ${dragActive ? 'border-plantDoc-primary bg-plantDoc-light' : 'border-gray-300 hover:border-plantDoc-primary'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">Drag and drop an image here, or click to select</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
            <Button 
              type="button" 
              className="mt-2 bg-plantDoc-primary hover:bg-plantDoc-secondary"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              Upload Plant Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain max-h-[400px]" 
          />
          <Button 
            variant="destructive"
            onClick={removeImage}
            className="absolute top-2 right-2"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
