import WebSocket from 'ws'
import axios from 'axios'
import { logger } from './logger.js'
import { CONFIG } from '../config.js'

let wsClient = null // NapCat WebSocket实例
const napcatAxios = axios.create({
  baseURL: process.env.NAPCAT_BASE_URL,
  timeout: 5000
})

/**
 * 发送消息到QQ（全局通用方法，插件可直接调用）
 * @param {number} target 目标：QQ号/群号
 * @param {string} message 消息内容
 * @param {string} type 类型：private(私聊)/group(群聊)
 * @returns {Promise<boolean>} 是否发送成功
 */
export async function sendMsg(target, message, type = 'private') {
  try {
    await napcatAxios.post('/send_msg', {
      message_type: type,
      user_id: type === 'private' ? target : null,
      group_id: type === 'group' ? target : null,
      message
    })
    logger.info(`📤 消息发送成功 → [${type}] ${target}：${message.slice(0, 20)}...`)
    return true
  } catch (err) {
    logger.error(`❌ 消息发送失败 → [${type}] ${target}，原因：${err.response?.data?.msg || err.message}`)
    return false
  }
}

/**
 * 消息预处理：格式化消息对象，统一插件入参格式
 * @param {object} rawMsg NapCat原始消息对象
 * @returns {object} 格式化后的消息对象
 */
function formatMsg(rawMsg) {
  return {
    msgId: rawMsg.message_id,
    type: rawMsg.message_type, // private/group
    sender: {
      id: rawMsg.sender.user_id,
      name: rawMsg.sender.nickname,
      card: rawMsg.sender.card || '' // 群名片
    },
    target: rawMsg.message_type === 'private' ? rawMsg.sender.user_id : rawMsg.group_id,
    content: rawMsg.raw_message, // 原始消息内容
    raw: rawMsg // 原始消息对象，备用
  }
}

/**
 * 插件调度核心：遍历所有插件，执行消息处理方法
 * @param {object} msg 格式化后的消息对象
 */
async function dispatchPluginHandle(msg) {
  if (global.plugins.length === 0) return
  for (const { name, module } of global.plugins) {
    try {
      if (typeof module.handleMsg === 'function') {
        // 给插件绑定超时控制，防止单个插件阻塞全局
        await Promise.race([
          module.handleMsg(msg, sendMsg),
          new Promise((_, reject) => setTimeout(() => reject(new Error('处理超时')), CONFIG.MSG_HANDLE_TIMEOUT))
        ])
      }
    } catch (err) {
      logger.error(`❌ 插件[${name}]处理消息失败 → ${err.message}`)
    }
  }
}

/**
 * 初始化NapCat WebSocket连接，监听消息事件
 */
export async function initNapCatWS() {
  const wsUrl = process.env.NAPCAT_WS_URL
  return new Promise((resolve, reject) => {
    wsClient = new WebSocket(wsUrl)
    // 连接成功
    wsClient.on('open', () => {
      logger.info(`✅ NapCat WebSocket连接成功 → ${wsUrl}`)
      resolve()
    })
    // 接收消息
    wsClient.on('message', (data) => {
      const rawMsg = JSON.parse(data.toString())
      // 仅处理消息事件，过滤其他事件
      if (rawMsg.post_type !== 'message') return
      // 忽略自身消息
      if (CONFIG.IGNORE_SELF_MSG && rawMsg.sender.user_id === Number(process.env.BOT_QQ)) return
      // 格式化消息 + 调度插件
      const msg = formatMsg(rawMsg)
      logger.info(`📥 收到消息 → [${msg.type}] ${msg.sender.name}(${msg.sender.id})：${msg.content}`)
      dispatchPluginHandle(msg)
    })
    // 连接关闭
    wsClient.on('close', (code, reason) => {
      logger.error(`❌ NapCat WebSocket连接关闭 → 码：${code}，原因：${reason}`)
      process.exit(1)
    })
    // 连接错误
    wsClient.on('error', (err) => {
      logger.error(`❌ NapCat WebSocket连接失败 → ${err.message}`)
      reject(err)
    })
  })
}