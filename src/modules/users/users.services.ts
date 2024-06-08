import { InferInsertModel, eq, and } from "drizzle-orm";
import { user, application, userToRoles, role } from "../../db/schema";
import argon2 from "argon2";
import { db } from "../../db";

//Inserting new user data into "user" table
export async function createUser(data: InferInsertModel<typeof user>) {
  const hashedPassword = await argon2.hash(data.password);
  const result = await db
    .insert(user)
    .values({ ...data, password: hashedPassword })
    .returning({
      id: user.id,
      email: user.email,
      name: user.name,
      applicationId: application.id,
    });
  return result[0];
}

//Functions name are explaining there functionalties
export async function getUsersByApplicationId(applicationId: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.applicationId, applicationId));
  return result;
}

export async function assignRoleTouser(
  data: InferInsertModel<typeof userToRoles>
) {
  const result = await db.insert(userToRoles).values(data).returning();
  return result[0];
}

export async function getUserByEmail({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) {
  const result = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      applicationId: user.applicationId,
      roleId: role.id,
      password: user.password,
      permissions: role.permissions,
    })
    .from(user)
    .where(and(eq(user.email, email), eq(user.applicationId, applicationId)))
    .leftJoin(
      userToRoles,
      and(
        eq(userToRoles.userId, user.id),
        eq(userToRoles.applicationId, user.applicationId)
      )
    )
    .leftJoin(role, eq(role.id, userToRoles.roleId));
  if (!result.length) {
    return null;
  }

  const users = result.reduce((acc, curr) => {
    if (!acc.id) {
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      };
    }
    if (!curr.permissions) {
      return acc;
    }
    for (const permission of curr.permissions) {
      acc.permissions.add(permission);
    }
    return acc;
  }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

  return { ...users, permissions: Array.from(users.permissions) };
  // return result;
}
