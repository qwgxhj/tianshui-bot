import 'dotenv/config'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { logger } from './utils/logger.js'
import { initNapCatWS, sendMsg } from './utils/message.js'
import { PLUGIN_WHITE_LIST } from './config.js'

// 全局常量定义
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLUGIN_DIR = path.resolve(__dirname, '../', process.env.PLUGIN_DIR)
const BOT_NAME = process.env.BOT_NAME
global.botConfig = { sendMsg, cmdPrefix: process.env.BOT_CMD_PREFIX }
global.plugins = [] // 全局插件池，所有插件存入此处

/**
 * 无侵入式插件加载核心
 * 自动扫描plugins目录，仅加载白名单内插件，无需修改任何代码
 */
async function loadAllPlugins() {
  logger.info(`[${BOT_NAME}] 开始扫描插件目录：${PLUGIN_DIR}`)
  // 校验插件目录是否存在，不存在则自动创建
  if (!fs.existsSync(PLUGIN_DIR)) {
    fs.mkdirSync(PLUGIN_DIR, { recursive: true })
    logger.warn(`插件目录不存在，已自动创建 → ${PLUGIN_DIR}`)
    return
  }
  // 扫描插件目录下所有文件夹
  const pluginFolders = fs.readdirSync(PLUGIN_DIR)
    .filter(item => fs.statSync(path.join(PLUGIN_DIR, item)).isDirectory())
    .filter(item => PLUGIN_WHITE_LIST.includes(item) || PLUGIN_WHITE_LIST[0] === '*')

  // 逐个加载插件
  for (const folder of pluginFolders) {
    const pluginEntry = path.join(PLUGIN_DIR, folder, 'index.js')
    if (!fs.existsSync(pluginEntry)) {
      logger.warn(`插件[${folder}]缺少入口文件index.js，跳过加载`)
      continue
    }
    try {
      const pluginModule = await import(`file://${pluginEntry}`)
      global.plugins.push({ name: folder, module: pluginModule })
      // 执行插件初始化方法（可选）
      if (typeof pluginModule.init === 'function') {
        await pluginModule.init()
      }
      logger.info(`✅ 插件加载成功 → [${folder}]`)
    } catch (err) {
      logger.error(`❌ 插件加载失败 → [${folder}]，原因：${err.message}`)
    }
  }
  logger.info(`✅ 插件加载完成，共加载 ${global.plugins.length} 个插件`)
}

/**
 * 机器人启动主方法
 */
async function startBot() {
  logger.info(`\n==================== ${BOT_NAME} 启动中 ====================`)
  try {
    await loadAllPlugins() // 1. 加载所有插件
    await initNapCatWS()   // 2. 连接NapCat WebSocket
    logger.info(`✅ ${BOT_NAME} 启动成功，等待消息监听...`)
  } catch (err) {
    logger.error(`❌ ${BOT_NAME} 启动失败 → ${err.message}`)
    process.exit(1) // 启动失败退出进程
  }
}

// 执行启动
startBot()