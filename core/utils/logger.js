import winston from 'winston'
import fs from 'fs-extra'
import path from 'path'
import { CONFIG } from '../config.js'

// 日志目录创建
if (CONFIG.LOG_SAVE_FILE && !fs.existsSync(CONFIG.LOG_FILE_PATH)) {
  fs.mkdirSync(CONFIG.LOG_FILE_PATH, { recursive: true })
}

// 日志格式配置
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`
  })
)

// 日志传输配置
const transports = [new winston.transports.Console()]
// 开启文件日志则追加文件传输
if (CONFIG.LOG_SAVE_FILE) {
  transports.push(
    new winston.transports.File({
      filename: path.join(CONFIG.LOG_FILE_PATH, 'bot.log'),
      maxsize: 1024 * 1024 * 5, // 单文件5MB
      maxFiles: 3 // 最多保留3个日志文件
    })
  )
}

// 创建日志实例并导出
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports
})