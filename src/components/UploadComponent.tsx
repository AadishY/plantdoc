import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

export interface UploadComponentProps {
  onFileUpload: (file: File, preview: string) => void;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        setPreview(preview);
        onFileUpload(file, preview);
      };

      reader.readAsDataURL(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
    maxFiles: 1,
  });

  const handleRemove = () => {
    setFile(null);
    setPreview("");
    onFileUpload(null as any, ""); // Passing null to clear the image
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
      {preview ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="aspect-w-16 aspect-h-9 w-full rounded-md overflow-hidden">
            <img src={preview} alt="Uploaded" className="object-cover" />
          </div>
          <Button variant="destructive" size="sm" onClick={handleRemove}>
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      ) : (
        <div {...getRootProps()} className="flex flex-col items-center space-y-4 cursor-pointer">
          <input {...getInputProps()} />
          <Cloud className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the image here..."
              : "Drag 'n' drop an image here, or click to select files"}
          </p>
          <p className="text-xs text-muted-foreground">Only *.jpeg, *.jpg and *.png images will be accepted</p>
          <Button variant="secondary" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
