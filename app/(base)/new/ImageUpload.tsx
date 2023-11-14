"use client";

import * as Bytescale from "@bytescale/sdk";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { SwitchCamera, Trash, Upload, Scissors } from "lucide-react";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Dialog } from "@headlessui/react";
import { ReactCrop, Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ImageUpload({
  savedFilePath,
}: {
  savedFilePath?: string;
}) {
  // ImageUpload
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filePath, setFilePath] = useState(
    searchParams.get("filePath") || savedFilePath || ""
  );
  const imageUrl = filePath
    ? Bytescale.UrlBuilder.url({
        accountId: "12a1yek",
        filePath: filePath,
        options: {},
      })
    : "";

  // ImageCropper
  const { setCroppedImagesUrls } = useCroppedImageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImages, setCroppedImages] = useState<{ [key: string]: string }>(
    {}
  );
  const fullImageRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: {
    currentTarget: { naturalWidth: any; naturalHeight: any };
  }) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
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
    makeClientCropAndUrls(crop);
  }

  const onCropComplete = (crop: Crop, percentageCrop: Crop) => {
    makeClientCropAndUrls(percentageCrop);
  };

  const onCropChange = (newCrop: Crop, newPercentageCrop: Crop) => {
    setCrop(newPercentageCrop);
  };

  const makeClientCropAndUrls = async (crop: Crop) => {
    if (fullImageRef.current && crop.width && crop.height) {
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

      // Get the cropped image for preview of each aspect ratio
      for (const [key, aspect] of Object.entries(
        aspectRatioWithOriginalAndCropped
      )) {
        const croppedImageUrl = await getCroppedImg(
          fullImageRef.current,
          crop,
          aspect
        );
        newCroppedImages[key] = croppedImageUrl;
      }

      setCroppedImages(newCroppedImages);

      // Get the cropped image URL for the API
      for (const [key, aspect] of Object.entries(
        aspectRatioWithOriginalAndCropped
      )) {
        const croppedImageUrl = await getCroppedImgUrl(
          fullImageRef.current,
          crop,
          aspect
        );
        newCroppedImagesUrls[key] = croppedImageUrl;
      }

      newCroppedImagesUrls.filePath = filePath;

      setCroppedImagesUrls(newCroppedImagesUrls);
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    targetAspect: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Convert crop percentages to pixels
      const pxCrop = {
        x: image.naturalWidth * (crop.x / 100),
        y: image.naturalHeight * (crop.y / 100),
        width: image.naturalWidth * (crop.width / 100),
        height: image.naturalHeight * (crop.height / 100),
      };

      // Calculate the new width and height based on the target aspect ratio
      let newWidth = pxCrop.width;
      let newHeight = newWidth / targetAspect;
      let offsetX = 0;
      let offsetY = 0;

      // Adjust if the new height is larger than the cropped area
      if (newHeight > pxCrop.height) {
        newHeight = pxCrop.height;
        newWidth = newHeight * targetAspect;
        // Center the crop area
        offsetX = (pxCrop.width - newWidth) / 2;
        offsetY = (pxCrop.height - newHeight) / 2;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      if (ctx) {
        // Draw the image slice on the canvas
        ctx.drawImage(
          image,
          pxCrop.x + offsetX,
          pxCrop.y + offsetY,
          newWidth,
          newHeight,
          0,
          0,
          newWidth,
          newHeight
        );
        // Resolve or reject the Promise based on the canvas operation success
        canvas.toBlob((blob) => {
          if (blob) {
            const imageURL = URL.createObjectURL(blob);
            resolve(imageURL);
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, "image/jpeg");
      } else {
        reject(new Error("2D context not available."));
      }
    });
  };

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

  return (
    <Card className="max-w-screen w-full sm:max-w-xl">
      <CardContent className="grid grid-cols-1 place-items-center gap-0 py-4 shadow-md">
        <CardTitle>Event Image</CardTitle>
        <div className="p-2"></div>
        <>
          <p className="mx-auto block text-sm font-medium leading-6 text-gray-900">
            <span className="text-gray-500">Full image</span>
          </p>
          {imageUrl && (
            <>
              <div className="p-1"></div>
              <img
                key={filePath}
                ref={croppedImages?.original ? previewImageRef : fullImageRef}
                src={
                  croppedImages?.cropped ||
                  `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
                }
                alt="Preview"
                className="mx-auto block w-36"
                onLoad={croppedImages?.cropped ? () => null : onImageLoad}
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
                        ref={fullImageRef}
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
              <p className="mx-auto text-center text-sm font-medium leading-6 text-gray-500">
                Site previews
              </p>
              <div className="mx-auto flex h-16 max-w-sm flex-wrap justify-around gap-2 ">
                {Object.entries(croppedImages)
                  .filter(
                    ([aspect, src]) =>
                      !(aspect === "original" || aspect === "cropped")
                  )
                  .map(([aspect, src]) => (
                    <div key={aspect} className="mt-2 h-auto w-16">
                      <img
                        alt={`Crop preview ${aspect}`}
                        src={src}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </>
        <div className="p-4"></div>
        <div className="mx-auto flex flex-wrap justify-center gap-4">
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            <Scissors className="mr-2 h-4 w-4" />
            Crop
          </Button>
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
                setCroppedImages({});
                router.push(
                  pathname + "?" + new URLSearchParams({ filePath }).toString()
                );
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
