# Technical decisions

## TypeScript everywhere

The PRD allows mixed languages. This assessment is for a TypeScript house (React 19, Vite, TanStack Query, Fastify, Zod, Vitest). The voice agent uses LiveKit’s Node SDK so frontend, API, and worker share types from `packages/shared`.

## Knowledge lookup is a backend concern

The LLM is a concierge, not a source of property facts. It must call `search_knowledge_base` before answering. Unknown guest turns are also captured in `onUserTurnCompleted`, and a search miss with `captureUnanswered` is written to the unanswered queue so staff still see the question if the model only apologizes. FAQ edits in the admin panel are live for the next turn.

## Lexical search instead of embeddings

The corpus is ~50 curated FAQs. Embedding search would add a model call, a vector column, and a wrong-neighbor failure mode. A synonym-aware ranker is deterministic in CI, exact enough for the five PRD conversations, and easy to inspect when a match is wrong. The same `POST /api/faqs/search` contract could sit in front of `pgvector` later without changing the agent.

Generic tokens such as `hotel` and `room` are down-weighted. The most distinctive query token must match, so “can I bring my dog” does not invent a pet policy.

## STT → LLM → TTS via LiveKit Inference

Tool calling and per-session TTS are more reliable on a chained pipeline than a realtime speech-to-speech model. By default the agent uses **LiveKit Inference** (included with a free LiveKit Cloud project): Deepgram STT, an OpenAI-class LLM, and Inworld/Cartesia TTS. That matches the take-home instruction to create a free account rather than supplying vendor keys.

If `OPENAI_API_KEY` is set, the agent falls back to OpenAI plugins (`ash` / `coral` / `echo` / `sage` plus speaking instructions). The active voice is still read from the API at session start (NF-5).

## Custom playground

A LiveKit room inside the admin panel covers microphone, playback, connection state, start/end, and a visible **Test mode** label. The public Agents Playground remains usable with a token from `POST /api/livekit/token`.

## No message broker

FAQ search and unanswered upserts are request/response. Frequency is a unique normalized question key plus an increment. A queue would be ceremony at this scale.

## Docker topology

`postgres` + `api` + `agent` + `admin`. LiveKit Cloud is the voice fabric required by the assessment. The API waits for Postgres, migrates, and seeds on boot so `docker compose up --build` is the launch command.
