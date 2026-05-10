export async function generateThumbnail(
  file: File,
  maxSize = 800,
  quality = 0.82
): Promise<Blob> {
  const img = await loadImage(file);
  const { width, height } = calculateSize(img.width, img.height, maxSize);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate thumbnail"));
      },
      "image/jpeg",
      quality
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

function calculateSize(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): { width: number; height: number } {
  if (originalWidth <= maxSize && originalHeight <= maxSize) {
    return { width: originalWidth, height: originalHeight };
  }

  if (originalWidth > originalHeight) {
    return {
      width: maxSize,
      height: Math.round((originalHeight * maxSize) / originalWidth),
    };
  }

  return {
    width: Math.round((originalWidth * maxSize) / originalHeight),
    height: maxSize,
  };
}

export async function compressImage(
  file: File,
  maxOriginalSize = 1024 * 1024
): Promise<{ file: File; isCompressed: boolean }> {
  if (file.size <= maxOriginalSize) {
    return { file, isCompressed: false };
  }

  const quality = Math.min(0.8, maxOriginalSize / file.size);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = await loadImage(file);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to compress image"));
      },
      file.type,
      quality
    );
  });

  return {
    file: new File([blob], file.name, { type: file.type }),
    isCompressed: true,
  };
}
