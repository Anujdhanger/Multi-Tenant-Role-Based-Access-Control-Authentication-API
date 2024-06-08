import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

//Schema for creating Application
const createApplicationBodySchema = z.object({
  name: z.string({
    required_error: "Name required!",
  }),
});

export type CreateApplicationBody = z.infer<typeof createApplicationBodySchema>;
export const createApplicationJsonSchema = {
  body: zodToJsonSchema(
    createApplicationBodySchema,
    "createApplicationBodySchema"
  ),
};
