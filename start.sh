#!/bin/bash
IP=$(ip route get 1 2>/dev/null | awk '{print $7; exit}' || ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1 || hostname -I 2>/dev/null | awk '{print $1}')
echo "🐝 Hive Friend starting..."
echo "   Phone: http://$IP:3000"
echo ""
export NEXT_PUBLIC_HIVE_API="http://$IP:8080"
export NEXT_PUBLIC_WS_URL="ws://$IP:3001"
export HIVE_API="http://$IP:8080"
export PORT=3000
npx ts-node websocket/server.ts &
WS_PID=$!
npx next dev -H 0.0.0.0 -p 3000
kill $WS_PID 2>/dev/null
