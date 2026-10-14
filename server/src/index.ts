import { loadConfig } from "./config.js";
import { startGateway } from "./gateway/server.js";
import {
  configureSessions,
  flushSessions,
  loadSessions,
} from "./gateway/sessions.js";

const config = loadConfig();
configureSessions(config.sessionsPath);

const loaded = await loadSessions();
console.log(`Sessions loaded: ${loaded} from ${config.sessionsPath}`);

const wss = startGateway(config);

// 引入状态锁，防止高频信号重复触发垃圾清理
let isShuttingDown = false;

function shutdown(signal: string): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}, initiating graceful shutdown...`);

  // 1. 设置 3 秒兜底硬退出强制防卡死，并在主线程卸载定时器使其不阻塞退出
  const forceExitTimeout = setTimeout(() => {
    console.error("Graceful shutdown timed out, forcing exit.");
    process.exit(1);
  }, 3000).unref();

  // 2. 优先对核心业务数据落地持久化
  void flushSessions()
    .catch((err) => console.error("Sessions flush failed:", err))
    .finally(() => {
      clearTimeout(forceExitTimeout);
      
      // 3. 核心大招：优雅关闭 WebSocket 服务的全清空动作
      console.log("Closing active network connections...");
      if (wss.clients) {
        for (const client of wss.clients) {
          client.terminate(); // 强行切断现存所有僵尸连接，不给死锁拖延时间的机会
        }
      }

      wss.close((err) => {
        if (err) console.error("Gateway server close error:", err);
        process.exit(err ? 1 : 0);
      });
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
