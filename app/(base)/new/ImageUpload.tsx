/* eslint-disable @next/next/no-img-element */
"use client";

import * as Bytescale from "@bytescale/sdk";
import React, { useState, useRef, useEffect } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { SwitchCamera, Trash, Upload, Scissors } from "lucide-react";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Dialog } from "@headlessui/react";
import { ReactCrop, Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn, extractFilePath } from "@/lib/utils";

function buildDefaultUrl(filePath: string) {
  return Bytescale.UrlBuilder.url({
    accountId: "12a1yek",
    filePath: filePath,
    options: {},
  });
}

const buildCroppedUrl = (
  filePath: string,
  opts: {
    naturalWidth: number;
    naturalHeight: number;
    crop: Crop;
    targetAspect: number;
  }
): string => {
  const { naturalWidth, naturalHeight, crop, targetAspect } = opts;
  const validOptions =
    naturalHeight > 0 && naturalWidth > 0 && targetAspect > 0;
  if (!validOptions) {
    console.error("buildAllCropUrls was called with invalid options:", opts);
    return "";
  }
  // Convert crop percentages to pixels
  let pxCrop = {
    x: Math.round(naturalWidth * (crop.x / 100)),
    y: Math.round(naturalHeight * (crop.y / 100)),
    width: Math.round(naturalWidth * (crop.width / 100)),
    height: Math.round(naturalHeight * (crop.height / 100)),
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

const buildAllCropUrls = (
  filePath: string,
  opts: { naturalWidth: number; naturalHeight: number; crop: Crop }
) => {
  const { naturalWidth, naturalHeight, crop } = opts;
  let newCroppedImagesUrls = {} as { [key: string]: string };

  const validOptions = naturalHeight > 0 && naturalWidth > 0;
  if (!validOptions) {
    console.error("buildAllCropUrls was called with invalid options:", opts);
    return newCroppedImagesUrls;
  }

  if (validOptions) {
    const aspectRatios = {
      square: 1,
      fourThree: 4 / 3,
      sixteenNine: 16 / 9,
    };
    const cropAspectRatio = crop.width / crop.height;
    const imageAspectRatio = naturalWidth / naturalHeight;
    const croppedImageAspectRatio = cropAspectRatio * imageAspectRatio;
    const aspectRatioWithOriginalAndCropped = {
      ...aspectRatios,
      cropped: croppedImageAspectRatio,
      original: naturalWidth / naturalHeight,
    };

    // Get the cropped image URL for the API
    for (const [key, aspect] of Object.entries(
      aspectRatioWithOriginalAndCropped
    )) {
      const croppedImageUrl = buildCroppedUrl(filePath, {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        crop,
        targetAspect: aspect,
      });
      newCroppedImagesUrls[key] = croppedImageUrl;
    }

    newCroppedImagesUrls.filePath = filePath;
  }
  return newCroppedImagesUrls;
};

const defaultCrop = (opts: { naturalWidth: number; naturalHeight: number }) => {
  const { naturalWidth, naturalHeight } = opts;

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
        height: 100,
      },
      naturalWidth / naturalHeight,
      naturalWidth,
      naturalHeight
    ),
    naturalWidth,
    naturalHeight
  );
};

export default function ImageUpload({
  images,
  filePath: filePathFromSearchParam,
}: {
  images?: string[];
  filePath?: string;
}) {
  const croppedImageUrlFromProps = images?.[3];
  const filePathFromImages = croppedImageUrlFromProps
    ? extractFilePath(croppedImageUrlFromProps)
    : undefined;
  const [filePath, setFilePath] = useState(
    filePathFromSearchParam || filePathFromImages || ""
  );
  const initialImageUrl =
    croppedImageUrlFromProps || (filePath && buildDefaultUrl(filePath)) || "";
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const { croppedImagesUrls, setCroppedImagesUrls } = useCroppedImageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const fullImageRef = useRef<HTMLImageElement>(null);
  const { naturalHeight, naturalWidth } = fullImageRef.current || {};
  const hasNaturalDimensions =
    naturalHeight && naturalWidth && naturalHeight > 0 && naturalWidth > 0;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Reset the imageLoaded state whenever imageUrl changes
    setImageLoaded(false);

    const imageElement = fullImageRef.current;

    if (imageElement && imageUrl) {
      const handleLoad = () => {
        // Set imageLoaded to true when the image is loaded
        setImageLoaded(true);
      };

      // Add event listener to the image element
      imageElement.addEventListener("load", handleLoad);

      // Check if image is already loaded (cached images)
      if (imageElement.complete && imageElement.naturalWidth) {
        setImageLoaded(true);
      }

      // Clean up
      return () => {
        imageElement.removeEventListener("load", handleLoad);
      };
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded && hasNaturalDimensions) {
      if (imageUrl === initialImageUrl) {
        return;
      }
      const crop = defaultCrop({
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
      });
      setCrop(crop);
      const cropUrls = buildAllCropUrls(filePath, {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        crop: crop as Crop,
      });
      setCroppedImagesUrls(cropUrls);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLoaded]);

  const onCropComplete = (crop: Crop, percentageCrop: Crop) => {
    if (!hasNaturalDimensions) {
      console.error(
        "onCropComplete was called before natural dimensions were set."
      );
      return;
    }
    const cropUrls = buildAllCropUrls(filePath, {
      naturalWidth: naturalWidth || 0,
      naturalHeight: naturalHeight || 0,
      crop: percentageCrop,
    });
    setCroppedImagesUrls(cropUrls);
  };

  const onCropChange = (newCrop: Crop, newPercentageCrop: Crop) => {
    setCrop(newPercentageCrop);
  };

  const croppedImagesMatchFilePath = Object.values(croppedImagesUrls).some(
    (url) => url.includes(filePath)
  );
  const showCroppedImage =
    croppedImagesMatchFilePath && croppedImagesUrls?.cropped;

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
                src={imageUrl}
                alt="Full Image Preview"
                className={cn(
                  "mx-auto block h-36 overflow-hidden object-cover",
                  {
                    hidden: showCroppedImage,
                  }
                )}
                ref={fullImageRef}
              />
              {showCroppedImage && (
                <div className="text-center text-sm text-gray-500">
                  <span className="font-medium">Cropped Preview</span>
                </div>
              )}
              <img
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
                      <img src={imageUrl} alt="Cropper img" />
                    </ReactCrop>
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
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
                const fileUrl = files[0].fileUrl;
                setFilePath(filePath);
                setImageUrl(fileUrl);
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
              onClick={() => {
                setFilePath("");
                setImageUrl("");
                setCroppedImagesUrls({ deleted: "true" });
              }}
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
