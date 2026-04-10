/**
 * 数据格式转换工具集
 * 包含 JSON、YAML、XML、HTML 等格式互转
 */

/**
 * JSON 转 YAML
 * @param {Object|Array} json - JSON 对象
 * @param {number} indent - 缩进
 * @returns {string} YAML 字符串
 */
export function jsonToYaml(json, indent = 0) {
  let yaml = '';
  const spaces = '  '.repeat(indent);
  
  if (Array.isArray(json)) {
    for (const item of json) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}- ${jsonToYaml(item, indent + 1).trimStart()}`;
      } else {
        yaml += `${spaces}- ${formatYamlValue(item)}\n`;
      }
    }
  } else if (typeof json === 'object' && json !== null) {
    const entries = Object.entries(json);
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries;
      if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${formatYamlValue(value)}\n`;
      }
    }
  }
  
  return yaml;
}

function formatYamlValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return '~';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes(':') || value.includes('#') || value.includes("'") || value.startsWith(' ') || value.endsWith(' ')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  return String(value);
}

/**
 * YAML 转 JSON
 * @param {string} yaml - YAML 字符串
 * @returns {Object|Array} JSON 对象
 */
export function yamlToJson(yaml) {
  const lines = yaml.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const result = {};
  const stack = [{ obj: result, indent: -1 }];
  
  for (const line of lines) {
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;
    const content = line.trim();
    
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const current = stack[stack.length - 1].obj;
    
    if (content.startsWith('- ')) {
      const arrayContent = content.slice(2).trim();
      if (!Array.isArray(current)) {
        throw new Error('Invalid YAML format');
      }
      
      if (arrayContent.includes(':')) {
        const obj = {};
        const [key, ...valueParts] = arrayContent.split(':');
        const value = valueParts.join(':').trim();
        obj[key.trim()] = parseYamlValue(value);
        current.push(obj);
        stack.push({ obj, indent });
      } else {
        current.push(parseYamlValue(arrayContent));
      }
    } else if (content.includes(':')) {
      const [key, ...valueParts] = content.split(':');
      const value = valueParts.join(':').trim();
      const keyName = key.trim();
      
      if (value === '') {
        const newObj = {};
        current[keyName] = newObj;
        stack.push({ obj: newObj, indent });
      } else {
        current[keyName] = parseYamlValue(value);
      }
    }
  }
  
  return result;
}

function parseYamlValue(value) {
  if (value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '') return '';
  
  const num = Number(value);
  if (!isNaN(num)) return num;
  
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  return value;
}

/**
 * JSON 转 XML
 * @param {Object|Array} json - JSON 对象
 * @param {string} rootName - 根元素名称
 * @returns {string} XML 字符串
 */
export function jsonToXml(json, rootName = 'root') {
  let xml = '';
  
  if (Array.isArray(json)) {
    for (const item of json) {
      xml += `<${rootName}>${convertJsonToXml(item, rootName)}</${rootName}>`;
    }
  } else if (typeof json === 'object' && json !== null) {
    xml = `<${rootName}>`;
    for (const [key, value] of Object.entries(json)) {
      xml += convertJsonToXml(value, key);
    }
    xml += `</${rootName}>`;
  } else {
    xml = `<${rootName}>${escapeXml(String(json))}</${rootName}>`;
  }
  
  return xml;
}

