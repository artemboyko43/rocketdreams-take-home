import "./load-env.ts";
import {
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  llm,
  voice,
} from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import * as silero from "@livekit/agents-plugin-silero";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { buildInstructions, getActiveVoice, recordUnanswered, searchKnowledge } from "./knowledge.ts";

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    const voiceOption = await getActiveVoice();
    const vad = ctx.proc.userData.vad as silero.VAD;

    const agent = voice.Agent.create({
      instructions: buildInstructions(voiceOption.name),
      tools: [
        llm.tool({
          name: "search_knowledge_base",
          description:
            "Search The Meridian FAQ knowledge base for an answer. Call this before answering any factual guest question.",
          parameters: z.object({
            query: z.string().describe("The guest's question in natural language"),
          }),
          execute: async ({ query }) => {
            const result = await searchKnowledge(query);
            if (!result.matched || !result.match) {
              return {
                matched: false,
                message: "No reliable answer is in the knowledge base.",
              };
            }
            return {
              matched: true,
              answer: result.match.faq.answer,
              question: result.match.faq.question,
              category: result.match.faq.category,
              related: result.alternatives.map((item) => item.faq.answer),
            };
          },
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

    const session = new voice.AgentSession({
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
