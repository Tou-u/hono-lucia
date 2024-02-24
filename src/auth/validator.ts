import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schemaAuth = z.object({
  username: z.string({ required_error: "username required" }),
  password: z.string({ required_error: "password required" }),
});

export const zAuthValidator = zValidator("form", schemaAuth, (result, c) => {
  if (!result.success) {
    return c.json({ success: false, message: result.error.errors[0].message });
  }
});
