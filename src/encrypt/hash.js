/**
 * 哈希算法工具集
 * 包含 MD5、SHA1、SHA256、SHA512 等哈希计算
 */
import CryptoJS from 'crypto-js';

/**
 * MD5 哈希
 * @param {string} message - 原始消息
 * @returns {string} MD5 哈希值
 */
export function md5(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.MD5(message).toString();
}

/**
 * SHA1 哈希
 * @param {string} message - 原始消息
 * @returns {string} SHA1 哈希值
 */
export function sha1(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.SHA1(message).toString();
}

/**
 * SHA256 哈希
 * @param {string} message - 原始消息
 * @returns {string} SHA256 哈希值
 */
export function sha256(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.SHA256(message).toString();
}

/**
 * SHA512 哈希
 * @param {string} message - 原始消息
 * @returns {string} SHA512 哈希值
 */
export function sha512(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.SHA512(message).toString();
}

/**
 * SHA224 哈希
 * @param {string} message - 原始消息
 * @returns {string} SHA224 哈希值
 */
export function sha224(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.SHA224(message).toString();
}

/**
 * SHA384 哈希
 * @param {string} message - 原始消息
 * @returns {string} SHA384 哈希值
 */
export function sha384(message) {
  if (!message) {
    throw new Error('Message is required');
  }
  return CryptoJS.SHA384(message).toString();
}

/**
 * 文件 MD5 哈希
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} MD5 哈希值
 */
export async function fileMd5(file) {
  if (!file) {
    throw new Error('File is required');
  }
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.MD5(wordArray).toString();
}

/**
 * 文件 SHA1 哈希
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} SHA1 哈希值
 */
export async function fileSha1(file) {
  if (!file) {
    throw new Error('File is required');
  }
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA1(wordArray).toString();
}

/**
 * 文件 SHA256 哈希
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} SHA256 哈希值
 */
export async function fileSha256(file) {
  if (!file) {
    throw new Error('File is required');
  }
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA256(wordArray).toString();
}

/**
 * 文件 SHA512 哈希
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} SHA512 哈希值
 */
export async function fileSha512(file) {
  if (!file) {
    throw new Error('File is required');
  }
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA512(wordArray).toString();
}

/**
 * HMAC-SHA256 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} HMAC 哈希值
 */
export function hmacSha256(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  return CryptoJS.HmacSHA256(message, keyUtf8).toString();
}

/**
 * HMAC-SHA512 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} HMAC 哈希值
 */
export function hmacSha512(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  return CryptoJS.HmacSHA512(message, keyUtf8).toString();
}

/**
 * HMAC-MD5 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} HMAC 哈希值
 */
export function hmacMd5(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  return CryptoJS.HmacMD5(message, keyUtf8).toString();
}

/**
 * PBKDF2 密钥派生
 * @param {string} password - 密码
 * @param {string} salt - 盐
 * @param {number} iterations - 迭代次数
 * @param {number} keySize - 密钥长度（字）
 * @returns {string} 派生密钥
 */
export function pbkdf2(password, salt, iterations = 10000, keySize = 8) {
  if (!password || !salt) {
    throw new Error('Password and salt are required');
  }
  const saltUtf8 = CryptoJS.enc.Utf8.parse(salt);
  const key = CryptoJS.PBKDF2(password, saltUtf8, {
    keySize: keySize,
    iterations: iterations,
  });
  return key.toString();
}

export default {
  md5,
  sha1,
  sha256,
  sha512,
  sha224,
  sha384,
  fileMd5,
  fileSha1,
  fileSha256,
  fileSha512,
  hmacSha256,
  hmacSha512,
  hmacMd5,
  pbkdf2,
};
