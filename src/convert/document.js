/**
 * 文档转换工具集
 * 包含 PDF、TXT、MD、Excel、CSV 等文档格式转换
 */

/**
 * TXT 转 Markdown
 * @param {string} text - TXT 文本内容
 * @returns {string} Markdown 格式文本
 */
export function txtToMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^#(.*)/gm, '#$1')
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '*$1*')
    .replace(/`(.*?)`/g, '`$1`')
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Markdown 转 TXT
 * @param {string} markdown - Markdown 文本
 * @returns {string} 纯文本
 */
export function markdownToTxt(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/#{1,6}\s*(.*)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[\s\S]*?`/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Excel (CSV) 转 CSV
 * @param {Array<Array<any>>} data - 二维数组数据
 * @returns {string} CSV 格式字符串
 */
export function excelToCsv(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  return data.map(row => {
    return row.map(cell => {
      const str = String(cell ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  }).join('\n');
}

/**
 * CSV 转 Excel (二维数组)
 * @param {string} csv - CSV 字符串
 * @returns {Array<Array<string>>} 二维数组
 */
export function csvToExcel(csv) {
  if (!csv) return [];
  
  const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
  const result = [];
  
  for (const line of lines) {
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    row.push(current);
    result.push(row);
  }
  
  return result;
}

/**
 * JSON 转 CSV
 * @param {Array<Object>|Object} jsonData - JSON 数据
 * @returns {string} CSV 格式字符串
 */
export function jsonToCsv(jsonData) {
  if (!jsonData) return '';
  
  const data = Array.isArray(jsonData) ? jsonData : [jsonData];
  if (data.length === 0) return '';
  
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  
  const rows = data.map(obj => {
    return keys.map(key => {
      const value = String(obj[key] ?? '');
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

/**
 * CSV 转 JSON
 * @param {string} csv - CSV 字符串
 * @returns {Array<Object>} JSON 数组
 */
export function csvToJson(csv) {
  const rows = csvToExcel(csv);
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const result = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j] || '';
    }
    
    result.push(obj);
  }
  
  return result;
}

/**
 * 文本转 Base64
 * @param {string} text - 文本
 * @returns {string} Base64 编码
 */
export function textToBase64(text) {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    return btoa(text);
  }
}

/**
 * Base64 转文本
 * @param {string} base64 - Base64 编码
 * @returns {string} 原始文本
 */
export function base64ToText(base64) {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return atob(base64);
  }
}

/**
 * 文件转 Base64
 * @param {File|Blob} file - 文件对象
 * @returns {Promise<string>} Base64 字符串
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(typeof result === 'string' ? result.split(',')[1] || result : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Base64 转 File
 * @param {string} base64 - Base64 字符串
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME 类型
 * @returns {File} File 对象
 */
export function base64ToFile(base64, filename, mimeType) {
  const arr = base64.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || mimeType || 'application/octet-stream';
  const bstr = atob(arr[1] || arr[0]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * URL 编码
 * @param {string} text - 文本
 * @returns {string} 编码后的字符串
 */
export function urlEncode(text) {
  return encodeURIComponent(text);
}

/**
 * URL 解码
 * @param {string} text - 编码后的字符串
 * @returns {string} 解码后的文本
 */
export function urlDecode(text) {
  return decodeURIComponent(text);
}

/**
 * HTML 转义
 * @param {string} html - HTML 字符串
 * @returns {string} 转义后的字符串
 */
export function htmlEscape(html) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return html.replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * HTML 反转义
 * @param {string} text - 文本
 * @returns {string} 反转义后的 HTML
 */
export function htmlUnescape(text) {
  const unescapeMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, match => unescapeMap[match]);
}

/**
 * Unicode 转中文
 * @param {string} unicode - Unicode 字符串
 * @returns {string} 中文字符串
 */
export function unicodeToChinese(unicode) {
  return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

/**
 * 中文转 Unicode
 * @param {string} chinese - 中文字符串
 * @returns {string} Unicode 字符串
 */
export function chineseToUnicode(chinese) {
  return chinese.replace(/[\u4E00-\u9FA5]/g, char => {
    return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
  });
}

/**
 * 全角转半角
 * @param {string} str - 全角字符串
 * @returns {string} 半角字符串
 */
export function fullToHalf(str) {
  return str.replace(/[\uFF01-\uFF5E]/g, char => {
    return String.fromCharCode(char.charCodeAt(0) - 65248);
  }).replace(/\u3000/g, ' ');
}

/**
 * 半角转全角
 * @param {string} str - 半角字符串
 * @returns {string} 全角字符串
 */
export function halfToFull(str) {
  return str.replace(/[\u0021-\u007E]/g, char => {
    return String.fromCharCode(char.charCodeAt(0) + 65248);
  }).replace(/ /g, '\u3000');
}

/**
 * 时间戳转日期
 * @param {number} timestamp - 时间戳
 * @param {string} format - 格式
 * @returns {string} 格式化日期
 */
export function timestampToDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 日期转时间戳
 * @param {string|Date} date - 日期
 * @returns {number} 时间戳
 */
export function dateToTimestamp(date) {
  return new Date(date).getTime();
}

/**
 * 文件大小格式化
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 移除 HTML 标签
 * @param {string} html - HTML 字符串
 * @returns {string} 纯文本
 */
export function removeHtmlTags(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * 提取 HTML 中的文本
 * @param {string} html - HTML 字符串
 * @returns {string} 提取的文本
 */
export function extractTextFromHtml(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

export default {
  txtToMarkdown,
  markdownToTxt,
  excelToCsv,
  csvToExcel,
  jsonToCsv,
  csvToJson,
  textToBase64,
  base64ToText,
  fileToBase64,
  base64ToFile,
  urlEncode,
  urlDecode,
  htmlEscape,
  htmlUnescape,
  unicodeToChinese,
  chineseToUnicode,
  fullToHalf,
  halfToFull,
  timestampToDate,
  dateToTimestamp,
  formatFileSize,
  removeHtmlTags,
  extractTextFromHtml,
};
