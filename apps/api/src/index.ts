import { sqlClient } from "./db/client.ts";
import { migrate } from "./db/migrate.ts";
import { seed } from "./db/seed.ts";

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
  console.log("Meridian database ready", seeded);
  await sqlClient.end({ timeout: 5 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
