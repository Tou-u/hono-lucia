import { Context } from "hono";

declare global {
  type Bindings = {
    DB: D1Database;
  };

  export type APIContext = Context<{
    Bindings: Bindings;
  }>;
}

export default global;
