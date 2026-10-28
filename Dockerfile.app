# Lima monorepo application: the TS API (src-ts) and the Astro UI in a
# single container, single node process (src-ts/server-app.ts):
#   :3000 — Lima API (the frozen BDD contract)
#   :4321 — Astro UI (pages + /api/* endpoints; server-side fetches go
#           to 127.0.0.1:3000 inside this process)
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
# SERVER_API_URL is baked into the UI build by vite define; inside the
# container the API is the same process on 127.0.0.1:3000.
RUN ASTRO_ADAPTER_MODE=middleware \
    SERVER_API_URL=http://127.0.0.1:3000 \
    npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json tsconfig.backend.json ./
COPY src-ts ./src-ts
COPY resources ./resources
EXPOSE 4321
CMD ["node", "--import", "tsx", "src-ts/server-app.ts"]
