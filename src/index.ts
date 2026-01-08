import { createApp } from "./app";
import { logger } from "./lib/logger";

const PORT = 3000;
const app = createApp();

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server is running");
});
