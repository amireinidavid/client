"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  maxFiles?: number;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value = [],
  maxFiles = 10,
  accept = "image/*",
}) => {
  const [files, setFiles] = useState<File[]>(value);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files];
      acceptedFiles.forEach((file) => {
        if (newFiles.length < maxFiles) {
          newFiles.push(file);
        }
      });
      setFiles(newFiles);
      onChange(newFiles);
    },
    [files, maxFiles, onChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [accept]: [],
    },
    maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-gray-400 transition"
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here...</p>
          ) : (
            <div>
              <p>Drag & drop images here, or click to select files</p>
              <p className="text-sm text-gray-500 mt-1">
                (Max {maxFiles} files, {accept} only)
              </p>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="relative group">
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-square">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
