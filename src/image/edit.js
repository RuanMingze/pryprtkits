/**
 * 图片编辑工具集
 * 包含压缩、裁剪、旋转、缩放、水印、圆角等功能
 */

/**
 * 压缩图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} quality - 质量 (0-1)
 * @param {string} format - 格式
 * @returns {Promise<Blob>} 压缩后的 Blob
 */
export async function compressImage(source, quality = 0.7, format = 'image/jpeg') {
  const canvas = await prepareCanvas(source);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Compression failed'));
    }, format, quality);
  });
}

/**
 * 裁剪图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {Object} options - 裁剪选项
 * @returns {Promise<Blob>} 裁剪后的 Blob
 */
export async function cropImage(source, options = {}) {
  const { x = 0, y = 0, width, height } = options;
  const canvas = await prepareCanvas(source);
  
  if (!width || !height) {
    throw new Error('Width and height are required');
  }
  
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = width;
  cropCanvas.height = height;
  const ctx = cropCanvas.getContext('2d');
  ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  
  return new Promise((resolve, reject) => {
    cropCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Crop failed'));
    }, 'image/png');
  });
}

/**
 * 旋转图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} angle - 旋转角度（度）
 * @returns {Promise<Blob>} 旋转后的 Blob
 */
export async function rotateImage(source, angle) {
  const canvas = await prepareCanvas(source);
  const radians = (angle * Math.PI) / 180;
  
  const rotateCanvas = document.createElement('canvas');
  const ctx = rotateCanvas.getContext('2d');
  
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  rotateCanvas.width = Math.abs(canvas.width * cos) + Math.abs(canvas.height * sin);
  rotateCanvas.height = Math.abs(canvas.width * sin) + Math.abs(canvas.height * cos);
  
  ctx.translate(rotateCanvas.width / 2, rotateCanvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  
  return new Promise((resolve, reject) => {
    rotateCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Rotate failed'));
    }, 'image/png');
  });
}

/**
 * 缩放图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {Object} options - 缩放选项
 * @returns {Promise<Blob>} 缩放后的 Blob
 */
export async function scaleImage(source, options = {}) {
  const { width, height, scale } = options;
  const canvas = await prepareCanvas(source);
  
  let newWidth, newHeight;
  
  if (scale) {
    newWidth = Math.floor(canvas.width * scale);
    newHeight = Math.floor(canvas.height * scale);
  } else if (width && height) {
    newWidth = width;
    newHeight = height;
  } else if (width) {
    newWidth = width;
    newHeight = Math.floor(canvas.height * (width / canvas.width));
  } else if (height) {
    newHeight = height;
    newWidth = Math.floor(canvas.width * (height / canvas.height));
  } else {
    throw new Error('Width, height or scale must be provided');
  }
  
  const scaleCanvas = document.createElement('canvas');
  scaleCanvas.width = newWidth;
  scaleCanvas.height = newHeight;
  const ctx = scaleCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  return new Promise((resolve, reject) => {
    scaleCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Scale failed'));
    }, 'image/png');
  });
}

/**
 * 添加水印
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {Object} options - 水印选项
 * @returns {Promise<Blob>} 带水印的 Blob
 */
export async function addWatermark(source, options = {}) {
  const {
    text,
    position = 'bottom-right',
    fontSize = 24,
    fontFamily = 'Arial',
    color = 'rgba(255, 255, 255, 0.7)',
    offsetX = 10,
    offsetY = 10,
    image: watermarkImage,
  } = options;
  
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  
  if (text) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    let x, y;
    switch (position) {
      case 'top-left':
        x = offsetX;
        y = textHeight + offsetY;
        break;
      case 'top-right':
        x = canvas.width - textWidth - offsetX;
        y = textHeight + offsetY;
        break;
      case 'bottom-left':
        x = offsetX;
        y = canvas.height - offsetY;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = (canvas.height + textHeight) / 2;
        break;
      case 'bottom-right':
      default:
        x = canvas.width - textWidth - offsetX;
        y = canvas.height - offsetY;
        break;
    }
    
    ctx.fillText(text, x, y);
  }
  
  if (watermarkImage) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let x, y;
        const imgWidth = options.watermarkWidth || img.width;
        const imgHeight = options.watermarkHeight || img.height;
        
        switch (position) {
          case 'top-left':
            x = offsetX;
            y = offsetY;
            break;
          case 'top-right':
            x = canvas.width - imgWidth - offsetX;
            y = offsetY;
            break;
          case 'bottom-left':
            x = offsetX;
            y = canvas.height - imgHeight - offsetY;
            break;
          case 'center':
            x = (canvas.width - imgWidth) / 2;
            y = (canvas.height - imgHeight) / 2;
            break;
          case 'bottom-right':
          default:
            x = canvas.width - imgWidth - offsetX;
            y = canvas.height - imgHeight - offsetY;
            break;
        }
        
        ctx.globalAlpha = options.opacity || 1;
        ctx.drawImage(img, x, y, imgWidth, imgHeight);
        
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Watermark failed'));
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = watermarkImage;
    });
  }
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Watermark failed'));
    }, 'image/png');
  });
}

/**
 * 圆角图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} radius - 圆角半径
 * @returns {Promise<Blob>} 圆角后的 Blob
 */
export async function roundCorners(source, radius = 10) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  
  const roundedCanvas = document.createElement('canvas');
  roundedCanvas.width = canvas.width;
  roundedCanvas.height = canvas.height;
  const roundedCtx = roundedCanvas.getContext('2d');
  
  roundedCtx.beginPath();
  roundedCtx.moveTo(radius, 0);
  roundedCtx.lineTo(canvas.width - radius, 0);
  roundedCtx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
  roundedCtx.lineTo(canvas.width, canvas.height - radius);
  roundedCtx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
  roundedCtx.lineTo(radius, canvas.height);
  roundedCtx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
  roundedCtx.lineTo(0, radius);
  roundedCtx.quadraticCurveTo(0, 0, radius, 0);
  roundedCtx.closePath();
  roundedCtx.clip();
  
  roundedCtx.drawImage(canvas, 0, 0);
  
  return new Promise((resolve, reject) => {
    roundedCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Round corners failed'));
    }, 'image/png');
  });
}

/**
 * 裁剪成圆形
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 圆形后的 Blob
 */
export async function cropToCircle(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = Math.min(canvas.width, canvas.height);
  circleCanvas.height = Math.min(canvas.width, canvas.height);
  const circleCtx = circleCanvas.getContext('2d');
  
  const radius = circleCanvas.width / 2;
  const centerX = circleCanvas.width / 2;
  const centerY = circleCanvas.height / 2;
  
  circleCtx.beginPath();
  circleCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  circleCtx.closePath();
  circleCtx.clip();
  
  const offsetX = (canvas.width - circleCanvas.width) / 2;
  const offsetY = (canvas.height - circleCanvas.height) / 2;
  circleCtx.drawImage(canvas, -offsetX, -offsetY);
  
  return new Promise((resolve, reject) => {
    circleCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Crop to circle failed'));
    }, 'image/png');
  });
}

/**
 * 准备 Canvas
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
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

export default {
  compressImage,
  cropImage,
  rotateImage,
  scaleImage,
  addWatermark,
  roundCorners,
  cropToCircle,
};
