import { db } from "../../db";
import { role } from "../../db/schema";
import { InferInsertModel, and, eq } from "drizzle-orm";

//inserting data into role Table
export async function createRole(data: InferInsertModel<typeof role>) {
  const resultData = await db.insert(role).values(data).returning();

  return resultData[0];
}

//getting role info by searching its Primary Key {name,applicationId} from role Table
export async function getRoleByName({
  name,
  applicationId,
}: {
  name: string;
  applicationId: string;
}) {
  const result = await db
    .select()
    .from(role)
    .where(and(eq(role.applicationId, applicationId), eq(role.name, name)))
    .limit(1);

  return result[0];
}
