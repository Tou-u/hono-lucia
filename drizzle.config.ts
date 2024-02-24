import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  // driver: "d1",
  driver: "better-sqlite",
  dbCredentials: {
    // wranglerConfigPath: "wrangler.toml",
    // dbName: "hono",
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/3002273b142ffd9023b3ad1a6f05ec7368b48ecb254a9f2195acd65eb068a14d.sqlite",
  },
} satisfies Config;
