"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadPreviewProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}

export function ImageUploadPreview({
  selectedFiles,
  setSelectedFiles,
}: ImageUploadPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    fileInputRef.current?.click();
  };

  // Add files to form data when submitting
  const getFormFiles = () => {
    return selectedFiles;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload up to 10 images. First image will be the cover.
          </p>
        </div>
        <Button
          type="button" // Important: Set type to button
          variant="outline"
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          id="image-upload"
          name="images" // Important: Add name attribute
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-lg overflow-hidden border"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button" // Important: Set type to button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {selectedFiles.length === 0 && (
          <div className="aspect-square rounded-lg border border-dashed flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No images uploaded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
