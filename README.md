# PryprtKits

前端通用工具箱库，包含 150+ 个实用工具函数。

## 特性

- 📦 **150+ 工具函数** - 覆盖文件转换、加密解密、图片处理三大模块
- 🚀 **纯前端运行** - 无需后端，浏览器即可运行
- 🔐 **安全可靠** - 基于 crypto-js 等标准库
- 📱 **响应式支持** - 支持移动端和桌面端
- 🎯 **易于使用** - 简洁的 API 设计

## 安装

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 编译

```bash
# 生产环境编译
pnpm run build

# 开发环境编译
pnpm run build:dev

# 监听模式
pnpm run watch
```

## 使用方式

### 1. 浏览器引入

```html
<!-- CDN 引入 -->
<script src="https://unpkg.com/pryprtkits/dist/pryprtkits.min.js"></script>
<script>
  const { convert, encrypt, image } = PryprtKits;
  
  // AES 加密
  const encrypted = encrypt.aesEncrypt('Hello', 'mySecretKey');
  
  // MD5 哈希
  const hash = encrypt.md5('Hello World');
  
  // 图片压缩
  const compressed = await image.compressImage(file, 0.7);
</script>
```

### 2. ES6 模块引入

```javascript
import PryprtKits from 'pryprtkits';

const { convert, encrypt, image } = PryprtKits;

// 使用工具函数
const encrypted = encrypt.aesEncrypt('message', 'key');
const yaml = convert.jsonToYaml({ name: 'test' });
```

### 3. CommonJS 引入

```javascript
const PryprtKits = require('pryprtkits');

const { convert, encrypt, image } = PryprtKits;
```

## API 文档

### 文件转换模块 (convert)

#### 文档转换
- `txtToMarkdown(text)` - TXT 转 Markdown
- `markdownToTxt(markdown)` - Markdown 转 TXT
- `excelToCsv(data)` - Excel 转 CSV
- `csvToExcel(csv)` - CSV 转 Excel
- `jsonToCsv(jsonData)` - JSON 转 CSV
- `csvToJson(csv)` - CSV 转 JSON

#### 数据格式转换
- `jsonToYaml(json, indent)` - JSON 转 YAML
- `yamlToJson(yaml)` - YAML 转 JSON
- `jsonToXml(json, rootName)` - JSON 转 XML
- `xmlToJson(xml)` - XML 转 JSON
- `markdownToHtml(markdown)` - Markdown 转 HTML
- `htmlToMarkdown(html)` - HTML 转 Markdown

#### 编码转换
- `textToBase64(text)` - 文本转 Base64
- `base64ToText(base64)` - Base64 转文本
- `fileToBase64(file)` - 文件转 Base64
- `base64ToFile(base64, filename, mimeType)` - Base64 转文件
- `urlEncode(text)` - URL 编码
- `urlDecode(text)` - URL 解码
- `htmlEscape(html)` - HTML 转义
- `htmlUnescape(text)` - HTML 反转义
- `unicodeToChinese(unicode)` - Unicode 转中文
- `chineseToUnicode(chinese)` - 中文转 Unicode
- `fullToHalf(str)` - 全角转半角
- `halfToFull(str)` - 半角转全角

#### 实用工具
- `timestampToDate(timestamp, format)` - 时间戳转日期
- `dateToTimestamp(date)` - 日期转时间戳
- `formatFileSize(bytes, decimals)` - 文件大小格式化
- `removeHtmlTags(html)` - 移除 HTML 标签
- `extractTextFromHtml(html)` - 提取 HTML 文本
- `objectToQueryString(obj)` - 对象转查询字符串
- `queryStringToObject(queryString)` - 查询字符串转对象
- `camelToKebab(str)` - 驼峰转短横线
- `kebabToCamel(str)` - 短横线转驼峰
- `snakeToCamel(str)` - 下划线转驼峰
- `camelToSnake(str)` - 驼峰转下划线

### 加密解密模块 (encrypt)

#### 对称加密
- `aesEncrypt(message, key)` - AES 加密
- `aesDecrypt(ciphertext, key)` - AES 解密
- `desEncrypt(message, key)` - DES 加密
- `desDecrypt(ciphertext, key)` - DES 解密
- `tripleDesEncrypt(message, key)` - 3DES 加密
- `tripleDesDecrypt(ciphertext, key)` - 3DES 解密
- `rc4Encrypt(message, key)` - RC4 加密
- `rc4Decrypt(ciphertext, key)` - RC4 解密
- `rabbitEncrypt(message, key)` - Rabbit 加密
- `rabbitDecrypt(ciphertext, key)` - Rabbit 解密
- `encryptFile(file, key)` - 文件加密
- `decryptFile(encryptedData, key, originalName)` - 文件解密

