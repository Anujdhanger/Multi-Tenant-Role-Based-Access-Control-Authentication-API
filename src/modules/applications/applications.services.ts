import { db } from "../../db";
import { application } from "../../db/schema";
import { InferInsertModel } from "drizzle-orm";

// inserting data into Application Table
export async function createApplication(
  data: InferInsertModel<typeof application>
) {
  const result = await db.insert(application).values(data).returning();

  return result[0];
}

//getting info about an application from its id;
export async function getApplication() {
  const result = await db
    .select({
      id: application.id,
      name: application.name,
      createdAt: application.createdAt,
    })
    .from(application);

  return result;
}
