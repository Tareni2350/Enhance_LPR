import { BoundingBox, EnhancementSettings } from '../types/lpr';

/**
 * Loads an image from a data URL or path and returns HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));
    img.src = src;
  });
}

/**
 * Crops the license plate from the original image using normalized bounding box [0-1000]
 * with optional padding.
 */
export async function cropPlate(
  imageSource: string | HTMLImageElement,
  box: BoundingBox,
  paddingPercent: number = 0.05
): Promise<{ croppedDataUrl: string; width: number; height: number }> {
  const img = typeof imageSource === 'string' ? await loadImage(imageSource) : imageSource;

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Clamp normalized bounding box to [0, 1000] safely
  const safeYmin = Math.max(0, Math.min(980, Number(box.ymin) || 0));
  const safeXmin = Math.max(0, Math.min(980, Number(box.xmin) || 0));
  const safeYmax = Math.max(safeYmin + 10, Math.min(1000, Number(box.ymax) || safeYmin + 100));
  const safeXmax = Math.max(safeXmin + 10, Math.min(1000, Number(box.xmax) || safeXmin + 200));

  // Convert 0-1000 to pixels
  let ymin = (safeYmin / 1000) * origHeight;
  let xmin = (safeXmin / 1000) * origWidth;
  let ymax = (safeYmax / 1000) * origHeight;
  let xmax = (safeXmax / 1000) * origWidth;

  // Apply padding safely
  const boxW = Math.max(10, xmax - xmin);
  const boxH = Math.max(10, ymax - ymin);
  const padX = boxW * paddingPercent;
  const padY = boxH * paddingPercent;

  xmin = Math.max(0, xmin - padX);
  ymin = Math.max(0, ymin - padY);
  xmax = Math.min(origWidth, xmax + padX);
  ymax = Math.min(origHeight, ymax + padY);

  const cropW = Math.max(10, Math.round(xmax - xmin));
  const cropH = Math.max(10, Math.round(ymax - ymin));

  // Minimum dimensions to preserve detail (upscale if tiny)
  const targetW = Math.max(cropW, 360);
  const targetH = Math.max(cropH, Math.round((cropH / cropW) * targetW));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, xmin, ymin, cropW, cropH, 0, 0, targetW, targetH);

  return {
    croppedDataUrl: canvas.toDataURL('image/png'),
    width: targetW,
    height: targetH,
  };
}

/**
 * Calculates variance of Laplacian on canvas image data
 * Used as standard measure for sharpness/blur in computer vision.
 * High variance (>150) = sharp, Low variance (<60) = blurry.
 */
export function calculateLaplacianVariance(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return 50;

  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Convert to grayscale array
  const gray = new Float32Array(width * height);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // 3x3 Laplacian Kernel:
  // [  0,  1,  0 ]
  // [  1, -4,  1 ]
  // [  0,  1,  0 ]
  const laplacian = new Float32Array((width - 2) * (height - 2));
  let sum = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const lap =
        gray[idx - width] +
        gray[idx + width] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];

      laplacian[count] = lap;
      sum += lap;
      count++;
    }
  }

  const mean = sum / count;
  let varianceSum = 0;
  for (let i = 0; i < count; i++) {
    const diff = laplacian[i] - mean;
    varianceSum += diff * diff;
  }

  const variance = varianceSum / count;
  return Math.min(100, Math.round((variance / 250) * 100));
}

/**
 * Enhances a license plate image with unsharp masking, contrast stretch,
 * gamma correction, and optional binarization.
 */
export async function enhancePlateImage(
  sourceDataUrl: string,
  settings: EnhancementSettings
): Promise<string> {
  const img = await loadImage(sourceDataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceDataUrl;

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const w = canvas.width;
  const h = canvas.height;

  // 1. Contrast & Brightness adjustment + Gamma
  const contrastFactor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
  const gamma = Math.max(0.2, settings.gamma || 1.0);
  const invGamma = 1 / gamma;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let val = data[i + c];
      // Brightness
      val += settings.brightness;
      // Contrast
      val = contrastFactor * (val - 128) + 128;
      // Gamma
      val = 255 * Math.pow(Math.max(0, Math.min(255, val)) / 255, invGamma);

      data[i + c] = Math.max(0, Math.min(255, Math.round(val)));
    }
  }

  // 2. Unsharp Masking / Sharpening Convolution
  if (settings.sharpness > 0) {
    const k = (settings.sharpness / 100) * 1.5;
    // Copy current pixels for kernel convolution
    const srcCopy = new Uint8ClampedArray(data);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const centerIdx = (y * w + x) * 4;
        const topIdx = ((y - 1) * w + x) * 4;
        const bottomIdx = ((y + 1) * w + x) * 4;
        const leftIdx = (y * w + (x - 1)) * 4;
        const rightIdx = (y * w + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const center = srcCopy[centerIdx + c];
          const laplacian =
            srcCopy[topIdx + c] +
            srcCopy[bottomIdx + c] +
            srcCopy[leftIdx + c] +
            srcCopy[rightIdx + c] -
            4 * center;

          // Unsharp mask = original - k * laplacian
          const sharpened = center - k * laplacian;
          data[centerIdx + c] = Math.max(0, Math.min(255, Math.round(sharpened)));
        }
      }
    }
  }

  // 3. Optional Binarization for high-contrast OCR enhancement
  if (settings.binarize) {
    const thresh = settings.threshold;
    for (let i = 0; i < data.length; i += 4) {
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const binaryVal = luminance > thresh ? 255 : 0;
      data[i] = binaryVal;
      data[i + 1] = binaryVal;
      data[i + 2] = binaryVal;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Prepares any image source (file URL, SVG, or large high-res photo data URL) into a
 * clean raster base64 data URL (max 1280px) with an explicit supported MIME type for AI analysis.
 */
export async function prepareImageForApi(
  imageSource: string
): Promise<{ imageBase64: string; mimeType: string }> {
  const isBase64DataUrl = /^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(imageSource);
  const mimeMatch = imageSource.match(/^data:(image\/[a-zA-Z0-9+.-]+);/);
  const detectedMime = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';

  // Load into HTMLImageElement (works for both URLs like /src/assets/images/... and data URLs)
  const img = await loadImage(imageSource);
  const origW = img.naturalWidth || img.width || 800;
  const origH = img.naturalHeight || img.height || 500;
  const maxDim = 1280;

  const needsResize = origW > maxDim || origH > maxDim;
  const isSvg =
    detectedMime === 'image/svg+xml' ||
    imageSource.startsWith('data:image/svg+xml') ||
    imageSource.toLowerCase().endsWith('.svg');
  const isSupportedDirect =
    isBase64DataUrl &&
    (detectedMime === 'image/jpeg' ||
      detectedMime === 'image/png' ||
      detectedMime === 'image/webp');

  const isTooLargePayload = imageSource.length > 1_800_000;

  if (!isSvg && !needsResize && !isTooLargePayload && isSupportedDirect) {
    return { imageBase64: imageSource, mimeType: detectedMime };
  }

  let targetW = origW;
  let targetH = origH;
  if (needsResize) {
    const scale = Math.min(maxDim / origW, maxDim / origH);
    targetW = Math.round(origW * scale);
    targetH = Math.round(origH * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { imageBase64: imageSource, mimeType: detectedMime };
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const outputMime = isSvg ? 'image/png' : 'image/jpeg';
  const exported = canvas.toDataURL(outputMime, 0.88);
  return { imageBase64: exported, mimeType: outputMime };
}

