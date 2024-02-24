import { getCookie } from "hono/cookie";
import type { User, Session } from "lucia";

import { initializeLucia } from "@lib/lucia";

export class SessionService {
  private lucia: ReturnType<typeof initializeLucia>;
  private sessionCookie?: string;

  constructor(private ctx: APIContext) {
    this.lucia = initializeLucia(this.ctx.env.DB);
    this.sessionCookie = getCookie(this.ctx, this.lucia.sessionCookieName);
  }

  private async validateAndGetSession(): Promise<{
    user: User | null;
    session: Session | null;
  }> {
    if (!this.sessionCookie) {
      return { user: null, session: null };
    }

    const { user, session } = await this.lucia.validateSession(this.sessionCookie);

    return { user, session };
  }

  public async validateSession() {
    return this.validateAndGetSession();
  }

  public async getAllSessions() {
    const { user } = await this.validateAndGetSession();

    if (!user) {
      return null;
    }

    return await this.lucia.getUserSessions(user.id);
  }

  public async invalidateCurrentSession() {
    const { session } = await this.validateAndGetSession();

    if (!session) {
      return null;
    }

    await this.lucia.invalidateSession(session.id);

    return true;
  }

  public async invalidateAllSessions() {
    const { user } = await this.validateAndGetSession();

    if (!user) {
      return null;
    }

    await this.lucia.invalidateUserSessions(user.id);

    return true;
  }
}
