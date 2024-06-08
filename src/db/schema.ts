import {
  uniqueIndex,
  primaryKey,
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

//defining application Table
export const application = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

//defining user Table
export const user = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => application.id),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (user) => {
    return {
      cpk: primaryKey({ columns: [user.email, user.applicationId] }),
      idIndex: uniqueIndex("user_id_index").on(user.id),
    };
  }
);


//defining role Table
export const role = pgTable(
  "role",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => application.id),
    permissions: text("permissions").array().$type<Array<string>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (role) => {
    return {
      cpk: primaryKey({ columns: [role.name, role.applicationId] }),
      idIndex: uniqueIndex("role_id_index").on(role.id),
    };
  }
);

//defining userToRoles Table
export const userToRoles = pgTable(
  "userToRoles",
  {
    applicationId: uuid("applicationId")
      .references(() => application.id)
      .notNull(),
    roleId: uuid("roleId")
      .references(() => role.id)
      .notNull(),
    userId: uuid("userId")
      .references(() => user.id)
      .notNull(),
  },
  (userToRoles) => {
    return {
      cpk: primaryKey({
        columns: [
          userToRoles.applicationId,
          userToRoles.roleId,
          userToRoles.userId,
        ],
      }),
    };
  }
);
