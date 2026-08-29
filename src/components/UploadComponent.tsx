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

            {/* High-Tech Holographic Scanning Laser & HUD Matrix Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] pointer-events-none z-30 overflow-hidden flex items-center justify-center">
                {/* 1. Subtle Holographic Coordinate Grid Overlay */}
                <div 
                  className="absolute inset-0 opacity-15" 
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(45, 212, 191, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(45, 212, 191, 0.4) 1px, transparent 1px)',
                    backgroundSize: '28px 28px'
                  }}
                />

                {/* 2. Primary High-Intensity Emerald Laser Beam */}
                <motion.div 
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_30px_#2DD4BF,0_0_12px_#5EEAD4] z-20"
                  animate={{ y: ['-200px', '220px', '-200px'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 3. Secondary Trailing Cyan Laser Glow */}
                <motion.div 
                  className="absolute left-0 right-0 h-8 bg-gradient-to-b from-[#2DD4BF]/20 via-[#2DD4BF]/5 to-transparent blur-sm z-10"
                  animate={{ y: ['-200px', '220px', '-200px'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 4. Dynamic Scanning Lesion Reticle simulation boxes */}
                <motion.div 
                  className="absolute w-24 h-20 border border-dashed border-[#5EEAD4]/80 rounded-xl bg-[#2DD4BF]/10 shadow-[0_0_20px_rgba(45,212,191,0.4)] flex items-center justify-center z-15"
                  animate={{ 
                    scale: [0.9, 1.08, 0.9],
                    opacity: [0.4, 0.9, 0.4],
                    x: ['-20px', '30px', '-20px'],
                    y: ['-40px', '20px', '-40px']
                  }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-[9px] font-mono text-[#5EEAD4] font-bold bg-black/80 px-1.5 py-0.5 rounded border border-[#2DD4BF]/40">
                    SCAN_TARGET
                  </span>
                </motion.div>

                {/* 5. Precision HUD Corner Brackets */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" />

                {/* 6. Top Telemetry Status Pill */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/90 backdrop-blur-2xl border border-[#2DD4BF]/60 text-[#5EEAD4] text-[11px] font-mono font-bold shadow-[0_0_25px_rgba(45,212,191,0.5)] flex items-center gap-2 z-30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
                  </span>
                  <span>NEURAL FOLIAR SCANNING IN PROGRESS</span>
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
