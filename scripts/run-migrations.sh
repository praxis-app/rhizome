#!/bin/bash

set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
    npm run typeorm migration:run -- -d ./src/database/data-source.ts
else
    echo "RUN_MIGRATIONS is not set. Skipping migrations."
fi