#!/bin/bash
set -e

echo "Starting database migration..."

# Wait for database to be ready
until pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USER:-postgres}; do
  echo "Waiting for database to be ready..."
  sleep 2
done

echo "Database is ready. Running migrations..."

# Run Drizzle migrations
npx drizzle-kit migrate

echo "Migrations completed successfully!"

# Start the application
exec "$@"
