import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon, Loader2, Sparkles, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface UploadComponentProps {
  onImageSelect?: (file: File) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop?: (acceptedFiles: File[]) => void;
  previewUrl?: string | null;
  isLoading?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ 
  onImageSelect, 
  onImageChange, 
  onDrop,
  previewUrl: externalPreviewUrl,
  isLoading = false,
  fileInputRef: externalFileInputRef,
  className = ""
}) => {
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const previewUrl = externalPreviewUrl !== undefined ? externalPreviewUrl : internalPreviewUrl;
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onImageChange) {
      onImageChange(e);
      return;
    }
    
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 15MB",
        variant: "destructive"
      });
      return;
    }

    if (externalPreviewUrl === undefined) {
      setInternalPreviewUrl(URL.createObjectURL(file));
    }
    
    if (onImageSelect) {
      onImageSelect(file);
    }
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
    if (onDrop && e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      onDrop(filesArray);
      return;
    }
    
    handleFile(file);
  };

  const removeImage = () => {
    if (externalPreviewUrl === undefined) {
      setInternalPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {!previewUrl ? (
        <div 
          className={`glass-card transition-all duration-300 border-2 border-dashed rounded-3xl p-10 md:p-14 text-center overflow-hidden cursor-pointer
            ${dragActive ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 scale-[1.01]' : 'hover:border-[#2DD4BF]/60 border-white/20 hover:shadow-[0_0_30px_rgba(45,212,191,0.25)]'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center gap-4 animate-enter">
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-[#2DD4BF]/20 flex items-center justify-center border border-[#2DD4BF]/40 shadow-[0_0_25px_rgba(45,212,191,0.35)]"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <ImageIcon className="h-10 w-10 text-[#2DD4BF]" />
            </motion.div>
            <div>
              <p className="font-bold text-lg sm:text-xl text-white">Drag & drop your plant photo here, or click to browse</p>
              <p className="text-xs text-foreground/70 mt-1">Supports high-res JPG, PNG, WEBP up to 15MB</p>
            </div>
            <Button 
              type="button" 
              className="mt-2 bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-8 py-5 rounded-full shadow-[0_0_25px_rgba(45,212,191,0.45)] transition-all hover:scale-105 border border-[#5EEAD4]/50"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
              disabled={isLoading}
            >
              <Camera className="mr-2 h-4 w-4" />
              Select Plant Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative">
          <div className="relative min-h-[350px] max-h-[460px] bg-black/60 flex items-center justify-center overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Plant Preview" 
              className="w-full h-full object-contain max-h-[460px] transition-all rounded-2xl" 
            />

            {/* Scanning Laser Animation during diagnosis */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-30">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div 
                    className="w-full h-1 bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_20px_#2DD4BF]"
                    animate={{ y: [0, 400, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <div className="glass-card-intense p-6 rounded-3xl border border-[#2DD4BF]/40 shadow-[0_0_35px_rgba(45,212,191,0.3)] flex flex-col items-center gap-3 text-center z-40 max-w-xs bg-black/80 backdrop-blur-2xl">
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-[#2DD4BF] animate-spin" />
                    <Scan className="h-5 w-5 text-white absolute inset-0 m-auto" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Analyzing Specimen</h4>
                    <p className="text-xs text-foreground/70 mt-1">
                      PlantDoc AI is localizing individual foliar lesions & damaged zones...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && (
              <Button 
                variant="destructive"
                onClick={removeImage}
                className="absolute top-3 right-3 rounded-full shadow-xl bg-red-600 hover:bg-red-700 h-9 w-9 p-0"
                size="icon"
                disabled={isLoading}
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
