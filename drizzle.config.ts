import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql", 
  out: "./migration",
  breakpoints: false,
});
