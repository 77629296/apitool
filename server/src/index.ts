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

// State lock to prevent concurrent execution from multiple shutdown signals
let isShuttingDown = false;

function shutdown(signal: string): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}, initiating graceful shutdown...`);

  // 1. Set a 3-second hard timeout to prevent the process from hanging.
  // Use unref() so the timer itself doesn't keep the event loop alive.
  const forceExitTimeout = setTimeout(() => {
    console.error("Graceful shutdown timed out, forcing exit.");
    process.exit(1);
  }, 3000).unref();

  // 2. Stop accepting new connections first to stabilize the state
  wss.close((serverErr) => {
    if (serverErr) {
      console.error("Gateway server close error:", serverErr);
    }

    // 3. Persist core session data to disk
    void flushSessions()
      .catch((flushErr) => console.error("Sessions flush failed:", flushErr))
      .finally(() => {
        clearTimeout(forceExitTimeout);

        // 4. Terminate any remaining active or zombie connections
        console.log("Closing active network connections...");
        if (wss.clients) {
          for (const client of wss.clients) {
            client.terminate();
          }
        }

        process.exit(serverErr ? 1 : 0);
      });
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
