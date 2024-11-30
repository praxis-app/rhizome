FROM node:22.11.0-alpine AS build_stage

RUN apk add --update python3 build-base

COPY src /app/src
COPY view /app/view
COPY scripts /app/scripts

COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app
COPY tsconfig.src.json /app
COPY tsconfig.view.json /app
COPY vite.config.ts /app
COPY .eslintrc.cjs /app
COPY .babelrc /app

WORKDIR /app
RUN npm ci

# Build args
ARG NODE_ENV
ARG SERVER_PORT
ARG RUN_MIGRATIONS

# Build the app
RUN npm run build
RUN npm run build:client

# Run migrations
ENV RUN_MIGRATIONS=${RUN_MIGRATIONS}
# RUN npm run typeorm:run

# Clean up for runtime image
RUN rm -rf node_modules
RUN npm ci --only=production
RUN rm -rf src
RUN rm -rf view

FROM node:22.11.0-alpine AS runtime_stage

COPY --from=build_stage /app /app

CMD [ "node", "/app/dist/main.js" ]