#### 哈希算法
- `md5(message)` - MD5 哈希
- `sha1(message)` - SHA1 哈希
- `sha256(message)` - SHA256 哈希
- `sha512(message)` - SHA512 哈希
- `sha224(message)` - SHA224 哈希
- `sha384(message)` - SHA384 哈希
- `fileMd5(file)` - 文件 MD5
- `fileSha1(file)` - 文件 SHA1
- `fileSha256(file)` - 文件 SHA256
- `fileSha512(file)` - 文件 SHA512
- `hmacSha256(message, key)` - HMAC-SHA256
- `hmacSha512(message, key)` - HMAC-SHA512
- `hmacMd5(message, key)` - HMAC-MD5
- `pbkdf2(password, salt, iterations, keySize)` - PBKDF2 密钥派生

#### 加密工具
- `xorEncrypt(message, key)` - 异或加密
- `xorDecrypt(encrypted, key)` - 异或解密
- `generatePassword(length, options)` - 生成随机密码
- `generateSecretKey(length)` - 生成随机密钥
- `generateSalt(length)` - 生成随机盐
- `checkPasswordStrength(password)` - 密码强度检测
- `base64UrlEncode(str)` - Base64 URL 安全编码
- `base64UrlDecode(str)` - Base64 URL 安全解码
- `encryptText(text, key, algorithm)` - 文本加密
- `decryptText(encrypted, key, algorithm)` - 文本解密
- `encryptFileChunks(file, key, chunkSize)` - 文件分块加密
- `decryptFileChunks(chunks, key)` - 文件分块解密

### 图片处理模块 (image)

#### 格式转换
- `imageToJpg(source, quality)` - 转 JPG
- `imageToPng(source)` - 转 PNG
- `imageToWebp(source, quality)` - 转 WebP
- `imageToGif(source)` - 转 GIF
- `imageToBmp(source)` - 转 BMP
- `imageToIco(source, size)` - 转 ICO
- `batchConvertImages(files, format, quality)` - 批量转换
- `convertImageFormat(source, format, quality)` - 通用格式转换
- `getImageInfo(source)` - 获取图片信息

#### 图片编辑
- `compressImage(source, quality, format)` - 压缩图片
- `cropImage(source, options)` - 裁剪图片
- `rotateImage(source, angle)` - 旋转图片
- `scaleImage(source, options)` - 缩放图片
- `addWatermark(source, options)` - 添加水印
- `roundCorners(source, radius)` - 圆角
- `cropToCircle(source)` - 裁剪成圆形

#### 图片美化
- `grayscaleImage(source)` - 灰度
- `binaryImage(source, threshold)` - 二值化
- `invertImage(source)` - 反色
- `adjustBrightness(source, brightness)` - 调整亮度
- `adjustContrast(source, contrast)` - 调整对比度
- `adjustSaturation(source, saturation)` - 调整饱和度
- `adjustHue(source, hue)` - 调整色相
- `blurImage(source, radius)` - 模糊
- `sharpenImage(source, strength)` - 锐化
- `denoiseImage(source, strength)` - 降噪
- `vintageFilter(source)` - 复古滤镜
- `coldFilter(source)` - 冷色滤镜
- `warmFilter(source)` - 暖色滤镜

#### 图片工具
- `getColorFromImage(source, x, y)` - 取色器
- `stitchImagesHorizontally(sources, backgroundColor)` - 水平拼接
- `stitchImagesVertically(sources, backgroundColor)` - 垂直拼接
- `stitchImagesGrid(sources, options)` - 网格拼接
- `generateQRCode(text, options)` - 生成二维码
- `generateQRCodeImage(text, options)` - 生成二维码图片
- `cropToSize(source, width, height, fit)` - 裁剪到指定尺寸
- `addBorder(source, options)` - 添加边框

## 示例

### 加密解密

```javascript
// AES 加密解密
const encrypted = encrypt.aesEncrypt('Hello World', 'mySecretKey123456');
const decrypted = encrypt.aesDecrypt(encrypted, 'mySecretKey123456');

// MD5 哈希
const hash = encrypt.md5('Hello World');

// SHA256 哈希
const sha256 = encrypt.sha256('Hello World');

// 生成密码
const password = encrypt.generatePassword(16, {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
});

// 密码强度检测
const strength = encrypt.checkPasswordStrength('MyStr0ngP@ss!');
```

### 文件转换

```javascript
// JSON 转 YAML
const yaml = convert.jsonToYaml({ name: 'test', value: 123 });

// Markdown 转 HTML
const html = convert.markdownToHtml('# Hello\n**Bold** text');

// Base64 编码
const base64 = convert.textToBase64('Hello World');

// URL 编码
const encoded = convert.urlEncode('Hello 世界');
```

### 图片处理

```javascript
// 压缩图片
const compressed = await image.compressImage(file, 0.7);

// 裁剪图片
const cropped = await image.cropImage(file, {
  x: 10,
  y: 10,
  width: 100,
  height: 100,
});

// 添加水印
const watermarked = await image.addWatermark(file, {
  text: '© 2024',
  position: 'bottom-right',
  fontSize: 24,
});

// 生成二维码
const qrCanvas = await image.generateQRCode('https://example.com');
```

## 浏览器支持

- Chrome >= 60
- Firefox >= 55
- Safari >= 12
- Edge >= 79
- iOS >= 12
- Android >= 6

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 链接

- [GitHub](https://github.com/RuanMingze/pryprtkits)
- [示例页面](examples/index.html)
