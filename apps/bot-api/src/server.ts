import { loadBotApiEnv } from "@tradara/shared-config";

import { createContainer } from "./container";
import { buildApp } from "./app";

const env = loadBotApiEnv(process.env);
const app = buildApp(createContainer(env));
const port = Number(process.env.PORT ?? env.BOT_API_PORT);

app
  .listen({
    host: "0.0.0.0",
    port
  })
  .catch((error: unknown) => {
    app.log.error(error);
    process.exit(1);
  });
