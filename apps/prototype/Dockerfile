# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build TypeScript to JavaScript
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .
# Build-Output übernehmen
COPY --from=prerelease /usr/src/app/dist ./dist
# Seed-Daten kopieren
COPY --from=prerelease /usr/src/app/output ./output
# Drizzle-Konfiguration kopieren
COPY --from=prerelease /usr/src/app/drizzle.config.ts .
# Schema für drizzle-kit kopieren (braucht es zur Build-Zeit)
COPY --from=prerelease /usr/src/app/src/db/schema.ts ./src/db/schema.ts

# run the app
USER bun
EXPOSE 3000/tcp

# Runtime-Env
ENV PORT=3000
ENV DATABASE_URL=postgresql://app:app@db:5432/app
ENV VALKEY_HOST=cache
ENV VALKEY_PORT=6379
ENV SEED_DATA_DIR=/usr/src/app/output
ENV DRIZZLE_CONFIG_PATH=/usr/src/app/drizzle.config.ts

# Migration -> Seeding -> Serverstart
ENTRYPOINT [ "sh", "-c", "echo '[init] Starting database setup...'; bunx drizzle-kit push --config \"$DRIZZLE_CONFIG_PATH\" && echo '[init] Migration successful' || echo '[init] Migration failed, trying to continue'; sleep 2; bun run seed && echo '[init] Seeding successful' || echo '[init] Seeding failed, starting server anyway'; exec bun ./dist/src/app.js" ]
