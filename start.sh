#!/bin/sh
echo "=== Atticus Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "GOOGLE_CLIENT_ID set: $([ -n "$GOOGLE_CLIENT_ID" ] && echo 'YES' || echo 'NO')"
echo "ANTHROPIC_API_KEY set: $([ -n "$ANTHROPIC_API_KEY" ] && echo 'YES' || echo 'NO')"
echo "DATABASE_URL set: $([ -n "$DATABASE_URL" ] && echo 'YES' || echo 'NO')"
echo "PORT: ${PORT:-3000}"
echo "===================="
exec npx next start -H 0.0.0.0 -p ${PORT:-3000}
