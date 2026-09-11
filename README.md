# Meridian Voice Concierge

24/7 voice concierge for The Meridian Casino & Resort. Guests ask questions by voice; the agent answers only from a seeded FAQ knowledge base and records anything it cannot answer.

## Quick start

```bash
cp .env.example .env
# fill LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET from cloud.livekit.io
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173). Click **Start conversation**, allow the microphone, and try:

- “Is the poker room open right now?”
- “What’s your best restaurant?”
- “Can I bring my dog to the hotel?” (recorded as unanswered)
- “Any good restaurants nearby?”

API health: [http://localhost:3001/health](http://localhost:3001/health)

## Credentials

Create a free project at [cloud.livekit.io](https://cloud.livekit.io). Open **Settings → Keys** and copy the three values into `.env`. That project includes **LiveKit Inference** (STT, LLM, TTS), so a separate OpenAI key is not required for voice.

| Variable | Purpose |
| --- | --- |
| `LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | Voice transport and LiveKit Inference |
| `OPENAI_API_KEY` | Optional. Admin **Preview** button, or to use OpenAI plugins instead of Inference |

The playground can hear each concierge voice without OpenAI. Preview in the Voices page still needs `OPENAI_API_KEY`.

## Layout


| Path              | Role                               |
| ----------------- | ---------------------------------- |
| `apps/api`        | Fastify knowledge-base API         |
| `apps/agent`      | LiveKit voice agent                |
| `apps/admin`      | React staff console and playground |
| `packages/shared` | Zod contracts and voice catalog    |




## Local development without Docker

Requires Node 22+ and Postgres 16 (`DATABASE_URL` in `.env`).

```bash
npm install
npm test
npm run dev:api
npm run dev:admin
npm run dev:agent
```



## API surface


| Method                  | Path                                 | Purpose                                |
| ----------------------- | ------------------------------------ | -------------------------------------- |
| `POST`                  | `/api/faqs/search`                   | Best FAQ match or `matched: false`     |
| `POST`                  | `/api/unanswered`                    | Record / increment an unknown question |
| `GET/POST/PATCH/DELETE` | `/api/faqs`                          | Admin FAQ CRUD                         |
| `GET`                   | `/api/unanswered`                    | Queue, with `?status=open`             |
| `POST`                  | `/api/unanswered/:id/convert`        | Promote to FAQ                         |
| `POST`                  | `/api/unanswered/:id/dismiss`        | Drop irrelevant items                  |
| `GET/PUT`               | `/api/voices` / `/api/voices/active` | List / select voice                    |
| `POST`                  | `/api/voices/:id/preview`            | TTS sample                             |
| `POST`                  | `/api/livekit/token`                 | Playground access token                |

## Tests

```bash
npm test
```

The ranker tests encode the five PRD example conversations.