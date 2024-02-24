import { eq } from "drizzle-orm";
import { generateId, Scrypt } from "lucia";

import { getConnection } from "@lib/db";
import { userTable } from "@lib/db/schema";
import { initializeLucia } from "@lib/lucia";

export class AuthService {
  private lucia: ReturnType<typeof initializeLucia>;
  private drizzle: ReturnType<typeof getConnection>;

  constructor(private ctx: APIContext) {
    this.lucia = initializeLucia(this.ctx.env.DB);
    this.drizzle = getConnection(this.ctx.env.DB);
  }

  private async checkForExistingUser(username: string) {
    const existingUser = await this.drizzle.query.userTable.findFirst({
      where: eq(userTable.username, username),
    });

    return existingUser;
  }

  private async createSessionAndCookie(userId: string) {
    const newSession = await this.lucia.createSession(userId, {});
    return this.lucia.createSessionCookie(newSession.id);
  }

  public async createAccount(username: string, password: string) {
    try {
      const scrypt = new Scrypt();
      const hash = await scrypt.hash(password);

      const [user] = await this.drizzle
        .insert(userTable)
        .values({ id: generateId(15), username, password: hash })
        .returning();

      return this.createSessionAndCookie(user.id);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "D1_ERROR: UNIQUE constraint failed: user.username"
      ) {
        return { success: false, message: "username already used" };
      }
      return { success: false, message: "an unknown error occurred" };
    }
  }

  public async login(username: string, password: string) {
    const foundUser = await this.checkForExistingUser(username);
    if (!foundUser) {
      return { success: false, message: "incorrect username or password" };
    }

    const validPassword = await new Scrypt().verify(foundUser.password, password);
    if (!validPassword) {
      return { success: false, message: "incorrect username or password" };
    }

    return this.createSessionAndCookie(foundUser.id);
  }
}
