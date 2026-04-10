/**
 * 图片美化工具集
 * 包含灰度、滤镜、提亮、模糊、锐化、降噪等功能
 */

/**
 * 灰度图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 灰度后的 Blob
 */
export async function grayscaleImage(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Grayscale failed'));
    }, 'image/png');
  });
}

/**
 * 黑白图片（二值化）
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} threshold - 阈值 (0-255)
 * @returns {Promise<Blob>} 黑白后的 Blob
 */
export async function binaryImage(source, threshold = 128) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > threshold ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Binary conversion failed'));
    }, 'image/png');
  });
}

/**
 * 反色图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 反色后的 Blob
 */
export async function invertImage(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Invert failed'));
    }, 'image/png');
  });
}

/**
 * 提亮图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} brightness - 亮度调整值 (-255 到 255)
 * @returns {Promise<Blob>} 提亮后的 Blob
 */
export async function adjustBrightness(source, brightness = 50) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + brightness));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Brightness adjustment failed'));
    }, 'image/png');
  });
}

/**
 * 调整对比度
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} contrast - 对比度调整值 (-100 到 100)
 * @returns {Promise<Blob>} 调整后的 Blob
 */
export async function adjustContrast(source, contrast = 50) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Contrast adjustment failed'));
    }, 'image/png');
  });
}

/**
 * 调整饱和度
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} saturation - 饱和度调整值 (-100 到 100)
 * @returns {Promise<Blob>} 调整后的 Blob
 */
export async function adjustSaturation(source, saturation = 50) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const factor = 1 + saturation / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    
    if (max !== min) {
      const r = (data[i] - 128) * factor + 128;
      const g = (data[i + 1] - 128) * factor + 128;
      const b = (data[i + 2] - 128) * factor + 128;
      
      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Saturation adjustment failed'));
    }, 'image/png');
  });
}

/**
 * 调整色相
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} hue - 色相调整值 (0-360 度)
 * @returns {Promise<Blob>} 调整后的 Blob
 */
export async function adjustHue(source, hue = 180) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const hueRad = (hue * Math.PI) / 180;
  const cos = Math.cos(hueRad);
  const sin = Math.sin(hueRad);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    data[i] = gray + (r - gray) * cos - (g - gray) * sin;
    data[i + 1] = gray + (r - gray) * sin + (g - gray) * cos;
    data[i + 2] = b;
    
    data[i] = Math.min(255, Math.max(0, data[i]));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Hue adjustment failed'));
    }, 'image/png');
  });
}

/**
 * 模糊图片（高斯模糊）
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} radius - 模糊半径
 * @returns {Promise<Blob>} 模糊后的 Blob
 */
export async function blurImage(source, radius = 2) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(canvas, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Blur failed'));
    }, 'image/png');
  });
}

/**
 * 锐化图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} strength - 锐化强度 (0-1)
 * @returns {Promise<Blob>} 锐化后的 Blob
 */
export async function sharpenImage(source, strength = 0.5) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const original = new Uint8ClampedArray(data);
  
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ];
  
  const mix = 1 - strength;
  
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let ki = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c;
            sum += original[idx] * kernel[ki++];
          }
        }
        
        const idx = (y * canvas.width + x) * 4 + c;
        data[idx] = Math.min(255, Math.max(0, original[idx] * mix + sum));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Sharpen failed'));
    }, 'image/png');
  });
}

/**
 * 降噪图片
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} strength - 降噪强度 (1-5)
 * @returns {Promise<Blob>} 降噪后的 Blob
 */
export async function denoiseImage(source, strength = 2) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const original = new Uint8ClampedArray(data);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      for (let dy = -strength; dy <= strength; dy++) {
        for (let dx = -strength; dx <= strength; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
            const idx = (ny * canvas.width + nx) * 4;
            r += original[idx];
            g += original[idx + 1];
            b += original[idx + 2];
            count++;
          }
        }
      }
      
      const idx = (y * canvas.width + x) * 4;
      data[idx] = r / count;
      data[idx + 1] = g / count;
      data[idx + 2] = b / count;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Denoise failed'));
    }, 'image/png');
  });
}

/**
 * 复古滤镜
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 复古后的 Blob
 */
export async function vintageFilter(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.1);
    data[i + 1] = Math.min(255, data[i + 1] * 0.9);
    data[i + 2] = Math.min(255, data[i + 2] * 0.7);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Vintage filter failed'));
    }, 'image/png');
  });
}

/**
 * 冷色滤镜
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 冷色后的 Blob
 */
export async function coldFilter(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 0.8);
    data[i + 1] = Math.min(255, data[i + 1] * 0.9);
    data[i + 2] = Math.min(255, data[i + 2] * 1.2);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Cold filter failed'));
    }, 'image/png');
  });
}

/**
 * 暖色滤镜
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @returns {Promise<Blob>} 暖色后的 Blob
 */
export async function warmFilter(source) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.2);
    data[i + 1] = Math.min(255, data[i + 1] * 1.1);
    data[i + 2] = Math.min(255, data[i + 2] * 0.8);
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Warm filter failed'));
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
  grayscaleImage,
  binaryImage,
  invertImage,
  adjustBrightness,
  adjustContrast,
  adjustSaturation,
  adjustHue,
  blurImage,
  sharpenImage,
  denoiseImage,
  vintageFilter,
  coldFilter,
  warmFilter,
};
