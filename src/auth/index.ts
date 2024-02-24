import { Hono } from "hono";
import { Cookie } from "lucia";

import { SessionService, AuthService } from "./services";
import { zAuthValidator } from "./validator";
import { isAlreadyAuthenticated } from "./middleware";

const auth = new Hono<{ Bindings: Bindings }>();

auth.get("/", c => {
  return c.text("Auth module");
});

auth.post("/register", isAlreadyAuthenticated, zAuthValidator, async c => {
  const { username, password } = c.req.valid("form");

  const authService = new AuthService(c);
  const session = await authService.createAccount(username, password);

  if (!(session instanceof Cookie)) {
    return c.json(session, 400);
  }

  c.header("Set-Cookie", session.serialize(), { append: true });
  return c.json({ success: true, message: "account created" }, 200);
});

auth.post("/login", isAlreadyAuthenticated, zAuthValidator, async c => {
  const { username, password } = c.req.valid("form");

  const authService = new AuthService(c);
  const session = await authService.login(username, password);

  if (!(session instanceof Cookie)) {
    return c.json(session, 400);
  }

  c.header("Set-Cookie", session.serialize(), { append: true });
  return c.json({ success: true, message: "account logged in" }, 200);
});

auth.get("/validate", async c => {
  const sessionService = new SessionService(c);
  const user = await sessionService.validateSession();

  return c.json(user);
});

export { auth };
