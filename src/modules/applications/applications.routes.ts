import { FastifyInstance } from "fastify";
import { createApplicationJsonSchema } from "./applications.schemas";
import {
  createApplicationHandler,
  getApplicationHandler,
} from "./applications.controllers";

//Routes for creating and getting Application
export async function applicationRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createApplicationJsonSchema,
    },
    createApplicationHandler
  );

  app.get("/", getApplicationHandler);
}
