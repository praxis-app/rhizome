#!/bin/bash

set -e

if [ "$DB_MIGRATIONS" = "true" ]; then
    npm run typeorm migration:run -- -d ./src/database/data-source.ts
else
    echo "DB_MIGRATIONS is not set. Skipping migrations."
fi