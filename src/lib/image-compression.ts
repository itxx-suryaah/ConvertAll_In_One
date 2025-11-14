
export function compressImage(
  file: File,
  quality: number,
  type: string
): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          type,
          quality
        );
      };
      img.onerror = (error) => {
        // Create a more specific error object
        const err = new Error("The source image could not be decoded.");
        // You might want to pass the original error event for more context
        // (err as any).originalError = error;
        reject(err);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
