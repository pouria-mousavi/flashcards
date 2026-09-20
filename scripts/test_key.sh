
#!/bin/sh
# Load credentials through the shared Node helper; never print a key.
cd "$(dirname "$0")/.." || exit 1
exec node scripts/test_openai.js
