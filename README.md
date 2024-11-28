# Rhizome

Rhizome represents a new approach for Praxis, emphasizing seamless integration with existing systems while laying the groundwork for an autonomous, self-sustaining platform. The project aims to strike a balance between versatile utility and a standalone platform, with chat as the primary medium for collaborative decision-making (CDM) functionality.

By embracing both integration and the autonomy of a standalone platform, Rhizome opens the door to greater user adoption without compromising the security and reliability offered by a core platform.

## Project goals

- **Rhizomatic design**: A more rhizomatic approach to the design of both features and architecture.
- **Hybrid platform/utility**: Strike a balance between versatile utility and a standalone platform.
- **Chat as the primary medium**: Use chat as the primary medium for CDM functionality.
- **REST and OpenAPI**: Provide a simple REST API and OpenAPI for integration with other systems.
- **Vite and Express**: Embraces flexible, modular, unopinionated architecture.

## Installation

Ensure that you're using Node v20.16.0 before proceeding.

```bash
# Install project dependencies
$ npm install
```

## Running the app

```bash
# Start server for development
$ npm run start

# Start client for development
$ npm run start:client
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view and interact with the UI.

## Docker

Ensure that you have [Docker](https://docs.docker.com/engine/install) installed to use the following commands.

```bash
# Start app in a container
$ docker compose up -d

# Build and restart app after making changes
$ docker compose up -d --build
```
