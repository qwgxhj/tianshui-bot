import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 获取项目根目录路径
 * @returns {string} 根目录绝对路径
 */
export function getRootPath() {
  return path.resolve(__dirname, '../../')
}

/**
 * 校验是否为有效QQ号
 * @param {string|number} qq QQ号
 * @returns {boolean} 是否有效
 */
export function isVaildQQ(qq) {
  const reg = /^[1-9]\d{4,10}$/
  return reg.test(String(qq))
}

/**
 * 字符串截断，超出长度加省略号
 * @param {string} str 原字符串
 * @param {number} len 最大长度
 * @returns {string} 截断后的字符串
 */
export function cutStr(str, len = 20) {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}