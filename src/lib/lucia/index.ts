import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

export function initializeLucia(DB: D1Database) {
  const adapter = new D1Adapter(DB, { user: "user", session: "session" });

  return new Lucia(adapter, {
    getUserAttributes: attributes => {
      return { username: attributes.username };
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: {
      username: string;
    };
  }
}
