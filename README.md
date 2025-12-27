# tianshui-bot 部署与开发文档
## 项目介绍
基于NapCat + OneBot的插件化QQ机器人，支持JS插件热插拔，新增插件无需修改核心代码。

## 前置环境（Ubuntu）
1. 安装Node.js 18+、npm
2. 部署NapCat并完成QQ扫码登录
3. 开放3000端口（NapCat通信）

## 快速部署
1. 克隆项目：`git clone xxx tianshui-bot && cd tianshui-bot`
2. 安装依赖：`npm install`
3. 修改.env：配置NapCat地址、机器人QQ号
4. 启动机器人：`npm run start` / 后台启动：`npm run pm2:start`

## 插件开发规范
### JS插件
1. 在plugins目录新建**插件名**文件夹
2. 文件夹内创建index.js，暴露`init()`、`handleMsg()`两个核心方法
3. 直接放入plugins目录，重启机器人即可加载

### 核心方法说明
- init()：插件初始化逻辑，可选
- handleMsg(msg, sendMsg)：消息处理核心，必选
  - msg：消息对象（含发送人、内容、类型）
  - sendMsg：全局消息发送方法

## 常用命令
- 前台启动：npm run start
- 开发热更：npm run dev
- PM2后台启动：npm run pm2:start
- 查看日志：npm run pm2:logs