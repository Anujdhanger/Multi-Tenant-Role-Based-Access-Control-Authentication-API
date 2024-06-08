import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./applications.schemas";
import { createApplication, getApplication } from "./applications.services";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";
import { createRole } from "../roles/roles.services";

//function for handling creation of Application
export async function createApplicationHandler(
  request: FastifyRequest<{
    Body: CreateApplicationBody;
  }>,
  reply: FastifyReply
) {
  const { name } = request.body;

  const application = await createApplication({
    name,
  });

  const superAdminRole = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as Array<string>,
  });

  const applicationUserRole = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });
  return {
    application,
    superAdminRole,
    applicationUserRole,
  };
}

//function for handling getting Application
export async function getApplicationHandler() {
  return getApplication();
}
