## Description

POC for Roaming Health -- Connecting healthcare workers with open shifts.

## Project setup

```bash
$ pnpm install
```

## Running with Docker 🐳

For the complete Docker setup guide, see [DOCKER.md](./DOCKER.md).

### Quick Start with Docker

```bash
# Start application with PostgreSQL database
$ npm run docker:up

# Run integration tests with separate test database
$ npm run docker:test

# Stop everything
$ npm run docker:down
```

## Local Development

## Compile and run the project

```bash
# development
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# e2e tests
$ pnpm run exp:e2e

# Docker e2e tests (with PostgreSQL)
$ npm run docker:test
```
