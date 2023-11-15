/* eslint-disable @next/next/no-img-element */
"use client";

import * as Bytescale from "@bytescale/sdk";
import { useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { SwitchCamera, Trash, Upload, Scissors } from "lucide-react";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Dialog } from "@headlessui/react";
import { ReactCrop, Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ImageUpload({
  savedFilePath,
}: {
  savedFilePath?: string;
}) {
  const searchParams = useSearchParams();
  const [filePath, setFilePath] = useState(
    searchParams.get("filePath") || savedFilePath || ""
  );
  const [imageUrl, setImageUrl] = useState(() => {
    return filePath
      ? Bytescale.UrlBuilder.url({
          accountId: "12a1yek",
          filePath: filePath,
          options: {},
        })
      : "";
  });

  const { croppedImagesUrls, setCroppedImagesUrls } = useCroppedImageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const fullImageRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  const onCropComplete = (crop: Crop, percentageCrop: Crop) => {
    if (
      imageUrl &&
      fullImageRef.current &&
      fullImageRef.current.naturalWidth > 0
    ) {
      makeCropUrls(percentageCrop);
    }
  };

  const onCropChange = (newCrop: Crop, newPercentageCrop: Crop) => {
    setCrop(newPercentageCrop);
  };

  const croppedImagesMatchFilePath = Object.values(croppedImagesUrls).some(
    (url) => url.includes(filePath)
  );
  const showCroppedImage =
    croppedImagesMatchFilePath && croppedImagesUrls?.cropped;

  const makeCropUrls = useCallback(
    (crop: Crop) => {
      const getCroppedImgUrl = (
        image: HTMLImageElement,
        crop: Crop,
        targetAspect: number
      ): string => {
        // Convert crop percentages to pixels
        let pxCrop = {
          x: Math.round(image.naturalWidth * (crop.x / 100)),
          y: Math.round(image.naturalHeight * (crop.y / 100)),
          width: Math.round(image.naturalWidth * (crop.width / 100)),
          height: Math.round(image.naturalHeight * (crop.height / 100)),
        };

        // Calculate current aspect ratio
        const currentAspect = pxCrop.width / pxCrop.height;

        // Adjust dimensions to match the target aspect ratio
        if (currentAspect < targetAspect) {
          // If the crop is too tall for the width, adjust height down
          const newHeight = pxCrop.width / targetAspect;
          pxCrop.y += (pxCrop.height - newHeight) / 2; // Keep it centered vertically
          pxCrop.height = newHeight;
        } else if (currentAspect > targetAspect) {
          // If the crop is too wide for the height, adjust width down
          const newWidth = pxCrop.height * targetAspect;
          pxCrop.x += (pxCrop.width - newWidth) / 2; // Keep it centered horizontally
          pxCrop.width = newWidth;
        }

        // Make sure to round the values after adjustments
        pxCrop.x = Math.round(pxCrop.x);
        pxCrop.y = Math.round(pxCrop.y);
        pxCrop.width = Math.round(pxCrop.width);
        pxCrop.height = Math.round(pxCrop.height);

        // Construct the URL for the Image Cropping API
        const croppedImageUrl = Bytescale.UrlBuilder.url({
          accountId: "12a1yek",
          filePath: filePath, // Ensure filePath is defined and contains the path to the image
          options: {
            transformation: "image",
            transformationParams: {
              "crop-x": pxCrop.x,
              "crop-y": pxCrop.y,
              "crop-w": pxCrop.width,
              "crop-h": pxCrop.height,
            },
          },
        });

        return croppedImageUrl;
      };

      if (
        fullImageRef.current?.naturalWidth &&
        fullImageRef.current?.naturalWidth > 0 &&
        crop.width &&
        crop.height
      ) {
        const aspectRatios = {
          square: 1,
          fourThree: 4 / 3,
          sixteenNine: 16 / 9,
        };

        const aspectRatioWithOriginalAndCropped = {
          ...aspectRatios,
          cropped: crop.width / crop.height,
          original:
            fullImageRef.current.naturalWidth /
            fullImageRef.current.naturalHeight,
        };

        let newCroppedImages = {} as { [key: string]: string };
        let newCroppedImagesUrls = {} as { [key: string]: string };

        // Get the cropped image URL for the API
        for (const [key, aspect] of Object.entries(
          aspectRatioWithOriginalAndCropped
        )) {
          const croppedImageUrl = getCroppedImgUrl(
            fullImageRef.current,
            crop,
            aspect
          );
          newCroppedImagesUrls[key] = croppedImageUrl;
        }

        newCroppedImagesUrls.filePath = filePath;

        setCroppedImagesUrls(newCroppedImagesUrls);
      }
    },
    [filePath, setCroppedImagesUrls]
  );

  // Use effect to handle logic that was in onImageLoad
  useEffect(() => {
    if (
      imageUrl &&
      fullImageRef.current &&
      fullImageRef.current.naturalWidth > 0
    ) {
      const { naturalWidth: width, naturalHeight: height } =
        fullImageRef.current;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 100,
            height: 100,
          },
          width / height,
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
      makeCropUrls(crop);
    }
  }, [imageUrl, makeCropUrls]);

  // Update imageUrl when filePath changes
  useEffect(() => {
    const newImageUrl = filePath
      ? Bytescale.UrlBuilder.url({
          accountId: "12a1yek",
          filePath: filePath,
          options: {},
        })
      : "";
    setImageUrl(newImageUrl);
  }, [filePath]);

  return (
    <Card className="max-w-screen w-full sm:max-w-xl">
      <CardContent className="grid grid-cols-1 place-items-center gap-0 py-4 shadow-md">
        <CardTitle>Event Image</CardTitle>
        <p className="mx-auto block text-sm font-medium leading-6 text-gray-900">
          <span className="text-gray-500">(Optional)</span>
        </p>
        <>
          {imageUrl && (
            <>
              <div className="p-1"></div>
              <img
                ref={fullImageRef}
                src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
                alt="Full Image Preview"
                className={cn(
                  "mx-auto block h-36 overflow-hidden object-cover",
                  {
                    hidden: showCroppedImage,
                  }
                )}
                // onLoad={() => {
                //   setImageLoadTime(Date.now());
                // }}
              />
              <img
                ref={previewImageRef}
                src={croppedImagesUrls?.cropped}
                alt="Cropped Preview"
                className={cn(
                  "mx-auto block h-36 overflow-hidden object-cover",
                  {
                    hidden: !showCroppedImage || isModalOpen,
                  }
                )}
              />
              <div className="p-1"></div>

              <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="fixed inset-0 z-10 mx-auto max-h-[90vh] max-w-[90vw] overflow-y-auto"
              >
                <div className="flex min-h-screen items-center justify-center">
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                  <div className="relative mx-auto max-w-[90vw] rounded bg-white p-4 sm:max-w-sm">
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                      Crop Image
                    </Dialog.Title>
                    <div className="p-2"></div>
                    <ReactCrop
                      crop={crop}
                      onComplete={onCropComplete}
                      onChange={onCropChange}
                    >
                      <img
                        src={`/api/image-proxy?url=${encodeURIComponent(
                          imageUrl
                        )}`}
                        alt="Crop preview"
                      />
                    </ReactCrop>
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute right-2 top-2"
                      variant="destructive"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Dialog>
              <div className="p-2"></div>
            </>
          )}
        </>
        <div className="p-2"></div>
        <div className="mx-auto flex flex-wrap justify-center gap-4">
          {imageUrl && (
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              variant="outline"
            >
              <Scissors className="mr-2 h-4 w-4" />
              Crop
            </Button>
          )}
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
                // push the file path to the search params
                const filePath = files[0].filePath;
                setFilePath(filePath);
                setCroppedImagesUrls({});
              }
            }}
          >
            {({ onClick }) => (
              <Button onClick={onClick} variant="secondary" size="sm">
                {imageUrl ? (
                  <SwitchCamera className="mr-2 h-4 w-4" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {imageUrl ? "Replace" : "Upload"}
              </Button>
            )}
          </UploadButton>
          {imageUrl && (
            <Button
              variant="destructive"
              onClick={() => setFilePath("")}
              size="sm"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
