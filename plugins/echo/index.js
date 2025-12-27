/**
 * 复读指令插件 - tianshui-bot
 * 指令：/echo <内容> → 复读指定内容
 */
export async function handleMsg(msg, sendMsg) {
  const { content, target, type } = msg
  const cmdPrefix = process.env.BOT_CMD_PREFIX
  
  // 匹配复读指令并提取内容
  if (content.startsWith(`${cmdPrefix}echo`)) {
    const echoContent = content.replace(`${cmdPrefix}echo`, '').trim()
    if (echoContent) {
      await sendMsg(target, `🔁 复读：${echoContent}`, type)
    } else {
      await sendMsg(target, `❌ 用法错误！正确格式：${cmdPrefix}echo <需要复读的内容>`, type)
    }
  }
}