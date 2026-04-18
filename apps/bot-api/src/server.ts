import { loadBotApiEnv } from "@tradara/shared-config";

import { createContainer } from "./container";
import { buildApp } from "./app";

const env = loadBotApiEnv(process.env);
const app = buildApp(createContainer(env));

app
  .listen({
    host: "0.0.0.0",
    port: env.BOT_API_PORT
  })
  .catch((error: unknown) => {
    app.log.error(error);
    process.exit(1);
  });
