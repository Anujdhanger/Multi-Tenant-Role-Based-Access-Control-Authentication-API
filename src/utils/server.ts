import fastify from "fastify";
import { logger } from "./logger";
import { application } from "../db/schema";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import guard from "fastify-guard";
import jwt from "jsonwebtoken";

type user = {
  applicationId: string;
  id: string;
  scopes: Array<string>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: user;
  }
}

//building server
export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.decorateRequest("user", null);

  app.addHook("onRequest", async function (request, reply) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return;
    }
    try {
      const token = authHeader.replace("Bearer", "");
      const decoded = jwt.verify(token, "secret") as user;

      request.user = decoded;
    } catch (e) {}
  });

  //register plugins
  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (result, request, reply) => {
      return reply.send("Permission denied!");
    },
  });

  //register routes
  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });
  return app;
}
