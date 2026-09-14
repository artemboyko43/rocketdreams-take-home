import { buildApp } from "./app.ts";
import { sqlClient } from "./db/client.ts";
import { migrate } from "./db/migrate.ts";
import { seed } from "./db/seed.ts";

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

async function waitForDatabase() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      await sqlClient`SELECT 1`;
      return;
    } catch (error) {
      if (attempt === 30) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function main() {
  await waitForDatabase();
  await migrate();
  const seeded = await seed();
  const app = await buildApp();
  await app.listen({ port, host });
  app.log.info({ port, seeded }, "Meridian API ready");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
