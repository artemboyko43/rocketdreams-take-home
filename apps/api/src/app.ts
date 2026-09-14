import Fastify from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { registerFaqRoutes } from "./routes/faqs.ts";
import { registerUnansweredRoutes } from "./routes/unanswered.ts";
import { registerVoiceRoutes } from "./routes/voices.ts";
import { registerLivekitRoutes } from "./routes/livekit.ts";

export async function buildApp() {
  const app = Fastify({ logger: true });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, { origin: true });

  app.get("/health", async () => ({ ok: true, service: "meridian-api" }));

  await registerFaqRoutes(app);
  await registerUnansweredRoutes(app);
  await registerVoiceRoutes(app);
  await registerLivekitRoutes(app);

  app.setErrorHandler((error, _request, reply) => {
    const err = error instanceof Error ? error : new Error(String(error));
    const status =
      typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    if (typeof error === "object" && error !== null && "issues" in error) {
      return reply.code(400).send({ error: "Invalid request", details: error });
    }
    app.log.error(err);
    return reply.code(status >= 400 && status < 600 ? status : 500).send({ error: err.message });
  });

  return app;
}
