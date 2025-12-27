/**
 * tianshui-bot 全局静态配置
 * 无需修改核心代码，仅在此处调整配置即可
 */
export const CONFIG = {
  // 消息处理配置
  MSG_HANDLE_TIMEOUT: 5000, // 插件消息处理超时时间(ms)
  IGNORE_SELF_MSG: true,    // 是否忽略机器人自身发送的消息
  // 日志配置
  LOG_SAVE_FILE: false,     // 是否将日志保存到文件
  LOG_FILE_PATH: './logs/'  // 日志文件保存路径
}

/**
 * 插件白名单
 * 填写插件文件夹名，* 表示加载所有插件（推荐）
 * 示例：['auto-reply', 'help'] → 仅加载这两个插件
 */
export const PLUGIN_WHITE_LIST = ['*']

/**
 * 指令黑名单
 * 填写指令名，机器人将忽略这些指令
 */
export const CMD_BLACK_LIST = []