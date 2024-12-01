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
ARG DB_MIGRATIONS

# Build the app
RUN npm run build
RUN npm run build:client

# Clean up for runtime image
RUN rm package-lock.json vite.config.ts
RUN rm tsconfig.json tsconfig.view.json
RUN rm .eslintrc.cjs .babelrc
RUN rm -rf view

FROM node:22.11.0-alpine AS runtime_stage

COPY --from=build_stage /app /app
ENV DB_MIGRATIONS=${DB_MIGRATIONS}
CMD [ "sh", "/app/scripts/start-prod.sh" ]