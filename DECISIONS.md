# Technical decisions

## TypeScript everywhere

The PRD allows mixed languages. This assessment is for a TypeScript house (React 19, Vite, TanStack Query, Fastify, Zod, Vitest). The voice agent uses LiveKit’s Node SDK so frontend, API, and worker share types from `packages/shared`.

## Knowledge lookup is a backend concern

The LLM is a concierge, not a source of property facts. It must call `search_knowledge_base` before answering and `record_unanswered_question` on a miss. FAQ edits in the admin panel are live for the next turn, and operations get a real unanswered queue.

## Lexical search instead of embeddings

The corpus is ~50 curated FAQs. Embedding search would add a model call, a vector column, and a wrong-neighbor failure mode. A synonym-aware ranker is deterministic in CI, exact enough for the five PRD conversations, and easy to inspect when a match is wrong. The same `POST /api/faqs/search` contract could sit in front of `pgvector` later without changing the agent.

Generic tokens such as `hotel` and `room` are down-weighted. The most distinctive query token must match, so “can I bring my dog” does not invent a pet policy.

## STT → LLM → TTS, not a realtime model

Tool calling and per-session TTS voice control are more reliable on a chained pipeline. `gpt-4o-mini-tts` accepts speaking instructions, which is how James / Sofia / Marcus / Elena stay distinct on `ash`, `coral`, `echo`, and `sage`.

The active voice is read from the API at session start (NF-5). New playground sessions pick up the change immediately.

## Custom playground

A LiveKit room inside the admin panel covers microphone, playback, connection state, start/end, and a visible **Test mode** label. The public Agents Playground remains usable with a token from `POST /api/livekit/token`.

## No message broker

FAQ search and unanswered upserts are request/response. Frequency is a unique normalized question key plus an increment. A queue would be ceremony at this scale.

## Docker topology

`postgres` + `api` + `agent` + `admin`. LiveKit Cloud is the voice fabric required by the assessment. The API waits for Postgres, migrates, and seeds on boot so `docker compose up --build` is the launch command.
