import pino from "pino";

//Modified logger
export const logger = pino({
  redact: ["DATABASE_CONNECTION"],
  level: "debug",
  transport: {
    target: "pino-pretty",
  },
});
