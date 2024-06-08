import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger";
import {
  AssignRoleToUserBody,
  CreateUserBody,
  LoginBody,
} from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import {
  assignRoleTouser,
  createUser,
  getUserByEmail,
  getUsersByApplicationId,
} from "./users.services";
import { getRoleByName } from "../roles/roles.services";

//Creating user 
export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;
  const roleName = initialUser? SYSTEM_ROLES.SUPER_ADMIN:SYSTEM_ROLES.APPLICATION_USER; 
  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplicationId(data.applicationId);
    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super admin user",
        extensions: {
          code: "APPLICATION_ALRADY_ADMIN_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }
  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });
  if (!role) {
    return reply.code(404).send({ message: "Role not found" }); 
  }
  try {
    //creating new user in user Table
    const user = await createUser(data);
    //Creating new entry in userToRoles Table
    await assignRoleTouser({
      userId: user.id,
      roleId: role.id,
      applicationId: data.applicationId,
    });
    return user;
  } catch (e) {
    console.log(e);
  }
}

//Logging the user
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { applicationId, email, password } = request.body;
  const user = await getUserByEmail({ applicationId, email });
  if (!user) {
    return reply.code(400).send({ message: "User does not exist" });
  }
  const token = jwt.sign(
    {
      id: user.id,
      email,
      applicationId,
      scopes: user.permissions,
    },
    "secret"
  );
  return { user, token };
}

//Assigning Role
export async function assignRoleTouserHandler(
  request: FastifyRequest<{ Body: AssignRoleToUserBody }>,
  reply: FastifyReply
) {
  const applicationId = request.user.applicationId;
  const { userId, roleId } = request.body;
  try {
    const result = await assignRoleTouser({ userId, applicationId, roleId });
    return result;
  } catch (e) {
    logger.error(e, `error assigning role to user`);
    return reply.code(400).send({
      message: "could not assign role to user",
    });
  }
}

//When we are creating a user then a role will also be assigned to it so we are creating a new entry in userToRoles Table also 
//Also it is obvious that a new entry will be created in userToRoles Table when we assign a new role to the user