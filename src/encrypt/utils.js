/**
 * 加密工具集
 * 包含文件密码保护、异或加密等实用工具
 */
import CryptoJS from 'crypto-js';

/**
 * 异或加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function xorEncrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  let result = '';
  for (let i = 0; i < message.length; i++) {
    const messageChar = message.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(messageChar ^ keyChar);
  }
  return btoa(unescape(encodeURIComponent(result)));
}

/**
 * 异或解密
 * @param {string} encrypted - 加密后的字符串
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function xorDecrypt(encrypted, key) {
  if (!encrypted || !key) {
    throw new Error('Encrypted data and key are required');
  }
  try {
    const decoded = decodeURIComponent(escape(atob(encrypted)));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const encryptedChar = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(encryptedChar ^ keyChar);
    }
    return result;
  } catch (e) {
    throw new Error('Decryption failed');
  }
}

/**
 * 生成随机密码
 * @param {number} length - 密码长度
 * @param {Object} options - 选项
 * @returns {string} 随机密码
 */
export function generatePassword(length = 16, options = {}) {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;
  
  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}

/**
 * 生成随机密钥
 * @param {number} length - 密钥长度（字节）
 * @returns {string} 随机密钥（十六进制）
 */
export function generateSecretKey(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 生成随机盐
 * @param {number} length - 盐长度
 * @returns {string} 随机盐
 */
export function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * 密码强度检测
 * @param {string} password - 密码
 * @returns {Object} 密码强度信息
 */
export function checkPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      feedback: ['密码不能为空'],
    };
  }
  
  let score = 0;
  const feedback = [];
  
  if (password.length >= 8) score += 1;
  else feedback.push('密码长度至少为 8 位');
  
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('包含小写字母');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('包含大写字母');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('包含数字');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('包含特殊字符');
  
  let level = 'weak';
  if (score >= 6) level = 'strong';
  else if (score >= 4) level = 'medium';
  
  return {
    score,
    level,
    feedback: feedback.length > 0 ? ['建议：' + feedback.join('、')] : ['密码强度很好'],
  };
}

/**
 * Base64 URL 安全编码
 * @param {string} str - 原始字符串
 * @returns {string} URL 安全的 Base64
 */
export function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL 安全解码
 * @param {string} str - URL 安全的 Base64
 * @returns {string} 原始字符串
 */
export function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

/**
 * 文本加密（简单包装）
 * @param {string} text - 文本
 * @param {string} key - 密钥
 * @param {string} algorithm - 算法
 * @returns {string} 加密结果
 */
export function encryptText(text, key, algorithm = 'aes') {
  switch (algorithm.toLowerCase()) {
    case 'aes':
      return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32))).toString();
    case 'des':
      return CryptoJS.DES.encrypt(text, CryptoJS.enc.Utf8.parse(key.padEnd(8, '0').slice(0, 8))).toString();
    case 'rc4':
      return CryptoJS.RC4.encrypt(text, CryptoJS.enc.Utf8.parse(key)).toString();
    case 'rabbit':
      return CryptoJS.Rabbit.encrypt(text, CryptoJS.enc.Utf8.parse(key)).toString();
    default:
      throw new Error('Unsupported algorithm');
  }
}

/**
 * 文本解密（简单包装）
 * @param {string} encrypted - 加密文本
 * @param {string} key - 密钥
 * @param {string} algorithm - 算法
 * @returns {string} 解密结果
 */
export function decryptText(encrypted, key, algorithm = 'aes') {
  let decrypted;
  switch (algorithm.toLowerCase()) {
    case 'aes':
      decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32)));
      break;
    case 'des':
      decrypted = CryptoJS.DES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key.padEnd(8, '0').slice(0, 8)));
      break;
    case 'rc4':
      decrypted = CryptoJS.RC4.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key));
      break;
    case 'rabbit':
      decrypted = CryptoJS.Rabbit.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key));
      break;
    default:
      throw new Error('Unsupported algorithm');
  }
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 文件分块加密
 * @param {File} file - 文件对象
 * @param {string} key - 密钥
 * @param {number} chunkSize - 分块大小
 * @returns {Promise<Array>} 加密后的分块
 */
export async function encryptFileChunks(file, key, chunkSize = 1024 * 1024) {
  if (!file || !key) {
    throw new Error('File and key are required');
  }
  
  const chunks = [];
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  let offset = 0;
  
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const arrayBuffer = await chunk.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const encrypted = CryptoJS.AES.encrypt(wordArray, keyUtf8, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: keyUtf8,
    });
    chunks.push(encrypted.toString());
    offset += chunkSize;
  }
  
  return chunks;
}

/**
 * 文件分块解密
 * @param {Array<string>} chunks - 加密分块
 * @param {string} key - 密钥
 * @returns {Promise<Uint8Array>} 解密后的数据
 */
export async function decryptFileChunks(chunks, key) {
  if (!chunks || !key) {
    throw new Error('Chunks and key are required');
  }
  
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  const allBytes = [];
  
  for (const chunk of chunks) {
    const decrypted = CryptoJS.AES.decrypt(chunk, keyUtf8, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: keyUtf8,
    });
    
    const u8arr = new Uint8Array(decrypted.words.length * 4);
    for (let i = 0; i < decrypted.words.length; i++) {
      u8arr[i * 4] = (decrypted.words[i] >>> 24) & 0xff;
      u8arr[i * 4 + 1] = (decrypted.words[i] >>> 16) & 0xff;
      u8arr[i * 4 + 2] = (decrypted.words[i] >>> 8) & 0xff;
      u8arr[i * 4 + 3] = decrypted.words[i] & 0xff;
    }
    allBytes.push(u8arr);
  }
  
  const totalLength = allBytes.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const bytes of allBytes) {
    result.set(bytes, offset);
    offset += bytes.length;
  }
  
  return result;
}

export default {
  xorEncrypt,
  xorDecrypt,
  generatePassword,
  generateSecretKey,
  generateSalt,
  checkPasswordStrength,
  base64UrlEncode,
  base64UrlDecode,
  encryptText,
  decryptText,
  encryptFileChunks,
  decryptFileChunks,
};
