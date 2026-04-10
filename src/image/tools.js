/**
 * 图片工具集
 * 包含取色器、拼接、裁剪、二维码生成等功能
 */
import QRCode from 'qrcode';

/**
 * 图片取色器
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} x - X 坐标
 * @param {number} y - Y 坐标
 * @returns {Promise<{r: number, g: number, b: number, hex: string}>} RGB 颜色值
 */
export async function getColorFromImage(source, x, y) {
  const canvas = await prepareCanvas(source);
  const ctx = canvas.getContext('2d');
  
  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    throw new Error('Coordinates out of bounds');
  }
  
  const imageData = ctx.getImageData(x, y, 1, 1);
  const data = imageData.data;
  
  return {
    r: data[0],
    g: data[1],
    b: data[2],
    a: data[3],
    hex: rgbToHex(data[0], data[1], data[2]),
  };
}

/**
 * RGB 转十六进制
 * @param {number} r - 红色值
 * @param {number} g - 绿色值
 * @param {number} b - 蓝色值
 * @returns {string} 十六进制颜色
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 水平拼接图片
 * @param {Array<File|HTMLImageElement>} sources - 图片源数组
 * @param {string} backgroundColor - 背景颜色
 * @returns {Promise<Blob>} 拼接后的 Blob
 */
export async function stitchImagesHorizontally(sources, backgroundColor = '#ffffff') {
  if (!sources || sources.length === 0) {
    throw new Error('At least one source image is required');
  }
  
  const canvases = await Promise.all(sources.map(source => prepareCanvas(source)));
  
  const totalWidth = canvases.reduce((sum, canvas) => sum + canvas.width, 0);
  const maxHeight = Math.max(...canvases.map(canvas => canvas.height));
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = totalWidth;
  resultCanvas.height = maxHeight;
  const ctx = resultCanvas.getContext('2d');
  
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, totalWidth, maxHeight);
  
  let offsetX = 0;
  for (const canvas of canvases) {
    ctx.drawImage(canvas, offsetX, (maxHeight - canvas.height) / 2);
    offsetX += canvas.width;
  }
  
  return new Promise((resolve, reject) => {
    resultCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Horizontal stitch failed'));
    }, 'image/png');
  });
}

/**
 * 垂直拼接图片
 * @param {Array<File|HTMLImageElement>} sources - 图片源数组
 * @param {string} backgroundColor - 背景颜色
 * @returns {Promise<Blob>} 拼接后的 Blob
 */
export async function stitchImagesVertically(sources, backgroundColor = '#ffffff') {
  if (!sources || sources.length === 0) {
    throw new Error('At least one source image is required');
  }
  
  const canvases = await Promise.all(sources.map(source => prepareCanvas(source)));
  
  const maxWidth = Math.max(...canvases.map(canvas => canvas.width));
  const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = maxWidth;
  resultCanvas.height = totalHeight;
  const ctx = resultCanvas.getContext('2d');
  
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, maxWidth, totalHeight);
  
  let offsetY = 0;
  for (const canvas of canvases) {
    ctx.drawImage(canvas, (maxWidth - canvas.width) / 2, offsetY);
    offsetY += canvas.height;
  }
  
  return new Promise((resolve, reject) => {
    resultCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Vertical stitch failed'));
    }, 'image/png');
  });
}

/**
 * 网格拼接图片
 * @param {Array<File|HTMLImageElement>} sources - 图片源数组
 * @param {Object} options - 选项
 * @returns {Promise<Blob>} 拼接后的 Blob
 */
export async function stitchImagesGrid(sources, options = {}) {
  const {
    columns = 3,
    gap = 10,
    backgroundColor = '#ffffff',
  } = options;
  
  if (!sources || sources.length === 0) {
    throw new Error('At least one source image is required');
  }
  
  const canvases = await Promise.all(sources.map(source => prepareCanvas(source)));
  
  const rows = Math.ceil(canvases.length / columns);
  
  let maxWidth = 0;
  let maxHeight = 0;
  
  for (let i = 0; i < columns; i++) {
    const colCanvases = canvases.filter((_, idx) => idx % columns === i);
    if (colCanvases.length > 0) {
      maxWidth = Math.max(maxWidth, ...colCanvases.map(c => c.width));
    }
  }
  
  for (let i = 0; i < rows; i++) {
    const rowCanvases = canvases.slice(i * columns, (i + 1) * columns);
    if (rowCanvases.length > 0) {
      maxHeight = Math.max(maxHeight, ...rowCanvases.map(c => c.height));
    }
  }
  
  const resultWidth = columns * maxWidth + (columns - 1) * gap;
  const resultHeight = rows * maxHeight + (rows - 1) * gap;
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = resultWidth;
  resultCanvas.height = resultHeight;
  const ctx = resultCanvas.getContext('2d');
  
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, resultWidth, resultHeight);
  
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const col = i % columns;
    const row = Math.floor(i / columns);
    
    const x = col * (maxWidth + gap) + (maxWidth - canvas.width) / 2;
    const y = row * (maxHeight + gap) + (maxHeight - canvas.height) / 2;
    
    ctx.drawImage(canvas, x, y);
  }
  
  return new Promise((resolve, reject) => {
    resultCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Grid stitch failed'));
    }, 'image/png');
  });
}

