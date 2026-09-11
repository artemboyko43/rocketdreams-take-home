# Meridian Voice Concierge

24/7 voice concierge for The Meridian Casino & Resort. Guests ask questions by voice; the agent answers from a seeded FAQ knowledge base and records anything it cannot answer.

```bash
cp .env.example .env
# fill LIVEKIT_* and OPENAI_API_KEY
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173).

## Layout

| Path | Role |
| --- | --- |
| `apps/api` | Fastify knowledge-base API |
| `apps/agent` | LiveKit voice agent |
| `apps/admin` | React staff console and playground |
| `packages/shared` | Zod contracts and voice catalog |

Full setup notes land with the Docker commit.

