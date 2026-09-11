import type { FastifyInstance } from "fastify";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { LivekitTokenRequestSchema } from "@meridian/shared";

export async function registerLivekitRoutes(app: FastifyInstance) {
  app.post("/api/livekit/token", async (request, reply) => {
    const body = LivekitTokenRequestSchema.parse(request.body ?? {});
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return reply.code(503).send({
        error: "LiveKit is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.",
      });
    }

    const roomName = body.roomName ?? `meridian-${crypto.randomUUID().slice(0, 8)}`;
    const participantName = body.participantName ?? "Guest";
    const token = new AccessToken(apiKey, apiSecret, {
      identity: `guest-${crypto.randomUUID().slice(0, 8)}`,
      name: participantName,
      ttl: "10m",
    });
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    const roomConfig = new RoomConfiguration();
    roomConfig.agents = [new RoomAgentDispatch({ agentName: "meridian-concierge" })];
    token.roomConfig = roomConfig;

    return {
      serverUrl,
      participantToken: await token.toJwt(),
      roomName,
      participantName,
    };
  });
}
