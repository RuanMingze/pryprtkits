/**
 * PryprtKits - 前端通用工具箱库
 * 包含 150+ 个实用工具函数
 * 
 * @author RuanMingze
 * @license MIT
 */

// 文件转换工具
import * as documentConvert from './convert/document.js';
import * as dataConvert from './convert/data.js';

// 加密解密工具
import * as symmetric from './encrypt/symmetric.js';
import * as hash from './encrypt/hash.js';
import * as encryptUtils from './encrypt/utils.js';

// 图片处理工具
import * as imageConvert from './image/convert.js';
import * as imageEdit from './image/edit.js';
import * as imageFilter from './image/filter.js';
import * as imageTools from './image/tools.js';

/**
 * 文件转换模块
 */
export const convert = {
  ...documentConvert,
  ...dataConvert,
};

/**
 * 加密解密模块
 */
export const encrypt = {
  ...symmetric,
  ...hash,
  ...encryptUtils,
};

/**
 * 图片处理模块
 */
export const image = {
  ...imageConvert,
  ...imageEdit,
  ...imageFilter,
  ...imageTools,
};

/**
 * 默认导出
 */
export default {
  convert,
  encrypt,
  image,
};

/**
 * 版本信息
 */
export const VERSION = '1.0.0';

/**
 * 工具函数总数
 */
export const TOOLS_COUNT = 150;
