# Roaming Health API - Docker Setup

This guide explains how to run the Roaming Health API using Docker containers.

## Prerequisites

- Docker
- Docker Compose
- Node.js and pnpm (for local development)

## Quick Start

### Running the Application with Docker

1. **Start the application and database**:
   ```bash
   npm run docker:up
   ```
   This will:
   - Build the Docker image for the application
   - Start a PostgreSQL database container
   - Run database migrations
   - Start the NestJS application on port 3000

2. **Stop the application**:
   ```bash
   npm run docker:down
   ```

### Running Integration Tests with Docker

1. **Run tests against a separate test database**:
   ```bash
   npm run docker:test
   ```
   This will:
   - Build a test Docker image
   - Start a separate PostgreSQL test database on port 5433
   - Run all e2e tests
   - Clean up automatically after tests complete

2. **Clean up test containers and volumes**:
   ```bash
   npm run docker:test:clean
   ```

## Environment Variables

The application uses the following environment variables:

### Development (docker-compose.yml)
- `NODE_ENV=development`
- `PORT=3000`
- `NEON_DATABASE_URL=postgresql://postgres:password@postgres:5432/roaming_health`

### Testing (docker-compose.test.yml)
- `NODE_ENV=test`
- `NEON_DATABASE_URL=postgresql://postgres:password@test-postgres:5432/roaming_health_test`

## Docker Files

### Dockerfile
Multi-stage production build:
- **Builder stage**: Installs dependencies and builds the application
- **Production stage**: Creates optimized image with only production dependencies
- Includes health checks and runs as non-root user

### Dockerfile.test
Development image for running tests:
- Includes all dev dependencies
- Designed for running integration tests

## Services

### Application (app)
- Built from Dockerfile
- Exposes port 3000
- Depends on PostgreSQL database
- Includes health checks

### PostgreSQL Database (postgres)
- Uses PostgreSQL 16 Alpine image
- Development database on port 5432
- Test database on port 5433 (for isolation)
- Persistent volumes for development data
- Temporary filesystem for test data (faster and isolated)

## Database Migrations

Migrations are automatically run when the application starts. The migration files are located in `src/drizzle/migrations/`.

## Health Checks

The application includes health check endpoints:
- Application health: `GET /health`
- Database health: Built into Docker Compose configuration

## Development Workflow

1. **Local development** (without Docker):
   ```bash
   # Install dependencies
   pnpm install
   
   # Start development server
   npm run start:dev
   ```

2. **Docker development**:
   ```bash
   # Build and start with Docker
   npm run docker:up
   
   # View logs
   docker-compose logs -f app
   
   # Access database
   docker-compose exec postgres psql -U postgres -d roaming_health
   ```

3. **Running tests**:
   ```bash
   # Local e2e tests (uses PGlite)
   npm run test:e2e
   
   # Docker e2e tests (uses PostgreSQL)
   npm run docker:test
   ```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify connection string in environment variables

### Migration Issues
- Check migration files in `src/drizzle/migrations/`
- Manually run migrations: `docker-compose exec app npx drizzle-kit migrate`

### Test Issues
- Ensure test database is isolated: Each test run uses a fresh database
- Check test logs: `docker-compose -f docker-compose.test.yml logs`

### Port Conflicts
- Development database: Port 5432
- Test database: Port 5433
- Application: Port 3000

Make sure these ports are available on your system.

## Production Deployment

For production deployment, consider:

1. **Environment variables**: Set proper production values
2. **Database**: Use a managed PostgreSQL service (like Neon, AWS RDS, etc.)
3. **Secrets management**: Use Docker secrets or environment variable injection
4. **Reverse proxy**: Use nginx or similar for SSL termination
5. **Monitoring**: Add proper logging and monitoring solutions

Example production environment variables:
```bash
NODE_ENV=production
PORT=3000
NEON_DATABASE_URL=your_production_database_url
```
