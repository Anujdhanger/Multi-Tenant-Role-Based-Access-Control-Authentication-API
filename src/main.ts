import { buildServer } from "./utils/server";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { logger } from "./utils/logger";
import { env } from "./config/env";
import { db } from "./db/index";

//graceful shutdown
async function gracefulshutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

//starting server
async function main() {
  const app = await buildServer();

  app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migration",
  });

  const signals = ["SIGINT", "SIGTERM"];
  logger.debug(env, "using env");
  for (const signal of signals) {
    process.on(signal, () => {
      gracefulshutdown({
        app,
      });
    });
  }
  logger.info("Server is running!");
}

main();
