# Meridian Voice Concierge

24/7 voice concierge for The Meridian Casino & Resort. Guests ask questions by voice; the agent answers only from a seeded FAQ knowledge base and records anything it cannot answer.

## Quick start

```bash
cp .env.example .env
# fill LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, OPENAI_API_KEY
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173). Click **Start conversation**, allow the microphone, and try:

- “Is the poker room open right now?”
- “What’s your best restaurant?”
- “Can I bring my dog to the hotel?” (recorded as unanswered)
- “Any good restaurants nearby?”

API health: [http://localhost:3001/health](http://localhost:3001/health)

## Credentials


| Variable                                                 | Purpose                                     |
| -------------------------------------------------------- | ------------------------------------------- |
| `LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | Realtime voice transport and agent dispatch |
| `OPENAI_API_KEY`                                         | STT, LLM, TTS, and admin voice preview      |


Optional: `OPENAI_BASE_URL`, `OPENAI_LLM_MODEL`, `OPENAI_STT_MODEL`, `OPENAI_TTS_MODEL` if the provided keys point at a compatible gateway.

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