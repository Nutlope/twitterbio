/* eslint-disable @next/next/no-img-element */
import * as Bytescale from "@bytescale/sdk";
import React, { useState, useRef } from "react";
import { ReactCrop, Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
  imageUrl: string;
  filePath: string;
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, filePath }) => {
  const { setCroppedImagesUrls } = useCroppedImageContext();

  const [crop, setCrop] = useState<Crop>();
  const [croppedImages, setCroppedImages] = useState<{ [key: string]: string }>(
    {}
  );
  const imageRef = useRef<HTMLImageElement>(null);

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
    if (imageRef.current && crop.width && crop.height) {
      const aspectRatios = {
        square: 1,
        fourThree: 4 / 3,
        sixteenNine: 16 / 9,
      };

      const aspectRatiosAndOriginal = {
        ...aspectRatios,
        original:
          imageRef.current.naturalWidth / imageRef.current.naturalHeight,
      };

      let newCroppedImages = {} as { [key: string]: string };
      let newCroppedImagesUrls = {} as { [key: string]: string };

      // Get the cropped image for preview of each aspect ratio
      for (const [key, aspect] of Object.entries(aspectRatios)) {
        const croppedImageUrl = await getCroppedImg(
          imageRef.current,
          crop,
          aspect
        );
        newCroppedImages[key] = croppedImageUrl;
      }

      setCroppedImages(newCroppedImages);

      // Get the cropped image URL for the API
      for (const [key, aspect] of Object.entries(aspectRatiosAndOriginal)) {
        const croppedImageUrl = await getCroppedImgUrl(
          imageRef.current,
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
    <div>
      <div className="mx-auto h-64 w-full md:h-96 lg:h-auto lg:w-1/2">
        <ReactCrop
          crop={crop}
          onComplete={onCropComplete}
          onChange={onCropChange}
        >
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
            ref={imageRef}
            alt="Crop preview"
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>
      <p className="mx-auto text-center text-sm font-medium leading-6 text-gray-500">
        Crop previews for site, will be expandable to full size
      </p>
      <div className="mx-auto flex max-w-sm flex-wrap justify-around">
        {Object.entries(croppedImages).map(([aspect, src]) => (
          <div key={aspect} className="mt-2 h-24 w-24">
            <img
              alt={`Crop preview ${aspect}`}
              src={src}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCropper;
