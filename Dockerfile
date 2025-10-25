# --- Build frontend ---
FROM node:20-alpine AS web
WORKDIR /app
COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci
COPY web ./web
RUN cd web && npm run build


# --- Build backend ---
FROM node:20-alpine AS server
WORKDIR /srv
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server ./server
RUN cd server && npm run build


# --- Runtime ---
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /srv
COPY --from=server /server/dist ./dist
COPY --from=server /server/node_modules ./node_modules
# Serve built frontend statics from /srv/public
COPY --from=web /app/web/dist ./public
EXPOSE 8080
CMD ["node", "dist/index.js"]