function convertJsonToXml(value, tagName) {
  if (value === null || value === undefined) {
    return `<${tagName}/>`;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => convertJsonToXml(item, tagName)).join('');
  }
  
  if (typeof value === 'object') {
    let xml = `<${tagName}>`;
    for (const [key, val] of Object.entries(value)) {
      xml += convertJsonToXml(val, key);
    }
    xml += `</${tagName}>`;
    return xml;
  }
  
  return `<${tagName}>${escapeXml(String(value))}</${tagName}>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * XML 转 JSON
 * @param {string} xml - XML 字符串
 * @returns {Object} JSON 对象
 */
export function xmlToJson(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const error = parser.getErrorFromStream?.() || doc.querySelector('parsererror');
  
  if (error) {
    throw new Error('Invalid XML');
  }
  
  return xmlNodeToJson(doc.documentElement);
}

function xmlNodeToJson(node) {
  const obj = {};
  
  if (node.attributes && node.attributes.length > 0) {
    obj['@attributes'] = {};
    for (const attr of node.attributes) {
      obj['@attributes'][attr.name] = attr.value;
    }
  }
  
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = child.textContent.trim();
      if (text) {
        if (Object.keys(obj).length === 0) {
          return text;
        }
        obj['#text'] = text;
      }
    } else if (child.nodeType === 1) {
      const childJson = xmlNodeToJson(child);
      if (obj[child.nodeName]) {
        if (!Array.isArray(obj[child.nodeName])) {
          obj[child.nodeName] = [obj[child.nodeName]];
        }
        obj[child.nodeName].push(childJson);
      } else {
        obj[child.nodeName] = childJson;
      }
    }
  }
  
  return Object.keys(obj).length === 0 ? '' : obj;
}

/**
 * Markdown 转 HTML
 * @param {string} markdown - Markdown 文本
 * @returns {string} HTML 字符串
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // 代码块
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${htmlEscape(code.trim())}</code></pre>`;
  });
  
  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 标题
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 粗体和斜体
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 删除线
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // 链接和图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // 引用
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // 无序列表
  html = html.replace(/^[-*+] (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // 有序列表
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // 水平线
  html = html.replace(/^---$/gim, '<hr>');
  
  // 换行
  html = html.replace(/\n/g, '<br>');
  
  // 清理多余的 blockquote 和列表标签
  html = html.replace(/<\/blockquote><blockquote>/g, '<br>');
  html = html.replace(/<\/li><li>/g, '');
  
  return html;
}

/**
 * HTML 转 Markdown
 * @param {string} html - HTML 字符串
 * @returns {string} Markdown 文本
 */
export function htmlToMarkdown(html) {
  if (!html) return '';
  
  let md = html;
  
  // 移除 script 和 style
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // 标题
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  
  // 粗体和斜体
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // 链接和图片
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // 代码
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, code) => {
    return '```\n' + code.replace(/<[^>]*>/g, '') + '\n```\n';
  });
  
  // 引用
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
  
  // 列表
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1');
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '$1');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  
  // 段落和换行
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br[^>]*>/gi, '\n');
  md = md.replace(/<hr[^>]*>/gi, '---\n');
  
  // 删除线
  md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
  
  // 移除剩余标签
  md = md.replace(/<[^>]*>/g, '');
  
  // 清理空白
  md = md.replace(/\n{3,}/g, '\n\n');
  
  return md.trim();
}

/**
 * 对象转查询字符串
 * @param {Object} obj - 对象
 * @returns {string} 查询字符串
 */
export function objectToQueryString(obj) {
  if (!obj || typeof obj !== 'object') return '';
  
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

/**
 * 查询字符串转对象
 * @param {string} queryString - 查询字符串
 * @returns {Object} 对象
 */
export function queryStringToObject(queryString) {
  if (!queryString) return {};
  
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  return query.split('&').reduce((obj, pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      obj[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
    return obj;
  }, {});
}

/**
 * 驼峰转短横线
 * @param {string} str - 驼峰字符串
 * @returns {string} 短横线字符串
 */
export function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 短横线转驼峰
 * @param {string} str - 短横线字符串
 * @returns {string} 驼峰字符串
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * 下划线转驼峰
 * @param {string} str - 下划线字符串
 * @returns {string} 驼峰字符串
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * 驼峰转下划线
 * @param {string} str - 驼峰字符串
 * @returns {string} 下划线字符串
 */
export function camelToSnake(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export default {
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  markdownToHtml,
  htmlToMarkdown,
  objectToQueryString,
  queryStringToObject,
  camelToKebab,
  kebabToCamel,
  snakeToCamel,
  camelToSnake,
};
