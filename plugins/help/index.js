/**
 * 帮助指令插件 - tianshui-bot
 * 指令：/help → 查看所有可用指令
 */
export async function handleMsg(msg, sendMsg) {
  const { content, target, type } = msg
  const cmdPrefix = process.env.BOT_CMD_PREFIX
  
  // 匹配指令前缀+help
  if (content === `${cmdPrefix}help`) {
    const helpMsg = `
📚 ${process.env.BOT_NAME} 指令帮助
${cmdPrefix}help → 查看本帮助文档
${cmdPrefix}echo <内容> → 复读你发送的内容
📌 其他功能：发送【你好/机器人/天水】触发自动回复
    `.replace(/^\s+/gm, '')
    await sendMsg(target, helpMsg, type)
  }
}