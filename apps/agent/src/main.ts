import "./load-env.ts";
import {
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  inference,
  llm,
  voice,
} from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import * as silero from "@livekit/agents-plugin-silero";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  buildInstructions,
  captureUnansweredIfUnknown,
  getActiveVoice,
  guestTextFromMessage,
  lookupKnowledge,
  recordUnanswered,
} from "./knowledge.ts";

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const voiceOption = await getActiveVoice();
    const vad = ctx.proc.userData.vad as silero.VAD;

    const agent = voice.Agent.create({
      instructions: buildInstructions(voiceOption.name),
      onUserTurnCompleted: async (_ctx, _chatCtx, newMessage) => {
        const text = guestTextFromMessage(newMessage);
        if (text) {
          await captureUnansweredIfUnknown(text);
        }
      },
      tools: [
        llm.tool({
          name: "search_knowledge_base",
          description:
            "Search The Meridian FAQ knowledge base for an answer. Call this before answering any factual guest question.",
          parameters: z.object({
            query: z.string().describe("The guest's question in natural language"),
          }),
          execute: async ({ query }) => lookupKnowledge(query),
        }),
        llm.tool({
          name: "record_unanswered_question",
          description:
            "Record a guest question that the knowledge base cannot answer so the concierge team can follow up.",
          parameters: z.object({
            question: z.string().describe("The guest question to store"),
          }),
          execute: async ({ question }) => {
            await recordUnanswered(question);
            return {
              recorded: true,
              message: "The question has been noted for the concierge team.",
            };
          },
        }),
      ],
    });

    const useOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
    const session = new voice.AgentSession(
      useOpenAI
        ? {
            vad,
            stt: new openai.STT({
              model: process.env.OPENAI_STT_MODEL ?? "gpt-4o-mini-transcribe",
              useRealtime: false,
            }),
            llm: new openai.LLM({
              model: process.env.OPENAI_LLM_MODEL ?? "gpt-4o-mini",
            }),
            tts: new openai.TTS({
              model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
              voice: voiceOption.ttsVoice as "ash" | "coral" | "echo" | "sage",
              instructions: voiceOption.instructions,
            }),
          }
        : {
            vad,
            stt: new inference.STT({ model: "deepgram/nova-3", language: "en" }),
            llm: new inference.LLM({ model: "openai/gpt-4.1-mini" }),
            tts: new inference.TTS({
              model: voiceOption.inferenceModel,
              voice: voiceOption.inferenceVoice,
              language: "en",
            }),
          },
    );

    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (event) => {
      if (event.isFinal && event.transcript.trim()) {
        void captureUnansweredIfUnknown(event.transcript);
      }
    });

    await session.start({
      agent,
      room: ctx.room,
    });
    await ctx.connect();
    await session.generateReply({
      instructions: `Greet the guest briefly in character as ${voiceOption.name} and offer help. One or two sentences. Do not mention tools.`,
    });
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: "meridian-concierge",
  }),
);
