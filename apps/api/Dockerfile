FROM node:22-bookworm-slim

WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN npm install --workspace=@meridian/api --include-workspace-root

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["npm", "start"]
