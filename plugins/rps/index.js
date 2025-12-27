/**
 * tianshui-bot 石头剪刀布插件
 * 指令格式：/rps + 出拳（石头/剪刀/布）
 * 支持：私聊/群聊、胜负判定、本局战绩反馈、简单战绩统计
 * 特性：无额外依赖、纯原生编写、直接加载运行
 */

// 1. 全局配置 & 数据存储（内存临时存储，重启失效）
const CMD_PREFIX = process.env.BOT_CMD_PREFIX; // 指令前缀（从.env读取）
const RPS_TYPE = ["石头", "剪刀", "布"]; // 出拳选项
const battleRecord = new Map(); // 战绩统计：key=用户QQ，value={win:胜, lose:负, draw:平}

// ✅ 【可选】插件初始化方法
export function init() {
  console.log("🔧 [rps] 石头剪刀布插件初始化完成 → 指令：/rps 石头/剪刀/布");
}

// ✅ 【必选】消息处理核心方法
export async function handleMsg(msg, sendMsg) {
  const {
    content,
    target,
    type,
    sender: { id: userId, name: userName }
  } = msg;

  // 1. 匹配石头剪刀布指令：/rps 石头 / /rps 剪刀 / /rps 布
  const rpsReg = new RegExp(`^${CMD_PREFIX}rps\\s*(石头|剪刀|布)$`);
  if (rpsReg.test(content)) {
    // 2. 解析用户出拳 + 机器人随机出拳
    const userChoice = rpsReg.exec(content)[1];
    const botChoice = RPS_TYPE[Math.floor(Math.random() * 3)];

    // 3. 胜负判定核心逻辑
    let result = "";
    if (userChoice === botChoice) {
      result = "🤝 平局！";
      updateRecord(userId, "draw");
    } else if (
      (userChoice === "石头" && botChoice === "剪刀") ||
      (userChoice === "剪刀" && botChoice === "布") ||
      (userChoice === "布" && botChoice === "石头")
    ) {
      result = "🎉 你赢啦！";
      updateRecord(userId, "win");
    } else {
      result = "💥 你输啦！";
      updateRecord(userId, "lose");
    }

    // 4. 组装回复消息（带本局结果+个人战绩）
    const userRecord = battleRecord.get(userId) || { win: 0, lose: 0, draw: 0 };
    const replyMsg = `
🎮 【石头剪刀布 - 对局结果】
▸ 玩家【${userName}】：${userChoice}
▸ 机器人【tianshui-bot】：${botChoice}
▸ 本局结果：${result}

📊 你的个人战绩
✅ 胜利：${userRecord.win} 局 | ❌ 失败：${userRecord.lose} 局 | 🤝 平局：${userRecord.draw} 局
💡 继续玩：发送【${CMD_PREFIX}rps 石头/剪刀/布】即可开局
    `.replace(/^\s+/gm, "");

    // 5. 发送结果消息（自动适配私聊/群聊）
    await sendMsg(target, replyMsg, type);
  }
}

// ✅ 战绩更新工具函数（内部方法，不对外暴露）
function updateRecord(userId, type) {
  if (!battleRecord.has(userId)) {
    battleRecord.set(userId, { win: 0, lose: 0, draw: 0 });
  }
  const record = battleRecord.get(userId);
  switch (type) {
    case "win": record.win++; break;
    case "lose": record.lose++; break;
    case "draw": record.draw++; break;
  }
  battleRecord.set(userId, record);
}