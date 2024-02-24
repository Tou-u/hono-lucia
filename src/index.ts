import { Hono } from "hono";
import { auth } from "./auth";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", c => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);

export default app;
