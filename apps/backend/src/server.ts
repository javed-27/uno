import http from "http";
import { createApp } from "./app";
import { createSocketServer } from "./socketServer";
import { config } from "./config";
import { logger } from "./logger";

const app = createApp();
const server = http.createServer(app);

createSocketServer(server);

server.listen(config.port, () => {
  logger.info(`Server listening on ${config.port}`, {
    nodeEnv: config.nodeEnv,
  });
});
