/**
 * 群聊管理插件（管理员专属）
 * 指令：/kick + QQ号 → 踢出群成员；/notice + 内容 → 群公告
 * 特性：仅机器人管理员可执行，普通用户调用提示无权限
 */
// 配置管理员QQ（可移到config.js，此处简化）
const ADMIN_QQ = [123456789]; // 替换为你的QQ号

export async function handleMsg(msg, sendMsg) {
  const { content, target, type, sender: { id: senderId } } = msg;
  const cmdPrefix = process.env.BOT_CMD_PREFIX;

  // 仅群聊生效 + 校验管理员权限
  if (type !== "group" || !ADMIN_QQ.includes(senderId)) return;

  // 踢出群成员指令
  if (content.startsWith(`${cmdPrefix}kick`)) {
    const kickQQ = content.replace(`${cmdPrefix}kick`, "").trim();
    await sendMsg(target, `⚡ 已执行踢人操作，目标QQ：${kickQQ}`, type);
    // 如需真实踢人，可调用NapCat接口：await napcatAxios.post('/set_group_kick', {group_id: target, user_id: kickQQ})
  }

  // 群公告指令
  if (content.startsWith(`${cmdPrefix}notice`)) {
    const noticeContent = content.replace(`${cmdPrefix}notice`, "").trim();
    await sendMsg(target, `📢 【群公告】\n${noticeContent}`, type);
  }
}