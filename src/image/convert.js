/**
 * 图片格式转换工具集
 * 包含 JPG/PNG/WebP/GIF/BMP/ICO 等格式互转
 */

/**
 * 图片转 JPG
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @param {number} quality - 质量 (0-1)
 * @returns {Promise<Blob>} JPG Blob
 */
export async function imageToJpg(source, quality = 0.92) {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/jpeg', quality);
  });
}

/**
 * 图片转 PNG
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @returns {Promise<Blob>} PNG Blob
 */
export async function imageToPng(source) {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/png');
  });
}

/**
 * 图片转 WebP
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @param {number} quality - 质量 (0-1)
 * @returns {Promise<Blob>} WebP Blob
 */
export async function imageToWebp(source, quality = 0.92) {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/webp', quality);
  });
}

/**
 * 图片转 GIF（实际上是静态 GIF）
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @returns {Promise<Blob>} GIF Blob
 */
export async function imageToGif(source) {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/gif');
  });
}

/**
 * 图片转 BMP
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @returns {Promise<Blob>} BMP Blob
 */
export async function imageToBmp(source) {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/bmp');
  });
}

/**
 * 图片转 ICO
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @param {number} size - ICO 尺寸（默认 32）
 * @returns {Promise<Blob>} ICO Blob
 */
export async function imageToIco(source, size = 32) {
  const canvas = await prepareCanvas(source);
  const icoCanvas = document.createElement('canvas');
  icoCanvas.width = size;
  icoCanvas.height = size;
  const ctx = icoCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, size, size);
  
  return new Promise((resolve, reject) => {
    icoCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Conversion failed'));
    }, 'image/x-icon');
  });
}

/**
 * 准备 Canvas
 * @param {HTMLImageElement|HTMLCanvasElement|File} source - 图片源
 * @returns {Promise<HTMLCanvasElement>} Canvas 元素
 */
async function prepareCanvas(source) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (source instanceof File) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(source);
    });
  } else if (source instanceof HTMLImageElement) {
    canvas.width = source.width;
    canvas.height = source.height;
    ctx.drawImage(source, 0, 0);
    return canvas;
  } else if (source instanceof HTMLCanvasElement) {
    return source;
  } else {
    throw new Error('Invalid source type');
  }
}

/**
 * 批量转换图片格式
 * @param {Array<File>} files - 文件数组
 * @param {string} format - 目标格式
 * @param {number} quality - 质量
 * @returns {Promise<Array<Blob>>} 转换后的 Blob 数组
 */
export async function batchConvertImages(files, format = 'jpg', quality = 0.92) {
  const results = [];
  for (const file of files) {
    const blob = await convertImageFormat(file, format, quality);
    results.push(blob);
  }
  return results;
}

/**
 * 转换图片格式（通用）
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {string} format - 目标格式
 * @param {number} quality - 质量
 * @returns {Promise<Blob>} 转换后的 Blob
 */
export async function convertImageFormat(source, format = 'jpg', quality = 0.92) {
  const fmt = format.toLowerCase();
  switch (fmt) {
    case 'jpg':
    case 'jpeg':
      return imageToJpg(source, quality);
    case 'png':
      return imageToPng(source);
    case 'webp':
      return imageToWebp(source, quality);
    case 'gif':
      return imageToGif(source);
    case 'bmp':
      return imageToBmp(source);
    case 'ico':
      return imageToIco(source);
    default:
      throw new Error('Unsupported format: ' + format);
  }
}

/**
 * 获取图片信息
 * @param {File|HTMLImageElement} source - 图片源
 * @returns {Promise<Object>} 图片信息
 */
export async function getImageInfo(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
      URL.revokeObjectURL(img.src);
    };
    img.onload = onload;
    img.onerror = reject;
    
    if (source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else if (source instanceof HTMLImageElement) {
      img.src = source.src;
    } else {
      reject(new Error('Invalid source'));
    }
  });
}

export default {
  imageToJpg,
  imageToPng,
  imageToWebp,
  imageToGif,
  imageToBmp,
  imageToIco,
  batchConvertImages,
  convertImageFormat,
  getImageInfo,
};