/**
 * 生成二维码
 * @param {string} text - 文本内容
 * @param {Object} options - 选项
 * @returns {Promise<HTMLCanvasElement>} 二维码 Canvas
 */
export async function generateQRCode(text, options = {}) {
  const {
    width = 256,
    margin = 2,
    color = {
      dark: '#000000',
      light: '#ffffff',
    },
  } = options;
  
  try {
    const canvas = await QRCode.toCanvas(text, {
      width,
      margin,
      color,
    });
    return canvas;
  } catch (error) {
    throw new Error('QR code generation failed: ' + error.message);
  }
}

/**
 * 生成二维码图片
 * @param {string} text - 文本内容
 * @param {Object} options - 选项
 * @returns {Promise<Blob>} 二维码 Blob
 */
export async function generateQRCodeImage(text, options = {}) {
  const canvas = await generateQRCode(text, options);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('QR code image generation failed'));
    }, 'image/png');
  });
}

/**
 * 图片裁剪到指定尺寸
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @param {string} fit - 适配方式 (cover/contain/fill)
 * @returns {Promise<Blob>} 裁剪后的 Blob
 */
export async function cropToSize(source, width, height, fit = 'cover') {
  const canvas = await prepareCanvas(source);
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = width;
  resultCanvas.height = height;
  const ctx = resultCanvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  const sourceRatio = canvas.width / canvas.height;
  const targetRatio = width / height;
  
  let drawWidth, drawHeight, offsetX, offsetY;
  
  if (fit === 'cover') {
    if (sourceRatio > targetRatio) {
      drawHeight = height;
      drawWidth = canvas.width * (height / canvas.height);
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = canvas.height * (width / canvas.width);
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }
  } else if (fit === 'contain') {
    if (sourceRatio > targetRatio) {
      drawWidth = width;
      drawHeight = canvas.height * (width / canvas.width);
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = canvas.width * (height / canvas.height);
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }
  } else {
    drawWidth = width;
    drawHeight = height;
    offsetX = 0;
    offsetY = 0;
  }
  
  ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight);
  
  return new Promise((resolve, reject) => {
    resultCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Crop to size failed'));
    }, 'image/png');
  });
}

/**
 * 添加边框
 * @param {File|HTMLImageElement|HTMLCanvasElement} source - 图片源
 * @param {Object} options - 选项
 * @returns {Promise<Blob>} 带边框的 Blob
 */
export async function addBorder(source, options = {}) {
  const {
    width = 10,
    color = '#000000',
    borderRadius = 0,
  } = options;
  
  const canvas = await prepareCanvas(source);
  
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = canvas.width + width * 2;
  resultCanvas.height = canvas.height + width * 2;
  const ctx = resultCanvas.getContext('2d');
  
  ctx.fillStyle = color;
  
  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(resultCanvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(resultCanvas.width, 0, resultCanvas.width, borderRadius);
    ctx.lineTo(resultCanvas.width, resultCanvas.height - borderRadius);
    ctx.quadraticCurveTo(resultCanvas.width, resultCanvas.height, resultCanvas.width - borderRadius, resultCanvas.height);
    ctx.lineTo(borderRadius, resultCanvas.height);
    ctx.quadraticCurveTo(0, resultCanvas.height, 0, resultCanvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
  }
  
  ctx.drawImage(canvas, width, width);
  
  return new Promise((resolve, reject) => {
    resultCanvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Add border failed'));
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
  getColorFromImage,
  stitchImagesHorizontally,
  stitchImagesVertically,
  stitchImagesGrid,
  generateQRCode,
  generateQRCodeImage,
  cropToSize,
  addBorder,
};
