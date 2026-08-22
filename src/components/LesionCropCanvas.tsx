import React, { useEffect, useRef, useState } from 'react';

interface LesionCropCanvasProps {
  imageUrl: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  label: string;
  className?: string;
}

export const LesionCropCanvas: React.FC<LesionCropCanvasProps> = ({
  imageUrl,
  box_2d,
  label,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const [ymin, xmin, ymax, xmax] = box_2d;
      const scale = Math.max(ymin, xmin, ymax, xmax) > 100 ? 1000 : 100;

      // Calculate actual pixel coordinates in the source image with 10% padding
      const nw = img.naturalWidth || img.width;
      const nh = img.naturalHeight || img.height;

      const normXmin = Math.max(0, (xmin / scale));
      const normYmin = Math.max(0, (ymin / scale));
      const normXmax = Math.min(1, (xmax / scale));
      const normYmax = Math.min(1, (ymax / scale));

      const boxWidth = (normXmax - normXmin) * nw;
      const boxHeight = (normYmax - normYmin) * nh;

      // Add 15% context padding around the lesion
      const padX = boxWidth * 0.15;
      const padY = boxHeight * 0.15;

      const sx = Math.max(0, (normXmin * nw) - padX);
      const sy = Math.max(0, (normYmin * nh) - padY);
      const sWidth = Math.min(nw - sx, boxWidth + padX * 2);
      const sHeight = Math.min(nh - sy, boxHeight + padY * 2);

      canvas.width = 320;
      canvas.height = 200;

      // Draw cropped lesion onto canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

      // Draw subtle reticle crosshair in center
      ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
      ctx.lineWidth = 0.75;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.beginPath();
      // Center box
      ctx.strokeRect(cx - 30, cy - 25, 60, 50);
      ctx.stroke();

      setIsLoaded(true);
    };
  }, [imageUrl, box_2d]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-black/60 border border-white/15 aspect-[16/10] flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />
      {!isLoaded && (
        <div className="text-[11px] text-foreground/50 font-mono animate-pulse">
          Generating lesion crop...
        </div>
      )}
    </div>
  );
};

export default LesionCropCanvas;
