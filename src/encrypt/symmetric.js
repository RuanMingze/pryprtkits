/**
 * 对称加密工具集
 * 包含 AES、DES、3DES、RC4 等加密算法
 */
import CryptoJS from 'crypto-js';

/**
 * AES 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function aesEncrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  const encrypted = CryptoJS.AES.encrypt(message, keyUtf8, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: keyUtf8,
  });
  return encrypted.toString();
}

/**
 * AES 解密
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function aesDecrypt(ciphertext, key) {
  if (!ciphertext || !key) {
    throw new Error('Ciphertext and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyUtf8, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: keyUtf8,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * DES 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function desEncrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(8, '0').slice(0, 8));
  const encrypted = CryptoJS.DES.encrypt(message, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * DES 解密
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function desDecrypt(ciphertext, key) {
  if (!ciphertext || !key) {
    throw new Error('Ciphertext and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(8, '0').slice(0, 8));
  const decrypted = CryptoJS.DES.decrypt(ciphertext, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 3DES 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function tripleDesEncrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(24, '0').slice(0, 24));
  const encrypted = CryptoJS.TripleDES.encrypt(message, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * 3DES 解密
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function tripleDesDecrypt(ciphertext, key) {
  if (!ciphertext || !key) {
    throw new Error('Ciphertext and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(24, '0').slice(0, 24));
  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyUtf8, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * RC4 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function rc4Encrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.RC4.encrypt(message, keyUtf8);
  return encrypted.toString();
}

/**
 * RC4 解密
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function rc4Decrypt(ciphertext, key) {
  if (!ciphertext || !key) {
    throw new Error('Ciphertext and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.RC4.decrypt(ciphertext, keyUtf8);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Rabbit 加密
 * @param {string} message - 原始消息
 * @param {string} key - 密钥
 * @returns {string} 加密后的字符串
 */
export function rabbitEncrypt(message, key) {
  if (!message || !key) {
    throw new Error('Message and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.Rabbit.encrypt(message, keyUtf8);
  return encrypted.toString();
}

/**
 * Rabbit 解密
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 解密后的字符串
 */
export function rabbitDecrypt(ciphertext, key) {
  if (!ciphertext || !key) {
    throw new Error('Ciphertext and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.Rabbit.decrypt(ciphertext, keyUtf8);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 文件 AES 加密
 * @param {File} file - 文件对象
 * @param {string} key - 密钥
 * @returns {Promise<{data: string, name: string}>} 加密后的文件数据
 */
export async function encryptFile(file, key) {
  if (!file || !key) {
    throw new Error('File and key are required');
  }
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  const encrypted = CryptoJS.AES.encrypt(wordArray, keyUtf8, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: keyUtf8,
  });
  return {
    data: encrypted.toString(),
    name: file.name + '.enc',
  };
}

/**
 * 文件 AES 解密
 * @param {string} encryptedData - 加密数据
 * @param {string} key - 密钥
 * @param {string} originalName - 原始文件名
 * @returns {Promise<Blob>} 解密后的文件
 */
export async function decryptFile(encryptedData, key, originalName) {
  if (!encryptedData || !key) {
    throw new Error('Encrypted data and key are required');
  }
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyUtf8, {
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
  return new Blob([u8arr], { type: 'application/octet-stream' });
}

export default {
  aesEncrypt,
  aesDecrypt,
  desEncrypt,
  desDecrypt,
  tripleDesEncrypt,
  tripleDesDecrypt,
  rc4Encrypt,
  rc4Decrypt,
  rabbitEncrypt,
  rabbitDecrypt,
  encryptFile,
  decryptFile,
};
