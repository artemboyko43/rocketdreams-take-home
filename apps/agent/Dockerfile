FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared ./packages/shared
COPY apps/agent ./apps/agent
RUN npm install --workspace=@meridian/agent --include-workspace-root

WORKDIR /app/apps/agent
CMD ["npm", "start"]
