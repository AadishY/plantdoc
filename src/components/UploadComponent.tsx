
import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';
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
          className={`glass-card transition-all duration-300 border-dashed rounded-xl p-10 text-center overflow-hidden
            ${dragActive ? 'border-plantDoc-primary bg-plantDoc-primary/10 scale-[1.02]' : 'hover:border-plantDoc-primary/50 hover-scale'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center gap-4 cursor-pointer animate-enter">
            <div className="w-16 h-16 rounded-full bg-plantDoc-primary/20 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-plantDoc-primary" />
            </div>
            <div>
              <p className="font-medium">Drag and drop an image here, or click to select</p>
              <p className="text-sm text-foreground/60 mt-1">PNG, JPG up to 10MB</p>
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
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain max-h-[400px]" 
            />
            <Button 
              variant="destructive"
              onClick={removeImage}
              className="absolute top-3 right-3 rounded-full shadow-lg"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
