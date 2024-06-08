import { FastifyInstance } from "fastify";
import {
  AssignRoleToUserBody,
  assignRoleTouserJsonSchema,
  createUserJsonSchema,
  loginJsonSchema,
} from "./users.schemas";
import {
  assignRoleTouserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import { PERMISSIONS } from "../../config/permissions";

//Routes for creating, login and assigning a role to user
export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  app.post(
    "/login",
    {
      schema: loginJsonSchema,
    },
    loginHandler
  );

  app.post<{
    Body: AssignRoleToUserBody;
  }>(
    "/roles",
    {
      schema: assignRoleTouserJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleTouserHandler
  );
}
