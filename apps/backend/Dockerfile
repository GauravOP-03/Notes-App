FROM node:20-alpine
WORKDIR /app
COPY ./apps/backend ./apps/backend
COPY ./packages/zod-schemas ./packages/zod-schemas
COPY ./pnpm-workspace.yaml ./
COPY ./pnpm-lock.yaml ./
COPY ./package.json ./

RUN npm install -g pnpm
RUN pnpm install --filter backend...
RUN pnpm --filter zod-schemas build
RUN pnpm install

WORKDIR ./app/apps/backend
CMD ["pnpm", "index.js"]