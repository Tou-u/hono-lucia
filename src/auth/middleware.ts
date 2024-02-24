import { MiddlewareHandler } from "hono";
import { SessionService } from "./services";

export const isAlreadyAuthenticated: MiddlewareHandler = async (c, next) => {
  const sessionService = new SessionService(c);
  const { user } = await sessionService.validateSession();

  if (user) {
    return c.json({ success: false, message: "already logged in" }, 401);
  }

  await next();
};
