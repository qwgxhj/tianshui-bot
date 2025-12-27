/**
 * 版本查询插件
 * 指令：/version → 查看机器人版本信息
 */
export async function handleMsg(msg, sendMsg) {
  const { content, target, type } = msg;
  const cmdPrefix = process.env.BOT_CMD_PREFIX;

  // 匹配指令
  if (content === `${cmdPrefix}version`) {
    const versionMsg = `
🤖 tianshui-bot 版本信息
▸ 版本号：v1.0.0
▸ 运行环境：Node.js ${process.version}
▸ 协议适配：NapCat/OneBot v11
▸ 插件总数：${global.plugins.length} 个
    `.replace(/^\s+/gm, "");
    await sendMsg(target, versionMsg, type);
  }
}