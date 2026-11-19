import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface ImageDropzoneProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const MAX_WIDTH = 1280;
const QUALITY = 0.8;
const MAX_BYTES = 300 * 1024; // 300KB

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  value,
  onChange,
  label = 'Image',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    setIsProcessing(true);

    try {
      const dataUrl = await resizeAndEncodeImage(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const resizeAndEncodeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP first, fallback to JPEG
          let format = 'image/webp';
          let quality = QUALITY;
          let resultDataUrl = canvas.toDataURL(format, quality);

          // Check if browser actually produced WebP
          if (!resultDataUrl.startsWith('data:image/webp')) {
            format = 'image/jpeg';
            resultDataUrl = canvas.toDataURL(format, quality);
          }

          const getByteLength = (dataUrl: string) => {
            const base64 = dataUrl.split(',')[1] || '';
            const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
            return Math.floor((base64.length * 3) / 4) - padding;
          };

          let bytes = getByteLength(resultDataUrl);

          // If over 300KB, try reducing quality
          if (bytes > MAX_BYTES) {
            quality = 0.6;
            resultDataUrl = canvas.toDataURL(format, quality);
            bytes = getByteLength(resultDataUrl);
          }

          if (bytes > MAX_BYTES) {
            quality = 0.4;
            resultDataUrl = canvas.toDataURL(format, quality);
            bytes = getByteLength(resultDataUrl);
          }

          if (bytes > MAX_BYTES) {
            reject(
              new Error(
                `Image is too large (${Math.round(bytes / 1024)}KB). Maximum allowed size is 300KB.`
              )
            );
            return;
          }

          resolve(resultDataUrl);
        };

        img.onerror = () => reject(new Error('Invalid image file.'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-md border border-gold/30 bg-navy/80 p-2 text-center">
          <img
            src={value}
            alt="Uploaded Preview"
            className="mx-auto max-h-48 rounded object-contain"
          />
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs uppercase tracking-wider text-gold hover:underline"
            >
              Change Image
            </button>
            <span className="text-gold/40">|</span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs uppercase tracking-wider text-red-400 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? 'border-gold bg-gold/10'
              : 'border-gold/30 bg-navy/40 hover:border-gold/60'
          }`}
        >
          {isProcessing ? (
            <p className="text-sm text-gold animate-pulse">Processing and compressing image...</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-gold">
                Drag and drop image here, or <span className="underline">browse</span>
              </p>
              <p className="mt-1 text-xs text-gold/60">
                PNG, JPEG, WebP (auto-resized to max 1280px, WebP ≤ 300KB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
