"use client";

import * as Bytescale from "@bytescale/sdk";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { Trash, Upload } from "lucide-react";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Button } from "@/components/ui/button";
import ImageCropper from "@/components/ImageCropper";

export default function ImageUpload() {
  // Hooks and utility functions
  const searchParams = useSearchParams();
  const [filePath, setFilePath] = useState(searchParams.get("filePath") || "");
  const imageUrl = filePath
    ? Bytescale.UrlBuilder.url({
        accountId: "12a1yek",
        filePath: filePath,
        options: {},
      })
    : "";
  return (
    <>
      <p className="block text-sm font-medium leading-6 text-gray-900">
        Image <span className="text-gray-500">(optional)</span>
      </p>
      {imageUrl && <ImageCropper imageUrl={imageUrl} filePath={filePath} />}
      <div className="p-2"></div>
      <div className="mx-auto flex gap-4">
        <UploadButton
          options={{
            apiKey: "public_12a1yekATNiLj4VVnREZ8c7LM8V8",
            editor: {
              images: {
                crop: true,
                preview: true,
              },
            },
          }}
          onComplete={(files) => {
            if (files.length > 0) {
              setFilePath(files[0].filePath);
            }
          }}
        >
          {({ onClick }) => (
            <Button onClick={onClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          )}
        </UploadButton>
        {imageUrl && (
          <Button variant="destructive" onClick={() => setFilePath("")}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Image
          </Button>
        )}
      </div>
    </>
  );
}
