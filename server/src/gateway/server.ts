import { WebSocketServer } from "ws";
import type { Config } from "../config.js";
import { handleConnection } from "./connection.js";
import { broadcastEvent } from "./clients.js";

export function startGateway(config: Config): WebSocketServer {
  const wss = new WebSocketServer({ host: config.host, port: config.port });

  setInterval(() => {
    broadcastEvent({
      type: "event",
      event: "tick",
      payload: { ts: Date.now() },
    });
  }, 1000);

  wss.on("connection", (socket) => {
    handleConnection(socket, config);
  });

  wss.on("listening", () => {
    console.log(`gateway ws://${config.host}:${config.port}`);
  });

  return wss;
}
