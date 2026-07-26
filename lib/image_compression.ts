/**
 * Client-side Image Compression & WebP Converter Utility
 * Automatically resizes high-resolution mobile camera uploads (e.g. 4000x3000 -> 1200px)
 * and converts any format (JPG, PNG, HEIC) to WebP format before uploading to Supabase.
 * Reduces 5-10MB photo uploads down to ~150-250KB WebP!
 */
export async function compressImageToWebP(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.8
): Promise<File> {
  // If not an image or already tiny (< 50KB), return as is
  if (!file.type.startsWith('image/') || file.size < 50 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
