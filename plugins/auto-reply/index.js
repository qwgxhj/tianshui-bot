/**
 * 自动回复插件 - tianshui-bot
 * 插件特性：关键词触发自动回复，无侵入式加载
 * 开发规范：暴露init(可选)、handleMsg(必选)方法
 */
export function init() {
  // 插件初始化逻辑：仅启动时执行一次
  console.log('🔧 [auto-reply] 自动回复插件初始化完成')
}

/**
 * 消息处理核心方法
 * @param {object} msg 格式化后的消息对象
 * @param {function} sendMsg 全局消息发送方法
 */
export async function handleMsg(msg, sendMsg) {
  const { content, target, type } = msg
  const replyMap = {
    '你好': `👋 你好呀！我是${process.env.BOT_NAME}，发送【${process.env.BOT_CMD_PREFIX}help】查看指令~`,
    '机器人': '🤖 我是基于NapCat开发的插件化QQ机器人，支持热插拔扩展~',
    '天水': '🌊 天水机器人，生态可扩展，插件无侵入~'
  }
  // 遍历关键词，匹配则回复
  for (const [key, reply] of Object.entries(replyMap)) {
    if (content.includes(key)) {
      await sendMsg(target, reply, type)
      break
    }
  }
}