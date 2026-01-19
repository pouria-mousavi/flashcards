
#!/bin/bash
# Load .env manually
export $(grep -v '^#' .env | xargs)

echo "Testing Key: ${VITE_CLAUDE_KEY:0:10}..."

curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $VITE_CLAUDE_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-3-haiku-20240307",
    "max_tokens": 10,
    "messages": [
        {"role": "user", "content": "Hello, world"}
    ]
}'
